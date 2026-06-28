import React, { createContext, useState, useContext } from 'react';
import { LoginResponse } from '../types/auth-types';

// Define the context type
interface AuthContextType {
  user: LoginResponse['user'] | null;
  token: string | null;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider component without React.FC
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (response: LoginResponse) => {
    setUser(response.user);
    setToken(response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};