import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddDietRequest } from '@/dto/Diet/Request/AddDietRequest';
import type { Diet } from '@/models/Diet';
import type { UpdateDietRequest } from '@/dto/Diet/Request/UpdateDietRequest';

// Auto-generated service for Diet Azure Functions
export const dietService = {
  async addDiet(request: AddDietRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/diet/add`, request);
    return response;
  },
  async deleteDiet(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/diet/${id}`);
    return response;
  },
  async getDietById(id: string): Promise<ApiResponse<Diet>> {
    const response = await apiService.get<Diet>(`/diet/${id}`);
    return response;
  },
  async getAllDiets(): Promise<ApiResponse<Diet[]>> {
    const response = await apiService.get<Diet[]>(`/diets`);
    return response;
  },
  async findDietsByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Diet[]>> {
    const response = await apiService.post<Diet[]>(`/diets/find`, request);
    return response;
  },
  async updateDiet(request: UpdateDietRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/diet/update`, request);
    return response;
  },
};
