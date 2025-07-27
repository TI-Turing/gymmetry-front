import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './apiService';
import { LoginRequest, LoginResponse } from '@/dto/auth';

const TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

interface UserData {
  userId: string;
  userName: string;
  email: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
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
        this.userData = {
          userId: response.data.Data.UserId,
          userName: response.data.Data.UserName,
          email: response.data.Data.Email,
        };

        // Persistir en AsyncStorage
        await AsyncStorage.setItem(TOKEN_KEY, this.token);
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
      this.userData = null;

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);

      // Limpiar token del servicio API
      apiService.removeAuthToken();
    } catch (_error) {
      // En caso de error, limpiar al menos los datos en memoria
      this.token = null;
      this.userData = null;
    }
  }

  async initializeFromStorage(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userDataString) {
        this.token = token;
        this.userData = JSON.parse(userDataString);

        // Configurar token en el servicio API
        apiService.setAuthToken(token);

        return true;
      }

      return false;
    } catch (_error) {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.userData !== null;
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
}

export const authService = AuthService.getInstance();
export type { UserData };
