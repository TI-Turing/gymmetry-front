import { apiService, ApiResponse } from './apiService';
import type { AddNotificationOptionRequest } from '@/dto/NotificationOption/Request/AddNotificationOptionRequest';
import type { NotificationOption } from '@/models/NotificationOption';
import type { UpdateNotificationOptionRequest } from '@/dto/NotificationOption/Request/UpdateNotificationOptionRequest';

// Auto-generated service for NotificationOption Azure Functions
export const notificationOptionService = {
  async addNotificationOption(
    request: AddNotificationOptionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/notificationoption/add`,
      request
    );
    return response;
  },
  async deleteNotificationOption(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/notificationoption/${id}`);
    return response;
  },
  async getNotificationOptionById(
    id: string
  ): Promise<ApiResponse<NotificationOption>> {
    const response = await apiService.get<NotificationOption>(
      `/notificationoption/${id}`
    );
    return response;
  },
  async getAllNotificationOptions(): Promise<
    ApiResponse<NotificationOption[]>
  > {
    const response =
      await apiService.get<NotificationOption[]>(`/notificationoptions`);
    return response;
  },
  async findNotificationOptionsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<NotificationOption[]>> {
    const response = await apiService.post<NotificationOption[]>(
      `/notificationoptions/find`,
      request
    );
    return response;
  },
  async updateNotificationOption(
    request: UpdateNotificationOptionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/notificationoption/update`,
      request
    );
    return response;
  },
};
