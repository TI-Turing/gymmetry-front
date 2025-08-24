import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddDailyRequest } from '@/dto/Daily/Request/AddDailyRequest';
import type { Daily } from '@/models/Daily';
import type { UpdateDailyRequest } from '@/dto/Daily/Request/UpdateDailyRequest';

// Auto-generated service for Daily Azure Functions
export const dailyService = {
  async addDaily(request: AddDailyRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/daily/add`, request);
    return response;
  },
  async deleteDaily(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/daily/${id}`);
    return response;
  },
  async getDailyById(id: string): Promise<ApiResponse<Daily>> {
    const response = await apiService.get<Daily>(`/daily/${id}`);
    return response;
  },
  async getAllDailies(): Promise<ApiResponse<Daily[]>> {
    const response = await apiService.get<Daily[]>(`/dailies`);
    return response;
  },
  async findDailiesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Daily[]>> {
    const response = await apiService.post<Daily[]>(`/dailies/find`, request);
    return response;
  },
  async updateDaily(
    request: UpdateDailyRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/daily/update`, request);
    return response;
  },
};
