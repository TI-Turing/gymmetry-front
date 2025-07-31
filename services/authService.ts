import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, ApiResponse } from './apiService';
import {
  LoginRequest,
  LoginResponseData,
  RefreshTokenResponseData,
} from '@/dto/auth';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const TOKEN_EXPIRATION_KEY = '@token_expiration';
const REFRESH_TOKEN_EXPIRATION_KEY = '@refresh_token_expiration';
const USER_DATA_KEY = '@user_data';
const USER_ID_KEY = '@user_id';
const PLAN_ID_KEY = '@plan_id';
const GYM_ID_KEY = '@gym_id';
const USERNAME_KEY = '@username';
const GYM_DATA_KEY = '@gym_data';

interface UserData {
  userId: string;
  userName: string;
  email: string;
  planId: string | null;
  gymId: string | null;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiration: Date | null = null;
  private refreshTokenExpiration: Date | null = null;
  private userData: UserData | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponseData>> {
    try {
      const response = await apiService.post<LoginResponseData>(
        '/auth/login',
        credentials
      );
      console.log('🔐 Respuesta de login:', response.Success);
      if (response.Success) {
        // Guardar token y datos del usuario
        this.token = response.Data.Token;
        this.refreshToken = response.Data.RefreshToken;
        this.tokenExpiration = new Date(response.Data.TokenExpiration);
        this.refreshTokenExpiration = new Date(
          response.Data.RefreshTokenExpiration
        );
        const user = response.Data.User;
        this.userData = {
          userId: response.Data.UserId,
          userName: response.Data.UserName || user.UserName || '',
          email: response.Data.Email,
          planId: user.PlanId,
          gymId: user.GymId,
        };

        // Persistir en AsyncStorage
        if (this.token && this.refreshToken) {
          await AsyncStorage.setItem(TOKEN_KEY, this.token);
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, this.refreshToken);
          await AsyncStorage.setItem(
            TOKEN_EXPIRATION_KEY,
            this.tokenExpiration.toISOString()
          );
          await AsyncStorage.setItem(
            REFRESH_TOKEN_EXPIRATION_KEY,
            this.refreshTokenExpiration.toISOString()
          );
          await AsyncStorage.setItem(
            USER_DATA_KEY,
            JSON.stringify(this.userData)
          );

          // Persistir datos adicionales por separado
          await AsyncStorage.setItem(USER_ID_KEY, this.userData.userId);
          if (this.userData.planId) {
            await AsyncStorage.setItem(PLAN_ID_KEY, this.userData.planId);
          }
          if (this.userData.gymId) {
            await AsyncStorage.setItem(GYM_ID_KEY, this.userData.gymId);
          }
          if (this.userData.userName) {
            await AsyncStorage.setItem(USERNAME_KEY, this.userData.userName);
          }
        }

        // Configurar token en el servicio API
        apiService.setAuthToken(this.token);

        // Consultar información del gym si existe (ahora delegado al GymService)
        if (this.userData.gymId) {
          try {
            const { GymService } = await import('./gymService');
            await GymService.fetchAndCacheGymData(this.userData.gymId);
          } catch {
            // No hacer nada si falla la obtención de datos del gym
          }
        }

        // Precargar datos adicionales en segundo plano
        this.precargarDatosInicio();

        // Retornar la respuesta del API directamente con formato ApiResponse
        return response;
      } else {
        // Si no hay datos válidos en la respuesta
        throw new Error('Respuesta de login inválida');
      }
    } catch (error) {
      console.log('❌ Error en login:', error);
      throw error;
    }
  }

  // Método para precargar datos de inicio (sin bloquear el login)
  private async precargarDatosInicio(): Promise<void> {
    try {
      // Aquí puedes agregar consultas adicionales para precargar datos
      // Por ejemplo: estadísticas del usuario, notificaciones, etc.
      // Ejemplo de consulta (descomenta cuando tengas endpoints listos):
      // const response = await apiService.get('/api/dashboard/stats');
      // if (response.data.Success) {
      //   await AsyncStorage.setItem('@inicio_data', JSON.stringify(response.data.Data));
      // }
    } catch {
      // Silenciosamente fallar la precarga para no afectar el login
    }
  }

  async logout(): Promise<void> {
    try {
      // Limpiar datos locales
      this.token = null;
      this.refreshToken = null;
      this.tokenExpiration = null;
      this.refreshTokenExpiration = null;
      this.userData = null;

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(TOKEN_EXPIRATION_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_EXPIRATION_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      await AsyncStorage.removeItem(USER_ID_KEY);
      await AsyncStorage.removeItem(PLAN_ID_KEY);
      await AsyncStorage.removeItem(GYM_ID_KEY);
      await AsyncStorage.removeItem(USERNAME_KEY);
      await AsyncStorage.removeItem(GYM_DATA_KEY);

      // Limpiar token del servicio API
      apiService.removeAuthToken();
    } catch {
      // En caso de error, limpiar al menos los datos en memoria
      this.token = null;
      this.refreshToken = null;
      this.tokenExpiration = null;
      this.refreshTokenExpiration = null;
      this.userData = null;
    }
  }

  async initializeFromStorage(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      const tokenExpirationString =
        await AsyncStorage.getItem(TOKEN_EXPIRATION_KEY);
      const refreshTokenExpirationString = await AsyncStorage.getItem(
        REFRESH_TOKEN_EXPIRATION_KEY
      );
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      const storedUserId = await AsyncStorage.getItem(USER_ID_KEY);

      if (
        token &&
        refreshToken &&
        tokenExpirationString &&
        refreshTokenExpirationString &&
        userDataString
      ) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.tokenExpiration = new Date(tokenExpirationString);
        this.refreshTokenExpiration = new Date(refreshTokenExpirationString);
        this.userData = JSON.parse(userDataString);
        if (this.userData && storedUserId) {
          this.userData.userId = storedUserId;
        }

        // Cargar datos del gym si existe gymId (ahora usando GymService)
        if (this.userData?.gymId) {
          try {
            const { GymService } = await import('./gymService');
            await GymService.loadGymDataFromStorage();
          } catch {
            // Silenciosamente fallar si no se pueden cargar datos del gym
          }
        }

        // Verificar si el refresh token está expirado
        if (this.refreshTokenExpiration <= new Date()) {
          // Refresh token expirado, limpiar sesión
          await this.logout();
          return false;
        }

        // Configurar token en el servicio API primero (incluso si está expirado)
        apiService.setAuthToken(this.token);

        // Verificar si el token necesita ser refrescado
        if (this.tokenExpiration <= new Date()) {
          // Token expirado, intentar refrescar
          console.log('🔄 Token expirado, intentando refresh...');
          const refreshed = await this.refreshAuthToken();
          if (!refreshed) {
            console.log('❌ Refresh falló, cerrando sesión');
            await this.logout();
            return false;
          }
          console.log('✅ Token refrescado exitosamente');
        }

        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return (
      this.token !== null &&
      this.userData !== null &&
      this.refreshToken !== null &&
      this.refreshTokenExpiration !== null &&
      this.refreshTokenExpiration > new Date()
    );
  }

  getToken(): string | null {
    return this.token;
  }

  getUserData(): UserData | null {
    return this.userData;
  }

  getUserId(): string | null {
    return this.userData?.userId || null;
  }

  getPlanId(): string | null {
    return this.userData?.planId || null;
  }

  getGymId(): string | null {
    return this.userData?.gymId || null;
  }

  getUserName(): string | null {
    return this.userData?.userName || null;
  }

  // Método público para que los componentes puedan verificar el token antes de operaciones importantes
  async checkAndRefreshToken(): Promise<boolean> {
    return await this.ensureValidToken();
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiration) return true;
    return this.tokenExpiration <= new Date();
  }

  isRefreshTokenExpired(): boolean {
    if (!this.refreshTokenExpiration) return true;
    return this.refreshTokenExpiration <= new Date();
  }

  async ensureValidToken(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Verificar si el refresh token está expirado
    if (this.isRefreshTokenExpired()) {
      await this.logout();
      return false;
    }

    // Si el token expira en menos de 5 minutos, refrescarlo proactivamente
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    if (this.tokenExpiration && this.tokenExpiration <= fiveMinutesFromNow) {
      return await this.refreshAuthToken();
    }

    return true;
  }

  async refreshAuthToken(): Promise<boolean> {
    try {
      if (!this.token || !this.refreshToken) {
        console.log('❌ Refresh falló: No hay token o refresh token');
        return false;
      }

      console.log('🔄 Intentando refresh token...');

      const response = await apiService.post<RefreshTokenResponseData>(
        '/auth/refresh-token',
        {
          Token: this.token,
          RefreshToken: this.refreshToken,
        }
      );

      if (response.Success && response.Data?.NewToken) {
        console.log('✅ Refresh exitoso, actualizando token');

        // Actualizar el token y su expiración
        this.token = response.Data.NewToken;
        this.tokenExpiration = new Date(response.Data.TokenExpiration);

        // Persistir el nuevo token y su expiración
        if (this.token) {
          await AsyncStorage.setItem(TOKEN_KEY, this.token);
          await AsyncStorage.setItem(
            TOKEN_EXPIRATION_KEY,
            this.tokenExpiration.toISOString()
          );

          // Configurar el nuevo token en el servicio API
          apiService.setAuthToken(this.token);
        }

        return true;
      }

      console.log(
        '❌ Refresh falló: Respuesta inválida del servidor',
        response.Data
      );
      return false;
    } catch (error) {
      console.log('❌ Error en refresh token:', error);
      // Si falla el refresh, limpiar sesión
      await this.logout();
      return false;
    }
  }

  // Método para refrescar la información del usuario después de crear un gym
  async refreshUserData(): Promise<boolean> {
    try {
      if (!this.userData?.userId) {
        return false;
      }

      const { userService } = await import('./userService');
      const response = await userService.getUserById(this.userData.userId);

      if (response.Success && response.Data) {
        const user = response.Data;

        // Actualizar userData con la nueva información
        this.userData = {
          ...this.userData,
          gymId: user.GymId,
          planId: user.PlanId,
        };

        // Persistir los datos actualizados
        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(this.userData)
        );

        // Actualizar gymId en AsyncStorage
        if (this.userData.gymId) {
          await AsyncStorage.setItem(GYM_ID_KEY, this.userData.gymId);

          // Consultar y cachear información del nuevo gym
          try {
            const { GymService } = await import('./gymService');
            await GymService.fetchAndCacheGymData(this.userData.gymId);
          } catch {
            // No hacer nada si falla la obtención de datos del gym
          }
        }

        // Actualizar planId si existe
        if (this.userData.planId) {
          await AsyncStorage.setItem(PLAN_ID_KEY, this.userData.planId);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.log('❌ Error refrescando datos del usuario:', error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
export type { UserData };
