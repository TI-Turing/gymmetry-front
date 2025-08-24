import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import { isWithinQuietHours } from '@/utils/quietHours';
import type { AppSettings } from '@/contexts/AppSettingsContext';
import type { NotificationCreateRequestDto } from '@/dto/Notification/Request/NotificationCreateRequestDto';
import type { NotificationResponseDto } from '@/dto/Notification/Response/NotificationResponseDto';

// Auto-generated service for Notification Azure Functions
export const notificationService = {
  async addNotification(
    request: NotificationCreateRequestDto,
    opts?: {
      settings?: Pick<AppSettings, 'notificationsEnabled' | 'quietHours'>;
    }
  ): Promise<ApiResponse<unknown>> {
    // Respetar ajustes de la app si se proveen
    const st = opts?.settings;
    if (
      st &&
      (!st.notificationsEnabled ||
        isWithinQuietHours(new Date(), st.quietHours))
    ) {
      return {
        Success: true,
        Message:
          'Notificación suprimida por ajustes del usuario (silencio/horas).',
        Data: null as any,
        StatusCode: 200,
      } as ApiResponse<unknown>;
    }
    const response = await apiService.post<unknown>(
      `/notification/add`,
      request
    );
    return response;
  },
  async deleteNotification(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/notification/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<NotificationResponseDto[]>> {
    const response = await apiService.post<NotificationResponseDto[]>(
      `/notifications/find`,
      request
    );
    return response;
  },
  async updateNotification(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/notification/update`,
      request
    );
    return response;
  },
};
