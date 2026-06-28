import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authService } from '../services/authService';

// Base URL for our API - corrected port to 3000 (server's default port in app.js)
// Different IP addresses based on platform
const getApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://192.168.31.203:3000/api'; // Android emulator
  } else if (Platform.OS === 'ios')  {
    return 'http://192.168.50.56:3000/api'; // iOS simulator
  } else {
    return 'http://localhost:3000/api'; // Web
  }
};

const API_URL = getApiUrl();

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout for slow connections
});

// Flag to prevent multiple concurrent token refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Add request interceptor to add auth token to requests and handle token refresh
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Skip token refresh check for login, register, and refresh-token endpoints
      const skipAuthPaths = ['/auth/login', '/auth/register', '/auth/refresh-token'];
      const isAuthEndpoint = skipAuthPaths.some(path => config.url?.includes(path));
      
      if (!isAuthEndpoint) {
        // Get a fresh token if needed
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = authService.refreshTokenIfNeeded();
          const token = await refreshPromise;
          isRefreshing = false;
          refreshPromise = null;
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else if (refreshPromise) {
          // Wait for the ongoing refresh to complete
          const token = await refreshPromise;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          // Fallback to current token
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } else {
        // For auth endpoints, just use whatever token is available if needed
        const token = await AsyncStorage.getItem('auth_token');
        if (token && config.url !== '/auth/login' && config.url !== '/auth/register') {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle token expiration error
    if (error.response && error.response.status === 401 && 
        error.response.data?.message === 'Token expired.' && 
        error.config && !error.config._retry) {
      
      error.config._retry = true; // Mark that we've tried to refresh once
      
      try {
        // Try to refresh the token
        const token = await authService.refreshToken();
        if (token) {
          // If refresh successful, update the Authorization header and retry
          error.config.headers.Authorization = `Bearer ${token}`;
          return apiClient(error.config); // Retry the request with new token
        }
      } catch (refreshError) {
        console.error('Failed to refresh token during response intercept:', refreshError);
        // If refresh fails, redirect to login
        await authService.logout();
        // Here you might want to trigger navigation to login screen
        // This depends on your navigation setup
      }
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error Details:', {
        message: 'Cannot connect to the server. Please check your network connection or server status.',
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    } else if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_URL };