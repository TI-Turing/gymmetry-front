import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { LoginResponse } from '@/dto/auth/Response/LoginResponse';
import type { LoginRequest } from '@/dto/auth/Request/LoginRequest';
import type { RefreshTokenResponse } from '@/dto/auth/Response/RefreshTokenResponse';
import type { RefreshTokenRequest } from '@/dto/auth/Request/RefreshTokenRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

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
  _rawUser: null as unknown | null,
  _activeRoutineTemplateId: null as string | null,

  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      '/auth/login',
      request
    );

    // Guardar datos del usuario en AsyncStorage si el login es exitoso
    if (response.Success && response.Data) {
      // Guardar base y luego enriquecer con GymId del perfil completo
      let raw: unknown = response.Data as unknown;
      try {
        const { userService } = await import('./userService');
        const r = (raw ?? {}) as Record<string, unknown>;
        const userId = (r['UserId'] as string) ?? (r['Id'] as string);
        if (userId) {
          const profile = await userService.getUserById(userId);
          if (profile?.Success && profile.Data) {
            const p = profile.Data as unknown;
            const prec = (p ?? {}) as Record<string, unknown>;
            const gymId = (prec['GymId'] as string) ?? null;
            raw = { ...(r as object), GymId: gymId } as Record<string, unknown>;
          }
        }
      } catch {}

      // Derivar roles antes de guardar
      raw = await this._deriveAndAttachRoles(raw);
      this._rawUser = raw;
      await AsyncStorage.setItem('@user_data', JSON.stringify(raw));
      try {
        const rr = (raw ?? {}) as Record<string, unknown>;
        const uid = (rr['UserId'] as string) ?? (rr['Id'] as string) ?? '';
        await AsyncStorage.setItem('@user_id', uid);
      } catch {}
      // Detectar RoutineTemplateId activo (primer RoutineAssigneds si existe)
      try {
        const rr = (raw ?? {}) as Record<string, unknown>;
        const maybe = rr['RoutineAssigneds'] as unknown;
        const routineAssigneds = Array.isArray(maybe)
          ? maybe
          : (isRecord(maybe) &&
            Array.isArray((maybe as Record<string, unknown>)['$values'])
              ? ((maybe as Record<string, unknown>)['$values'] as unknown[])
              : []) || [];
        if (Array.isArray(routineAssigneds) && routineAssigneds.length > 0) {
          const active = routineAssigneds[0];
          const ar = (active ?? {}) as Record<string, unknown>;
          const rtid =
            (ar['RoutineTemplateId'] as string) ||
            (ar['routineTemplateId'] as string) ||
            null;
          if (rtid) {
            this._activeRoutineTemplateId = rtid;
            await AsyncStorage.setItem('@active_routine_template_id', rtid);
          }
        }
      } catch {}
      // Guardar tokens si existen y configurar Authorization global
      if (response.Data.Token) {
        await AsyncStorage.setItem('authToken', response.Data.Token);
        apiService.setAuthToken(response.Data.Token);
      }
      if (response.Data.RefreshToken) {
        await AsyncStorage.setItem('refreshToken', response.Data.RefreshToken);
      }
      // Persistir expiraciones (formato ISO esperado del backend)
      try {
        if (response.Data.TokenExpiration) {
          await AsyncStorage.setItem(
            '@token_expiration',
            response.Data.TokenExpiration
          );
        }
        if (response.Data.RefreshTokenExpiration) {
          await AsyncStorage.setItem(
            '@refresh_token_expiration',
            response.Data.RefreshTokenExpiration
          );
        }
      } catch {}
    }

    return response;
  },
  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiService.post<RefreshTokenResponse>(
      '/auth/refresh-token',
      request
    );
    return response;
  },

  // Métodos adicionales para compatibilidad
  async checkAndRefreshToken(): Promise<boolean> {
    try {
      // Verificar tokens básicos primero (sin dependencia de getUserData)
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userData = await AsyncStorage.getItem('@user_data');

      if (!token || !refreshToken || !userData) {
        return false;
      }

      // Actualizar el token en apiService si no está configurado
      apiService.setAuthToken(token);

      const tokenExpIso = await AsyncStorage.getItem('@token_expiration');
      const refreshExpIso = await AsyncStorage.getItem(
        '@refresh_token_expiration'
      );

      if (!refreshExpIso) {
        return true; // no info => asumimos válido hasta que falle
      }

      const now = Date.now();
      let tokenExpired = false;
      let refreshExpired = false;
      const SAFETY_WINDOW_MS = 60_000; // refrescar si faltan <60s

      if (tokenExpIso) {
        const tokenExp = Date.parse(tokenExpIso);
        if (!isNaN(tokenExp)) {
          tokenExpired = tokenExp - now < SAFETY_WINDOW_MS;
        }
      }

      const refreshExp = Date.parse(refreshExpIso);
      if (!isNaN(refreshExp)) {
        refreshExpired = refreshExp <= now;
      }

      if (refreshExpired) {
        await this.logout();
        return false;
      }

      if (tokenExpired) {
        const refreshed = await this.refreshAuthToken();
        return !!refreshed?.Success && !!refreshed.Data;
      }

      return true;
    } catch (error) {
      console.error('Error in checkAndRefreshToken:', error);
      return false;
    }
  },

  async getUserData(): Promise<UserData | null> {
    try {
      // Preferir cache en memoria si existe
      const cached =
        this._rawUser ??
        JSON.parse((await AsyncStorage.getItem('@user_data')) || 'null');
      if (!cached) return null;
      const raw = (cached ?? {}) as Record<string, unknown>;
      // Normalizar nombres comunes de forma segura
      const id =
        (raw['Id'] as string) ??
        (raw['UserId'] as string) ??
        (raw['id'] as string) ??
        null;
      const email =
        (raw['Email'] as string) ?? (raw['email'] as string) ?? null;
      const gymId =
        (raw['GymId'] as string) ?? (raw['gymId'] as string) ?? null;
      const userName =
        (raw['UserName'] as string) ?? (raw['userName'] as string) ?? null;
      const rolesVal = (raw['DerivedRoles'] as unknown) ?? null;
      const roles: string[] = Array.isArray(rolesVal)
        ? (rolesVal as string[])
        : ['user'];
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
    const r = (this._rawUser ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ?? (r['UserId'] as string) ?? (r['id'] as string);
    return id ?? null;
  },

  getGymId(): string | null {
    const r = (this._rawUser ?? {}) as Record<string, unknown>;
    const gid = (r['GymId'] as string) ?? (r['gymId'] as string) ?? null;
    return gid ?? null;
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
        const rec = (this._rawUser ?? {}) as Record<string, unknown>;
        const dr = rec['DerivedRoles'];
        if (!Array.isArray(dr)) {
          this._rawUser = await this._deriveAndAttachRoles(this._rawUser);
          await AsyncStorage.setItem(
            '@user_data',
            JSON.stringify(this._rawUser)
          );
        }
        // Cargar RoutineTemplateId activo si existe
        try {
          const rid = await AsyncStorage.getItem('@active_routine_template_id');
          this._activeRoutineTemplateId = rid || null;
        } catch {}
      }

      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        apiService.setAuthToken(token);
      }

      return this._rawUser !== null;
    } catch (error) {
      console.error('Error in initializeFromStorage:', error);
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
      await AsyncStorage.removeItem('@active_routine_template_id');
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
      this._activeRoutineTemplateId = null;
    } catch {
      // Handle error silently
    }
  },

  async refreshAuthToken(): Promise<ApiResponse<boolean>> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken || !token) {
        return {
          Success: false,
          Data: false,
          Message: 'No refresh token available',
          StatusCode: 401,
        };
      }

      const response = await this.refreshToken({
        Token: token,
        RefreshToken: refreshToken,
      });
      if (response.Success && response.Data) {
        await AsyncStorage.setItem('authToken', response.Data.NewToken);
        apiService.setAuthToken(response.Data.NewToken);
        try {
          if (response.Data.TokenExpiration)
            await AsyncStorage.setItem(
              '@token_expiration',
              response.Data.TokenExpiration
            );
        } catch {}
        return {
          Success: true,
          Data: true,
          Message: 'Token refreshed successfully',
          StatusCode: 200,
        };
      }
      return {
        Success: false,
        Data: false,
        Message: 'Failed to refresh token',
        StatusCode: 400,
      };
    } catch (error) {
      console.error('Error refreshing auth token:', error);
      return {
        Success: false,
        Data: false,
        Message: 'Token refresh error',
        StatusCode: 500,
      };
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

  async _deriveAndAttachRoles(raw: unknown): Promise<unknown> {
    try {
      const r = (raw ?? {}) as Record<string, unknown>;
      const gymId = (r['GymId'] as string) ?? null;
      const roles: string[] = gymId ? ['user', 'owner'] : ['user'];
      return {
        ...(r as object),
        DerivedRoles: roles,
      } as Record<string, unknown>;
    } catch {
      const r = (raw ?? {}) as Record<string, unknown>;
      return {
        ...(r as object),
        DerivedRoles: ['user'],
      } as Record<string, unknown>;
    }
  },

  hasRole(role: string): boolean {
    const raw = this._rawUser as unknown;
    if (!raw) return false;
    const r = (raw ?? {}) as Record<string, unknown>;
    const rolesVal = r['DerivedRoles'];
    const roles: string[] = Array.isArray(rolesVal)
      ? (rolesVal as string[])
      : ['user'];
    return roles.includes(role.toLowerCase());
  },

  getActiveRoutineTemplateId(): string | null {
    return this._activeRoutineTemplateId;
  },

  async setActiveRoutineTemplateId(id: string | null) {
    this._activeRoutineTemplateId = id;
    try {
      if (id) await AsyncStorage.setItem('@active_routine_template_id', id);
      else await AsyncStorage.removeItem('@active_routine_template_id');
    } catch {}
  },
};
