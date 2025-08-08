import { apiService, ApiResponse } from '../apiService';
import type { LoginResponse } from '@/dto/auth/Response/LoginResponse';
import type { LoginRequest } from '@/dto/auth/Request/LoginRequest';
import type { RefreshTokenResponse } from '@/dto/auth/Response/RefreshTokenResponse';
import type { RefreshTokenRequest } from '@/dto/auth/Request/RefreshTokenRequest';

// Auto-generated service for Auth Azure Functions
export const authFunctionsService = {
  async login(request: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiService.post<LoginResponse>(
      `/auth/login`,
      request
    );
    return response;
  },
  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> {
    const response = await apiService.post<RefreshTokenResponse>(
      `/auth/refresh-token`,
      request
    );
    return response;
  },
};
