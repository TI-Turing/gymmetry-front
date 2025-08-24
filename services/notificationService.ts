import { apiService, ApiResponse } from './apiService';
import { isWithinQuietHours } from '@/utils/quietHours';
import type { AppSettings } from '@/contexts/AppSettingsContext';
import type { NotificationCreateRequestDto } from '@/dto/Notification/Request/NotificationCreateRequestDto';
import type { NotificationResponseDto } from '@/dto/Notification/Response/NotificationResponseDto';

// Auto-generated service for Notification Azure Functions
export const notificationService = {
  async addNotification(
    request: NotificationCreateRequestDto,
    opts?: { settings?: Pick<AppSettings, 'notificationsEnabled' | 'quietHours'> }
  ): Promise<ApiResponse<any>> {
    // Respetar ajustes de la app si se proveen
    const st = opts?.settings;
    if (st && (!st.notificationsEnabled || isWithinQuietHours(new Date(), st.quietHours))) {
      return {
        Success: true,
        Message: 'Notificación suprimida por ajustes del usuario (silencio/horas).',
        Data: null as any,
        StatusCode: 200,
      } as ApiResponse<any>;
    }
    const response = await apiService.post<any>(`/notification/add`, request);
    return response;
  },
  async deleteNotification(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/notification/${id}`);
    return response;
  },
  async getNotificationById(
    id: string
  ): Promise<ApiResponse<NotificationResponseDto>> {
    const response = await apiService.get<NotificationResponseDto>(
      `/notification/${id}`
    );
    return response;
  },
  async getAllNotifications(): Promise<ApiResponse<NotificationResponseDto[]>> {
    const response =
      await apiService.get<NotificationResponseDto[]>(`/notifications`);
    return response;
  },
  async findNotificationsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<NotificationResponseDto[]>> {
    const response = await apiService.post<NotificationResponseDto[]>(
      `/notifications/find`,
      request
    );
    return response;
  },
  async updateNotification(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/notification/update`, request);
    return response;
  },
};
