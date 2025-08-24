import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Auto-generated service for SignalR Azure Functions
export const signalRService = {
  async negotiate(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/negotiate`);
    return response;
  },
  async sendNotification(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/send-notification`,
      request
    );
    return response;
  },
};
