import { apiService, ApiResponse } from './apiService';

// Auto-generated service for SignalR Azure Functions
export const signalRService = {
  async negotiate(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/negotiate`);
    return response;
  },
  async sendNotification(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/send-notification`, request);
    return response;
  },
};
