import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddRoutineExerciseRequest } from '@/dto/RoutineExercise/Request/AddRoutineExerciseRequest';
import type { RoutineExercise } from '@/models/RoutineExercise';
import type { UpdateRoutineExerciseRequest } from '@/dto/RoutineExercise/Request/UpdateRoutineExerciseRequest';

// Auto-generated service for RoutineExercise Azure Functions
export const routineExerciseService = {
  async addRoutineExercise(
    request: AddRoutineExerciseRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/routineexercise/add`,
      request
    );
    return response;
  },
  async deleteRoutineExercise(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/routineexercise/${id}`);
    return response;
  },
  async getRoutineExercise(id: string): Promise<ApiResponse<RoutineExercise>> {
    const response = await apiService.get<RoutineExercise>(
      `/routineexercise/${id}`
    );
    return response;
  },
  async getAllRoutineExercises(): Promise<ApiResponse<RoutineExercise[]>> {
    const response =
      await apiService.get<RoutineExercise[]>(`/routineexercises`);
    return response;
  },
  async findRoutineExercisesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<RoutineExercise[]>> {
    const response = await apiService.post<RoutineExercise[]>(
      `/routineexercises/find`,
      request
    );
    return response;
  },
  async updateRoutineExercise(
    request: UpdateRoutineExerciseRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/routineexercise/update`,
      request
    );
    return response;
  },
};
