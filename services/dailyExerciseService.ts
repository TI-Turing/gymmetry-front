import { apiService, ApiResponse } from './apiService';
import type { AddDailyExerciseRequest } from '@/dto/DailyExercise/Request/AddDailyExerciseRequest';
import type { DailyExercise } from '@/models/DailyExercise';
import type { UpdateDailyExerciseRequest } from '@/dto/DailyExercise/Request/UpdateDailyExerciseRequest';

// Auto-generated service for DailyExercise Azure Functions
export const dailyExerciseService = {
  async addDailyExercise(
    request: AddDailyExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/dailyexercise/add`, request);
    return response;
  },
  async addDailyExercises(
    request: AddDailyExerciseRequest[]
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/dailyexercises/addbulk`, request);
    return response;
  },
  async deleteDailyExercise(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/dailyexercise/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<DailyExercise[]>> {
    const response = await apiService.post<DailyExercise[]>(
      `/dailyexercises/find`,
      request
    );
    return response;
  },
  async updateDailyExercise(
    request: UpdateDailyExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/dailyexercise/update`,
      request
    );
    return response;
  },
};
