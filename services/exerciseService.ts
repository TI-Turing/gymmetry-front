import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddExerciseRequest } from '@/dto/Exercise/Request/AddExerciseRequest';
import type { Exercise } from '@/models/Exercise';
import type { UpdateExerciseRequest } from '@/dto/Exercise/Request/UpdateExerciseRequest';

// Auto-generated service for Exercise Azure Functions
export const exerciseService = {
  async addExercise(
    request: AddExerciseRequest
  ): Promise<ApiResponse<Exercise | string>> {
    const response = await apiService.post<Exercise | string>(
      `/exercise/add`,
      request
    );
    return response;
  },
  async deleteExercise(id: string): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(`/exercise/${id}`);
    return response;
  },
  async getExerciseById(id: string): Promise<ApiResponse<Exercise>> {
    // Intento 1: ruta principal
    let response = await apiService.get<Exercise>(`/exercise/${id}`);

    // Si no hay Data o Success=false, probar rutas alternativas comunes
    if (!response?.Data) {
      const candidates = [
        `/exercises/${id}`,
        `/exercise/get/${id}`,
        `/exercise/by-id/${id}`,
      ];
      for (const ep of candidates) {
        try {
          const alt = await apiService.get<Exercise>(ep);

          if (alt?.Data) {
            response = alt;
            break;
          }
        } catch (e) {}
      }
    }
    return response;
  },
  async getAllExercises(): Promise<ApiResponse<Exercise[]>> {
    const response = await apiService.get<Exercise[]>(`/exercises`);
    return response;
  },
  async findExercisesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Exercise[]>> {
    const response = await apiService.post<Exercise[]>(
      `/exercises/find`,
      request
    );
    return response;
  },
  async updateExercise(
    request: UpdateExerciseRequest
  ): Promise<ApiResponse<Exercise>> {
    const response = await apiService.put<Exercise>(
      `/exercise/update`,
      request
    );
    return response;
  },
};
