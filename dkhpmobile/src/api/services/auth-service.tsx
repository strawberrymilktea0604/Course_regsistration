// Định nghĩa các hàm gọi API liên quan đến xác thực người dùng (đăng nhập, đăng xuất, v.v.)
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api-config';
import { LoginResponse } from '../types/auth-types';

export const authService = {
    /**
     * Login user with username and password
     * IMPORTANT: Server expects plain text password and role parameter
     * Server will handle password hashing with bcrypt
     */
    login: async (username: string, password: string, role: 'student' | 'admin' = 'student'): Promise<LoginResponse> => {
        try {
            console.log(`Attempting login: ${username} with role: ${role}`);
            
            // Send plain password - server does bcrypt comparison
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
            
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Logout user and clear stored data
     */
    logout: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_role');
            await AsyncStorage.removeItem('user_data');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },
    
    /**
     * Check if user is logged in
     */
    isLoggedIn: async (): Promise<boolean> => {
        try {
            const token = await AsyncStorage.getItem('auth_token');
            return !!token;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
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
    }
};