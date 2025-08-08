import { apiService, ApiResponse } from '../apiService';
import type { AddScheduleRequest } from '@/dto/Schedule/Request/AddScheduleRequest';
import type { Schedule } from '@/models/Schedule';
import type { UpdateScheduleRequest } from '@/dto/Schedule/Request/UpdateScheduleRequest';

// Auto-generated service for Schedule Azure Functions
export const scheduleFunctionsService = {
  async addSchedule(request: AddScheduleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/schedule/add`, request);
    return response;
  },
  async deleteSchedule(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/schedule/${id}`);
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
  async findSchedulesByFields(request: Record<string, any>): Promise<ApiResponse<Schedule[]>> {
    const response = await apiService.post<Schedule[]>(`/schedules/find`, request);
    return response;
  },
  async updateSchedule(request: UpdateScheduleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/schedule/update`, request);
    return response;
  },
};
