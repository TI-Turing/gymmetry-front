import { apiService, ApiResponse } from '../apiService';
import type { AddDailyExerciseHistoryRequest } from '@/dto/DailyExerciseHistory/Request/AddDailyExerciseHistoryRequest';
import type { DailyExerciseHistory } from '@/models/DailyExerciseHistory';
import type { UpdateDailyExerciseHistoryRequest } from '@/dto/DailyExerciseHistory/Request/UpdateDailyExerciseHistoryRequest';

// Auto-generated service for DailyExerciseHistory Azure Functions
export const dailyExerciseHistoryFunctionsService = {
  async addDailyExerciseHistory(
    request: AddDailyExerciseHistoryRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/dailyexercisehistory/add`,
      request
    );
    return response;
  },
  async deleteDailyExerciseHistory(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(
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
    request: Record<string, any>
  ): Promise<ApiResponse<DailyExerciseHistory[]>> {
    const response = await apiService.post<DailyExerciseHistory[]>(
      `/dailyexercisehistories/find`,
      request
    );
    return response;
  },
  async updateDailyExerciseHistory(
    request: UpdateDailyExerciseHistoryRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/dailyexercisehistory/update`,
      request
    );
    return response;
  },
};
