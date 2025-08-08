import { apiService, ApiResponse } from '../apiService';
import type { NotificationCreateRequestDto } from '@/dto/Notification/Request/NotificationCreateRequestDto';
import type { NotificationResponseDto } from '@/dto/Notification/Response/NotificationResponseDto';

// Auto-generated service for Notification Azure Functions
export const notificationFunctionsService = {
  async addNotification(request: NotificationCreateRequestDto): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/notification/add`, request);
    return response;
  },
  async deleteNotification(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/notification/${id}`);
    return response;
  },
  async getNotificationById(id: string): Promise<ApiResponse<NotificationResponseDto>> {
    const response = await apiService.get<NotificationResponseDto>(`/notification/${id}`);
    return response;
  },
  async getAllNotifications(): Promise<ApiResponse<NotificationResponseDto[]>> {
    const response = await apiService.get<NotificationResponseDto[]>(`/notifications`);
    return response;
  },
  async findNotificationsByFields(request: Record<string, any>): Promise<ApiResponse<NotificationResponseDto[]>> {
    const response = await apiService.post<NotificationResponseDto[]>(`/notifications/find`, request);
    return response;
  },
  async updateNotification(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/notification/update`, request);
    return response;
  },
};
