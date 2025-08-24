import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddDailyExerciseHistoryRequest } from '@/dto/DailyExerciseHistory/Request/AddDailyExerciseHistoryRequest';
import type { DailyExerciseHistory } from '@/models/DailyExerciseHistory';
import type { UpdateDailyExerciseHistoryRequest } from '@/dto/DailyExerciseHistory/Request/UpdateDailyExerciseHistoryRequest';

// Auto-generated service for DailyExerciseHistory Azure Functions
export const dailyExerciseHistoryService = {
  async addDailyExerciseHistory(
    request: AddDailyExerciseHistoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/dailyexercisehistory/add`,
      request
    );
    return response;
  },
  async deleteDailyExerciseHistory(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(
      `/dailyexercisehistory/${id}`
    );
    return response;
  },
  async getDailyExerciseHistoryById(
    id: string
  ): Promise<ApiResponse<DailyExerciseHistory>> {
    const response = await apiService.get<DailyExerciseHistory>(
      `/dailyexercisehistory/${id}`
    );
    return response;
  },
  async getAllDailyExerciseHistories(): Promise<
    ApiResponse<DailyExerciseHistory[]>
  > {
    const response = await apiService.get<DailyExerciseHistory[]>(
      `/dailyexercisehistories`
    );
    return response;
  },
  async findDailyExerciseHistoriesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<DailyExerciseHistory[]>> {
    const response = await apiService.post<DailyExerciseHistory[]>(
      `/dailyexercisehistories/find`,
      request
    );
    return response;
  },
  async updateDailyExerciseHistory(
    request: UpdateDailyExerciseHistoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/dailyexercisehistory/update`,
      request
    );
    return response;
  },
};
