import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserData } from '@/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData | null;
  user: UserData | null; // Alias para userData
  login: (userNameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const isInitialized = await authService.initializeFromStorage();
      if (isInitialized) {
        setIsAuthenticated(true);
        setUserData(authService.getUserData());
      }
    } catch (_error) {
      // Error al inicializar, mantenemos el estado sin autenticar
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    userNameOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.login({ userNameOrEmail, password });

      if (response.Success) {
        setIsAuthenticated(true);
        setUserData(authService.getUserData());
        return true;
      }

      return false;
    } catch (_error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUserData(null);
    } catch (_error) {
      // En caso de error, forzamos el logout local
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    userData,
    user: userData, // Alias para userData
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
