import { apiService, ApiResponse } from './apiService';

// Auto-generated service for Config Azure Functions
export const configService = {
  async updateUsdPriceTimer(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/`);
    return response;
  },
};
