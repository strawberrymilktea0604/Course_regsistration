import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api-config';
import { jwtDecode } from 'jwt-decode';

// Interface for the decoded JWT token
interface DecodedToken {
  exp: number;  // Expiration time
  id: number;
  username: string;
  role: string;
  iat: number;  // Issued at time
}

// Constants
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const LOGIN_TIMESTAMP_KEY = 'login_timestamp';

/**
 * Service for handling authentication operations
 */
export const authService = {
  /**
   * Login user with username and password
   * @param username - User's username
   * @param password - User's password
   * @param role - User role (student or admin)
   */
  login: async (username: string, password: string, role: 'student' | 'admin') => {
    try {
      console.log(`Attempting login: ${username} with role: ${role}`);
      
      // Use a simplified endpoint for login
      const response = await apiClient.post('/auth/login', { 
        username, 
        password,
        role
      });
      
      console.log('Login response status:', response.status);
      
      // Extract token and user data
      const { token, user } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store token and user data
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_role', role);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      
      // Store login timestamp for session expiration check
      const loginTimestamp = Date.now().toString();
      await AsyncStorage.setItem(LOGIN_TIMESTAMP_KEY, loginTimestamp);
      
      console.log('Authentication data stored successfully');
      return response.data;
    } catch (error: any) {
      console.error('Login service error:', error.message);
      // Add more context to the error for better troubleshooting
      if (error.code === 'ERR_NETWORK') {
        error.message = 'Network error: Unable to connect to the server. Check if the server is running.';
      }
      throw error;
    }
  },
  
  /**
   * Register a new user
   * @param userData - User registration data
   */
  register: async (userData: any) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
  
  /**
   * Logout user and clear stored data
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_role');
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem(LOGIN_TIMESTAMP_KEY);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  /**
   * Check if user is logged in and if session is still valid
   */
  isLoggedIn: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return false;
      
      // Check if session has expired (24 hours)
      if (await authService.isSessionExpired()) {
        console.log('Session expired. User needs to log in again.');
        await authService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Check login status error:', error);
      return false;
    }
  },
  
  /**
   * Check if the session has expired (24 hours)
   * @returns {Promise<boolean>} True if the session has expired
   */
  isSessionExpired: async (): Promise<boolean> => {
    try {
      const role = await AsyncStorage.getItem('user_role');
      
      // Only apply the 24-hour restriction to students
      if (role === 'student') {
        const loginTimestamp = await AsyncStorage.getItem(LOGIN_TIMESTAMP_KEY);
        
        if (!loginTimestamp) {
          // If no timestamp found, consider session expired
          return true;
        }
        
        const loginTime = parseInt(loginTimestamp, 10);
        const currentTime = Date.now();
        const sessionAge = currentTime - loginTime;
        
        console.log(`Session age: ${Math.round(sessionAge / (60 * 60 * 1000))} hours`);
        
        // Check if more than 24 hours have passed since login
        return sessionAge > SESSION_DURATION_MS;
      }
      
      // For non-student roles, session doesn't expire based on time
      return false;
    } catch (error) {
      console.error('Session expiration check error:', error);
      // If there's an error, consider the session expired for security
      return true;
    }
  },
  
  /**
   * Get current user data
   */
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  },
  
  /**
   * Get current user role
   */
  getUserRole: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('user_role');
    } catch (error) {
      console.error('Get user role error:', error);
      return null;
    }
  },
  
  /**
   * Update user profile
   * @param userData - Updated user data
   */
  updateProfile: async (userData: any) => {
    try {
      const response = await apiClient.put('/students/profile', userData);
      // Update stored user data
      const updatedUser = response.data;
      const currentUserData = await AsyncStorage.getItem('user_data');
      if (currentUserData) {
        const parsedData = JSON.parse(currentUserData);
        const newUserData = { ...parsedData, ...updatedUser };
        await AsyncStorage.setItem('user_data', JSON.stringify(newUserData));
      }
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  /**
   * Change user password
   * @param currentPassword - Current password
   * @param newPassword - New password
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  /**
   * Request password reset
   * @param email - User's email
   */
  requestPasswordReset: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Request password reset error:', error);
      throw error;
    }
  },
  
  /**
   * Refresh the authentication token if it's close to expiration
   * @returns {Promise<string>} The current or refreshed token
   */
  refreshTokenIfNeeded: async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return null;
      
      // Check if session has expired for students
      if (await authService.isSessionExpired()) {
        console.log('Session expired. Forcing logout.');
        await authService.logout();
        return null;
      }
      
      // Decode the token to check its expiration time
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Calculate token expiration time
      // Check if token will expire in the next hour (3600000 ms)
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      console.log(`Token expires in ${Math.round(timeUntilExpiry / 60000)} minutes`);
      
      // If token expires in less than 1 hour, refresh it
      if (timeUntilExpiry < 3600000) {
        console.log("Token is expiring soon - refreshing...");
        return await authService.refreshToken();
      }
      
      return token;
    } catch (error) {
      console.error('Error in refreshTokenIfNeeded:', error);
      return null;
    }
  },
  
  /**
   * Get a fresh token from the server
   * @returns {Promise<string>} A refreshed token
   */
  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      const { token } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('auth_token', token);
        console.log('Token refreshed successfully');
        return token;
      }
      
      return null;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      // If refresh fails, maybe token is invalid, clear the auth data
      if (error.response && error.response.status === 401) {
        await authService.logout();
      }
      return null;
    }
  }
};