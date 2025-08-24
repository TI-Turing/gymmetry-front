import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddDailyHistoryRequest } from '@/dto/DailyHistory/Request/AddDailyHistoryRequest';
import type { DailyHistory } from '@/models/DailyHistory';
import type { UpdateDailyHistoryRequest } from '@/dto/DailyHistory/Request/UpdateDailyHistoryRequest';

// Auto-generated service for DailyHistory Azure Functions
export const dailyHistoryService = {
  async addDailyHistory(
    request: AddDailyHistoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/dailyhistory/add`,
      request
    );
    return response;
  },
  async deleteDailyHistory(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/dailyhistory/${id}`);
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
  async findDailyHistoriesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<DailyHistory[]>> {
    const response = await apiService.post<DailyHistory[]>(
      `/dailyhistories/find`,
      request
    );
    return response;
  },
  async updateDailyHistory(
    request: UpdateDailyHistoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/dailyhistory/update`,
      request
    );
    return response;
  },
};
