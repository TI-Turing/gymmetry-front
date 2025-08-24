import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddDailyExerciseRequest } from '@/dto/DailyExercise/Request/AddDailyExerciseRequest';
import type { DailyExercise } from '@/models/DailyExercise';
import type { UpdateDailyExerciseRequest } from '@/dto/DailyExercise/Request/UpdateDailyExerciseRequest';

// Auto-generated service for DailyExercise Azure Functions
export const dailyExerciseService = {
  async addDailyExercise(
    request: AddDailyExerciseRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/dailyexercise/add`,
      request
    );
    return response;
  },
  async addDailyExercises(
    request: AddDailyExerciseRequest[]
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/dailyexercises/addbulk`,
      request
    );
    return response;
  },
  async deleteDailyExercise(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/dailyexercise/${id}`);
    return response;
  },
  async getDailyExerciseById(id: string): Promise<ApiResponse<DailyExercise>> {
    const response = await apiService.get<DailyExercise>(
      `/dailyexercise/${id}`
    );
    return response;
  },
  async getAllDailyExercises(): Promise<ApiResponse<DailyExercise[]>> {
    const response = await apiService.get<DailyExercise[]>(`/dailyexercises`);
    return response;
  },
  async findDailyExercisesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<DailyExercise[]>> {
    const response = await apiService.post<DailyExercise[]>(
      `/dailyexercises/find`,
      request
    );
    return response;
  },
  async updateDailyExercise(
    request: UpdateDailyExerciseRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/dailyexercise/update`,
      request
    );
    return response;
  },
};
