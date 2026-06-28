import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

// Define types for the auth context
type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  student_id?: string;
  program_id?: number;
  [key: string]: any; // For any additional properties
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  isLoggedIn: boolean; // Add this missing property
  isLoading: boolean; // Add this missing property
  login: (username: string, password: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  register: (registerData: any) => Promise<void>;
  updateUserProfile: (userData: any) => Promise<void>;
  sessionTimeRemaining: number | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  userRole: null,
  isLoggedIn: false, // Include default value
  isLoading: true,   // Include default value
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUserProfile: async () => {},
  sessionTimeRemaining: null,
});

// Create AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<number | null>(null);
  
  // Ref for the interval timer
  const sessionCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to check auth status and session time
  const checkAuthStatus = async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      
      if (isLoggedIn) {
        const userData = await authService.getUserData();
        const role = await authService.getUserRole();
        
        setUser(userData);
        setUserRole(role);
        setIsAuthenticated(true);
        
        // Only calculate remaining time for student users
        if (role === 'student') {
          // Calculate remaining session time
          await updateSessionTimeRemaining();
        } else {
          setSessionTimeRemaining(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        setSessionTimeRemaining(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setSessionTimeRemaining(null);
    }
  };
  
  // Function to update session time remaining
  const updateSessionTimeRemaining = async () => {
    try {
      const loginTimestamp = await AsyncStorage.getItem('login_timestamp');
      if (loginTimestamp) {
        const loginTime = parseInt(loginTimestamp, 10);
        const currentTime = Date.now();
        const sessionAge = currentTime - loginTime;
        const remainingTime = Math.max(0, 24 * 60 * 60 * 1000 - sessionAge);
        
        setSessionTimeRemaining(remainingTime);
        
        // If session expired, log out
        if (remainingTime <= 0) {
          logout();
        }
      } else {
        setSessionTimeRemaining(null);
      }
    } catch (error) {
      console.error('Error calculating session time:', error);
      setSessionTimeRemaining(null);
    }
  };

  // Check authentication status when app starts
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        await checkAuthStatus();
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    
    return () => {
      // Clean up interval on unmount
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, []);

  // Set up interval to check session status for students
  useEffect(() => {
    // Clean up any existing interval
    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
    
    // Only set up interval if user is authenticated and is a student
    if (isAuthenticated && userRole === 'student') {
      sessionCheckInterval.current = setInterval(async () => {
        // Check if session is still valid
        await checkAuthStatus();
      }, 60000); // Check every minute
    }
    
    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [isAuthenticated, userRole]);

  // Login function
  const login = async (username: string, password: string, role: 'student' | 'admin') => {
    try {
      setLoading(true);
      const result = await authService.login(username, password, role);
      setUser(result.user);
      setUserRole(role);
      setIsAuthenticated(true);
      
      // Reset session time remaining for student users
      if (role === 'student') {
        setSessionTimeRemaining(24 * 60 * 60 * 1000); // 24 hours in milliseconds
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setSessionTimeRemaining(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (registerData: any) => {
    try {
      setLoading(true);
      await authService.register(registerData);
      // Note: typically we would auto-login after registration,
      // but for this app we'll require explicit login
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (userData: any) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide auth context to all child components
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        userRole,
        isLoggedIn: isAuthenticated,
        isLoading: loading,
        login,
        logout,
        register,
        updateUserProfile,
        sessionTimeRemaining
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;