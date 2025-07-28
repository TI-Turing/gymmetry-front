import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './apiService';
import { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/dto/auth';

const TOKEN_KEY = '@auth_token';
const REFRESH_TOKEN_KEY = '@refresh_token';
const TOKEN_EXPIRATION_KEY = '@token_expiration';
const REFRESH_TOKEN_EXPIRATION_KEY = '@refresh_token_expiration';
const USER_DATA_KEY = '@user_data';

interface UserData {
  userId: string;
  userName: string;
  email: string;
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

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      if (response.data.Success && response.data.Data) {
        // Guardar token y datos del usuario
        this.token = response.data.Data.Token;
        this.refreshToken = response.data.Data.RefreshToken;
        this.tokenExpiration = new Date(response.data.Data.TokenExpiration);
        this.refreshTokenExpiration = new Date(
          response.data.Data.RefreshTokenExpiration
        );
        this.userData = {
          userId: response.data.Data.UserId,
          userName: response.data.Data.UserName,
          email: response.data.Data.Email,
        };

        // Persistir en AsyncStorage
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

        // Configurar token en el servicio API
        apiService.setAuthToken(this.token);
      }

      return response.data;
    } catch (error) {
      throw error;
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

        // Verificar si el refresh token está expirado
        if (this.refreshTokenExpiration <= new Date()) {
          // Refresh token expirado, limpiar sesión
          await this.logout();
          return false;
        }

        // Verificar si el token necesita ser refrescado
        if (this.tokenExpiration <= new Date()) {
          // Token expirado, intentar refrescar
          const refreshed = await this.refreshAuthToken();
          if (!refreshed) {
            await this.logout();
            return false;
          }
        }

        // Configurar token en el servicio API
        apiService.setAuthToken(this.token);

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

    if (this.isTokenExpired()) {
      return await this.refreshAuthToken();
    }

    return true;
  }

  async refreshAuthToken(): Promise<boolean> {
    try {
      if (!this.token || !this.refreshToken) {
        return false;
      }

      const response = await apiService.post<RefreshTokenResponse>(
        '/auth/refresh-token',
        {
          Token: this.token,
          RefreshToken: this.refreshToken,
        }
      );

      if (response.data.Success && response.data.Data?.NewToken) {
        // Actualizar el token y su expiración
        this.token = response.data.Data.NewToken;
        this.tokenExpiration = new Date(response.data.Data.TokenExpiration);

        // Persistir el nuevo token y su expiración
        await AsyncStorage.setItem(TOKEN_KEY, this.token);
        await AsyncStorage.setItem(
          TOKEN_EXPIRATION_KEY,
          this.tokenExpiration.toISOString()
        );

        // Configurar el nuevo token en el servicio API
        apiService.setAuthToken(this.token);

        return true;
      }

      return false;
    } catch {
      // Si falla el refresh, limpiar sesión
      await this.logout();
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
export type { UserData };
