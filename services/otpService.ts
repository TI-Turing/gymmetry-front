import { apiService, ApiResponse } from './apiService';
import type { OtpRequest } from '@/dto/user/OtpRequest';
import type { ValidateOtpRequest } from '@/dto/user/ValidateOtpRequest';

// Auto-generated service for Otp Azure Functions
export const otpService = {
  async generateOtp(request: OtpRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/otp/generate-otp`, request);
    return response;
  },
  async validateOtp(request: ValidateOtpRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/otp/validate-otp`, request);
    return response;
  },
};
