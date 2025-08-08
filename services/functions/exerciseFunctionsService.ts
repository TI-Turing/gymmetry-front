import { apiService, ApiResponse } from '../apiService';
import type { AddExerciseRequest } from '@/dto/Exercise/Request/AddExerciseRequest';
import type { Exercise } from '@/models/Exercise';
import type { UpdateExerciseRequest } from '@/dto/Exercise/Request/UpdateExerciseRequest';

// Auto-generated service for Exercise Azure Functions
export const exerciseFunctionsService = {
  async addExercise(request: AddExerciseRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/exercise/add`, request);
    return response;
  },
  async deleteExercise(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/exercise/${id}`);
    return response;
  },
  async getExerciseById(id: string): Promise<ApiResponse<Exercise>> {
    const response = await apiService.get<Exercise>(`/exercise/${id}`);
    return response;
  },
  async getAllExercises(): Promise<ApiResponse<Exercise[]>> {
    const response = await apiService.get<Exercise[]>(`/exercises`);
    return response;
  },
  async findExercisesByFields(request: Record<string, any>): Promise<ApiResponse<Exercise[]>> {
    const response = await apiService.post<Exercise[]>(`/exercises/find`, request);
    return response;
  },
  async updateExercise(request: UpdateExerciseRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/exercise/update`, request);
    return response;
  },
};
