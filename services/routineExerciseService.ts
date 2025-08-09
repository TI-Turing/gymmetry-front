import { apiService, ApiResponse } from './apiService';
import type { AddRoutineExerciseRequest } from '@/dto/RoutineExercise/Request/AddRoutineExerciseRequest';
import type { RoutineExercise } from '@/models/RoutineExercise';
import type { UpdateRoutineExerciseRequest } from '@/dto/RoutineExercise/Request/UpdateRoutineExerciseRequest';

// Auto-generated service for RoutineExercise Azure Functions
export const routineExerciseService = {
  async addRoutineExercise(
    request: AddRoutineExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/routineexercise/add`,
      request
    );
    return response;
  },
  async deleteRoutineExercise(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/routineexercise/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<RoutineExercise[]>> {
    const response = await apiService.post<RoutineExercise[]>(
      `/routineexercises/find`,
      request
    );
    return response;
  },
  async updateRoutineExercise(
    request: UpdateRoutineExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/routineexercise/update`,
      request
    );
    return response;
  },
};
