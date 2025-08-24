import { apiService, ApiResponse } from './apiService';
import type { AddCategoryExerciseRequest } from '@/dto/CategoryExercise/Request/AddCategoryExerciseRequest';
import type { CategoryExercise } from '@/models/CategoryExercise';
import type { UpdateCategoryExerciseRequest } from '@/dto/CategoryExercise/Request/UpdateCategoryExerciseRequest';

// Auto-generated service for CategoryExercise Azure Functions
export const categoryExerciseService = {
  async addCategoryExercise(
    request: AddCategoryExerciseRequest
  ): Promise<ApiResponse<CategoryExercise | string>> {
    const response = await apiService.post<CategoryExercise | string>(
      `/categoryexercise/add`,
      request
    );
    return response;
  },
  async deleteCategoryExercise(
    id: string
  ): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(
      `/categoryexercise/${id}`
    );
    return response;
  },
  async getCategoryExerciseById(
    id: string
  ): Promise<ApiResponse<CategoryExercise>> {
    const response = await apiService.get<CategoryExercise>(
      `/categoryexercise/${id}`
    );
    return response;
  },
  async getAllCategoryExercises(): Promise<ApiResponse<CategoryExercise[]>> {
    const response =
      await apiService.get<CategoryExercise[]>(`/categoryexercises`);
    return response;
  },
  async findCategoryExercisesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<CategoryExercise[]>> {
    const response = await apiService.post<CategoryExercise[]>(
      `/categoryexercises/find`,
      request
    );
    return response;
  },
  async updateCategoryExercise(
    request: UpdateCategoryExerciseRequest
  ): Promise<ApiResponse<CategoryExercise>> {
    const response = await apiService.put<CategoryExercise>(
      `/categoryexercise/update`,
      request
    );
    return response;
  },
};
