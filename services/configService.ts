import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Auto-generated service for Config Azure Functions
export const configService = {
  async updateUsdPriceTimer(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/`);
    return response;
  },
};
