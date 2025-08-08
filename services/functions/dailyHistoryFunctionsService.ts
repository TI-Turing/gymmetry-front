import { apiService, ApiResponse } from '../apiService';
import type { AddDailyHistoryRequest } from '@/dto/DailyHistory/Request/AddDailyHistoryRequest';
import type { DailyHistory } from '@/models/DailyHistory';
import type { UpdateDailyHistoryRequest } from '@/dto/DailyHistory/Request/UpdateDailyHistoryRequest';

// Auto-generated service for DailyHistory Azure Functions
export const dailyHistoryFunctionsService = {
  async addDailyHistory(request: AddDailyHistoryRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/dailyhistory/add`, request);
    return response;
  },
  async deleteDailyHistory(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/dailyhistory/${id}`);
    return response;
  },
  async getDailyHistoryById(id: string): Promise<ApiResponse<DailyHistory>> {
    const response = await apiService.get<DailyHistory>(`/dailyhistory/${id}`);
    return response;
  },
  async getAllDailyHistories(): Promise<ApiResponse<DailyHistory[]>> {
    const response = await apiService.get<DailyHistory[]>(`/dailyhistories`);
    return response;
  },
  async findDailyHistoriesByFields(request: Record<string, any>): Promise<ApiResponse<DailyHistory[]>> {
    const response = await apiService.post<DailyHistory[]>(`/dailyhistories/find`, request);
    return response;
  },
  async updateDailyHistory(request: UpdateDailyHistoryRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/dailyhistory/update`, request);
    return response;
  },
};
