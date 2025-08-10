import { apiService, ApiResponse } from './apiService';
import type { LoginResponse } from '@/dto/auth/Response/LoginResponse';
import type { LoginRequest } from '@/dto/auth/Request/LoginRequest';
import type { RefreshTokenResponse } from '@/dto/auth/Response/RefreshTokenResponse';
import type { RefreshTokenRequest } from '@/dto/auth/Request/RefreshTokenRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  email: string;
  gymId?: string;
}

// Auto-generated service for Auth Azure Functions
export const authService = {
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      '/auth/login',
      request
    );
    
    // Guardar datos del usuario en AsyncStorage si el login es exitoso
    if (response.Success && response.Data) {
      await AsyncStorage.setItem('@user_data', JSON.stringify(response.Data));
      await AsyncStorage.setItem('@user_id', response.Data.UserId);
      // Guardar tokens si existen y configurar Authorization global
      if (response.Data.Token) {
        await AsyncStorage.setItem('authToken', response.Data.Token);
        apiService.setAuthToken(response.Data.Token);
      }
      if (response.Data.RefreshToken) {
        await AsyncStorage.setItem('refreshToken', response.Data.RefreshToken);
      }
    }
    
    return response;
  },
  async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiService.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      request
    );
    return response;
  },

  // Métodos adicionales para compatibilidad
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      if (!userData) return false;
      
      // Lógica de validación del token
      return true;
    } catch {
      return false;
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem('@user_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getUserId(): string | null {
    // Implementación síncrona basada en datos en memoria
    return null; // Placeholder
  },

  getGymId(): string | null {
    // Implementación síncrona basada en datos en memoria
    return null; // Placeholder
  },

  isAuthenticated(): boolean {
    // Implementación síncrona de verificación
    return false; // Placeholder
  },

  async initializeFromStorage(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      return userData !== null;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('@user_data');
  await AsyncStorage.removeItem('@auth_token');
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('refreshToken');
  apiService.removeAuthToken();
    } catch {
      // Handle error silently
    }
  },

  async refreshAuthToken(): Promise<ApiResponse<boolean>> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken || !token) {
        return { Success: false, Data: false, Message: 'No refresh token available', StatusCode: 401 };
      }

      const response = await this.refreshToken({ Token: token, RefreshToken: refreshToken });
      if (response.Success && response.Data) {
        await AsyncStorage.setItem('authToken', response.Data.NewToken);
        return { Success: true, Data: true, Message: 'Token refreshed successfully', StatusCode: 200 };
      }
      return { Success: false, Data: false, Message: 'Failed to refresh token', StatusCode: 400 };
    } catch (error) {
      console.error('Error refreshing auth token:', error);
      return { Success: false, Data: false, Message: 'Token refresh error', StatusCode: 500 };
    }
  },

  // Método para refrescar datos del usuario (alias para compatibilidad)
  async refreshUserData(): Promise<UserData | null> {
    return this.getUserData();
  }
};
