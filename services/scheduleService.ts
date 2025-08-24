import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddScheduleRequest } from '@/dto/Schedule/Request/AddScheduleRequest';
import type { Schedule } from '@/models/Schedule';
import type { UpdateScheduleRequest } from '@/dto/Schedule/Request/UpdateScheduleRequest';

// Auto-generated service for Schedule Azure Functions
export const scheduleService = {
  async addSchedule(
    request: AddScheduleRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/schedule/add`, request);
    return response;
  },
  async deleteSchedule(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/schedule/${id}`);
    return response;
  },
  async getSchedule(id: string): Promise<ApiResponse<Schedule>> {
    const response = await apiService.get<Schedule>(`/schedule/${id}`);
    return response;
  },
  async getAllSchedules(): Promise<ApiResponse<Schedule[]>> {
    const response = await apiService.get<Schedule[]>(`/schedules`);
    return response;
  },
  async findSchedulesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Schedule[]>> {
    const response = await apiService.post<Schedule[]>(
      `/schedules/find`,
      request
    );
    return response;
  },
  async updateSchedule(
    request: UpdateScheduleRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/schedule/update`, request);
    return response;
  },
};
