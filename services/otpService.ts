import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { OtpRequest } from '@/dto/user/OtpRequest';
import type { ValidateOtpRequest } from '@/dto/user/ValidateOtpRequest';

// Auto-generated service for Otp Azure Functions
// Respuestas esperadas del backend
export interface GenerateOtpResponse {
  OtpId: string;
  Code: string;
  ExpiresAt?: string;
}

export interface ValidateOtpResponse {
  IsValid: boolean;
  Reason?: string;
}

export const otpService = {
  async generateOtp(
    request: OtpRequest
  ): Promise<ApiResponse<GenerateOtpResponse>> {
    const response = await apiService.post<GenerateOtpResponse>(
      `/otp/generate-otp`,
      request
    );
    return response;
  },
  async validateOtp(
    request: ValidateOtpRequest
  ): Promise<ApiResponse<ValidateOtpResponse>> {
    const response = await apiService.post<ValidateOtpResponse>(
      `/otp/validate-otp`,
      request
    );
    return response;
  },
};
