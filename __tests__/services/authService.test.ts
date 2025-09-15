// __tests__/services/authService.test.ts
import { authService } from '../../services/authService';
import { apiService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../services/apiService');
jest.mock('@react-native-async-storage/async-storage');

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
          },
        },
        Message: 'Login successful',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);
      mockAsyncStorage.setItem.mockResolvedValue();

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authService.login(credentials);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse);

      // Should store token
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'mock-jwt-token'
      );
    });

    it('should handle login failure', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Invalid credentials',
        StatusCode: 401,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const result = await authService.login(credentials);

      expect(result).toEqual(mockResponse);

      // Should not store token on failure
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockApiService.post.mockRejectedValue(networkError);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(authService.login(credentials)).rejects.toThrow(
        'Network Error'
      );
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'newuser@example.com',
            name: 'New User',
          },
        },
        Message: 'Registration successful',
        StatusCode: 201,
      };

      mockApiService.post.mockResolvedValue(mockResponse);
      mockAsyncStorage.setItem.mockResolvedValue();

      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
        confirmPassword: 'password123',
      };

      const result = await authService.register(registerData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/auth/register',
        registerData
      );
      expect(result).toEqual(mockResponse);

      // Should store token on successful registration
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'mock-jwt-token'
      );
    });

    it('should handle registration validation errors', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Email already exists',
        StatusCode: 400,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'User',
        confirmPassword: 'password123',
      };

      const result = await authService.register(registerData);

      expect(result).toEqual(mockResponse);
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: null,
        Message: 'Logout successful',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);
      mockAsyncStorage.removeItem.mockResolvedValue();

      const result = await authService.logout();

      expect(mockApiService.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse);

      // Should remove stored token
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });

    it('should clear token even if API call fails', async () => {
      mockApiService.post.mockRejectedValue(new Error('API Error'));
      mockAsyncStorage.removeItem.mockResolvedValue();

      try {
        await authService.logout();
      } catch (error) {
        // Expected to throw
      }

      // Should still remove token
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('getUserData', () => {
    it('should get user data successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          profile: {
            avatar: 'avatar-url',
          },
        },
        Message: 'User data retrieved',
        StatusCode: 200,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await authService.getUserData();

      expect(mockApiService.get).toHaveBeenCalledWith('/auth/user');
      expect(result).toEqual(mockResponse);
    });

    it('should handle unauthorized access', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Unauthorized',
        StatusCode: 401,
      };

      mockApiService.get.mockResolvedValue(mockResponse);

      const result = await authService.getUserData();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        Success: true,
        Data: {
          token: 'new-jwt-token',
          expiresIn: 3600,
        },
        Message: 'Token refreshed',
        StatusCode: 200,
      };

      mockApiService.post.mockResolvedValue(mockResponse);
      mockAsyncStorage.setItem.mockResolvedValue();

      const result = await authService.refreshToken();

      expect(mockApiService.post).toHaveBeenCalledWith('/auth/refresh');
      expect(result).toEqual(mockResponse);

      // Should store new token
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        'auth_token',
        'new-jwt-token'
      );
    });

    it('should handle refresh token failure', async () => {
      const mockResponse = {
        Success: false,
        Data: null,
        Message: 'Refresh token expired',
        StatusCode: 401,
      };

      mockApiService.post.mockResolvedValue(mockResponse);

      const result = await authService.refreshToken();

      expect(result).toEqual(mockResponse);
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('getStoredToken', () => {
    it('should retrieve stored token', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('stored-token');

      const token = await authService.getStoredToken();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('auth_token');
      expect(token).toBe('stored-token');
    });

    it('should return null when no token stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const token = await authService.getStoredToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('valid-token');

      const isAuth = await authService.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    it('should return false when no token exists', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const isAuth = await authService.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });
});
