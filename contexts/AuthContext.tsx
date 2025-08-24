import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, UserData } from '@/services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: UserData | null;
  user: UserData | null; // Alias para userData
  userRoles: string[];
  hasRole: (role: string) => boolean;
  login: (UserNameOrEmail: string, password: string) => Promise<boolean>;
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
        // Intentar refrescar token si está cerca de expirar
        const tokenValid = await authService.checkAndRefreshToken();

        if (tokenValid) {
          const user = await authService.getUserData();

          if (user) {
            setIsAuthenticated(true);
            setUserData(user);
          } else {
            await authService.logout();
            setIsAuthenticated(false);
            setUserData(null);
          }
        } else {
          await authService.logout();
          setIsAuthenticated(false);
          setUserData(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsAuthenticated(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    UserNameOrEmail: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authService.login({
        UserNameOrEmail,
        Password: password,
      });

      if (response.Success) {
        setIsAuthenticated(true);
        setUserData(await authService.getUserData());

        // Trigger preload después de login exitoso (usando callback para evitar dependencias)
        setTimeout(() => {
          // El PreloadProvider detectará automáticamente el cambio de autenticación
          // y precargará los datos necesarios
        }, 100);

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
    userRoles: userData?.roles || ['user'],
    hasRole: (role: string) => !!userData?.roles.includes(role.toLowerCase()),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
