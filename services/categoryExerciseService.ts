import { apiService, ApiResponse } from './apiService';
import type { AddCategoryExerciseRequest } from '@/dto/CategoryExercise/Request/AddCategoryExerciseRequest';
import type { CategoryExercise } from '@/models/CategoryExercise';
import type { UpdateCategoryExerciseRequest } from '@/dto/CategoryExercise/Request/UpdateCategoryExerciseRequest';

// Auto-generated service for CategoryExercise Azure Functions
export const categoryExerciseService = {
  async addCategoryExercise(
    request: AddCategoryExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/categoryexercise/add`,
      request
    );
    return response;
  },
  async deleteCategoryExercise(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/categoryexercise/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<CategoryExercise[]>> {
    const response = await apiService.post<CategoryExercise[]>(
      `/categoryexercises/find`,
      request
    );
    return response;
  },
  async updateCategoryExercise(
    request: UpdateCategoryExerciseRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/categoryexercise/update`,
      request
    );
    return response;
  },
};
