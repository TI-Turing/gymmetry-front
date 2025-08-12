import { apiService, ApiResponse } from './apiService';
import type { LoginResponse } from '@/dto/auth/Response/LoginResponse';
import type { LoginRequest } from '@/dto/auth/Request/LoginRequest';
import type { RefreshTokenResponse } from '@/dto/auth/Response/RefreshTokenResponse';
import type { RefreshTokenRequest } from '@/dto/auth/Request/RefreshTokenRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserData {
  id: string;
  email: string;
  gymId?: string | null;
  userName?: string | null;
  roles: string[]; // Solo 'user' y opcionalmente 'owner'
  isOwner: boolean;
}

// Auto-generated service for Auth Azure Functions
export const authService = {
  // Caché en memoria de la última data de usuario cruda (tal cual viene del backend)
  _rawUser: null as any | null,

  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      '/auth/login',
      request
    );
    
    // Guardar datos del usuario en AsyncStorage si el login es exitoso
    if (response.Success && response.Data) {
      // Guardar base y luego enriquecer con GymId del perfil completo
      let raw: any = response.Data as any;
      try {
        const { userService } = await import('./userService');
        const userId = raw.UserId ?? raw.Id;
        if (userId) {
          const profile = await userService.getUserById(userId);
          if (profile?.Success && profile.Data) {
            raw = { ...raw, GymId: (profile.Data as any).GymId ?? null };
          }
        }
      } catch {}

  // Derivar roles antes de guardar
  raw = await this._deriveAndAttachRoles(raw);
  this._rawUser = raw;
      await AsyncStorage.setItem('@user_data', JSON.stringify(raw));
      await AsyncStorage.setItem('@user_id', (raw as any).UserId ?? (raw as any).Id ?? '');
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
      // Preferir cache en memoria si existe
      const raw = this._rawUser ?? JSON.parse((await AsyncStorage.getItem('@user_data')) || 'null');
      if (!raw) return null;
      // Normalizar nombres comunes
      const id = raw.Id ?? raw.UserId ?? raw.id ?? null;
      const email = raw.Email ?? raw.email ?? null;
      const gymId = raw.GymId ?? raw.gymId ?? null;
      const userName = raw.UserName ?? raw.userName ?? null;
      const roles: string[] = Array.isArray(raw.DerivedRoles) ? raw.DerivedRoles : ['user'];
      return id && email
        ? {
            id,
            email,
            gymId,
            userName,
            roles,
            isOwner: roles.includes('owner'),
          }
        : null;
    } catch {
      return null;
    }
  },

  getUserId(): string | null {
    const raw = this._rawUser;
    return (raw?.Id ?? raw?.UserId ?? null) as string | null;
  },

  getGymId(): string | null {
    const raw = this._rawUser;
    return (raw?.GymId ?? raw?.gymId ?? null) as string | null;
  },

  isAuthenticated(): boolean {
    return !!this._rawUser;
  },

  async initializeFromStorage(): Promise<boolean> {
    try {
  const data = await AsyncStorage.getItem('@user_data');
  this._rawUser = data ? JSON.parse(data) : null;
  if (this._rawUser) {
    // Asegurar que roles estén presentes (en caso de versiones anteriores guardadas sin ellos)
    if (!Array.isArray(this._rawUser?.DerivedRoles)) {
      this._rawUser = await this._deriveAndAttachRoles(this._rawUser);
      await AsyncStorage.setItem('@user_data', JSON.stringify(this._rawUser));
    }
  }
  const token = await AsyncStorage.getItem('authToken');
  if (token) apiService.setAuthToken(token);
  return this._rawUser !== null;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      // Limpiar datos de usuario y tokens
  await AsyncStorage.removeItem('@user_data');
  await AsyncStorage.removeItem('@auth_token');
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('refreshToken');
      // Limpiar referencias de gimnasio persistidas para evitar mostrar datos antiguos
      await AsyncStorage.removeItem('@gym_id');
      await AsyncStorage.removeItem('@gym_cache');
      // Limpiar caché en memoria del gymService si está cargado
      try {
        const { gymService } = await import('./gymService');
        gymService.clearCache?.();
      } catch {}
  apiService.removeAuthToken();
  this._rawUser = null;
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
    if (this._rawUser) {
      this._rawUser = await this._deriveAndAttachRoles(this._rawUser);
      await AsyncStorage.setItem('@user_data', JSON.stringify(this._rawUser));
    }
    return this.getUserData();
  },

  async _deriveAndAttachRoles(raw: any): Promise<any> {
    try {
      const gymId = raw?.GymId ?? null;
      const roles: string[] = gymId ? ['user', 'owner'] : ['user'];
      return { ...raw, DerivedRoles: roles };
    } catch {
      return { ...raw, DerivedRoles: ['user'] };
    }
  },

  hasRole(role: string): boolean {
    const raw = this._rawUser;
    if (!raw) return false;
    const roles: string[] = Array.isArray(raw?.DerivedRoles) ? raw.DerivedRoles : ['user'];
    return roles.includes(role.toLowerCase());
  }
};
