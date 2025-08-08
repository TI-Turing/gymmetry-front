import { apiService, ApiResponse } from '../apiService';
import type { AddDailyRequest } from '@/dto/Daily/Request/AddDailyRequest';
import type { Daily } from '@/models/Daily';
import type { UpdateDailyRequest } from '@/dto/Daily/Request/UpdateDailyRequest';

// Auto-generated service for Daily Azure Functions
export const dailyFunctionsService = {
  async addDaily(request: AddDailyRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/daily/add`, request);
    return response;
  },
  async deleteDaily(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/daily/${id}`);
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
  async findDailiesByFields(request: Record<string, any>): Promise<ApiResponse<Daily[]>> {
    const response = await apiService.post<Daily[]>(`/dailies/find`, request);
    return response;
  },
  async updateDaily(request: UpdateDailyRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/daily/update`, request);
    return response;
  },
};
