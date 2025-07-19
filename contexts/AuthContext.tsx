import { authAPI } from '@/utils/api';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface User {
  userId: number;
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await authAPI.login(username, password);
    
    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      setUser({ userId: response.data.userId, username: response.data.username });
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const response = await authAPI.register(username, email, password);
    
    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      // Don't auto-login after registration - user must login separately
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const logout = async () => {
    await authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 