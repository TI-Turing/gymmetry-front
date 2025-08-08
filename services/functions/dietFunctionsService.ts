import { apiService, ApiResponse } from '../apiService';
import type { AddDietRequest } from '@/dto/Diet/Request/AddDietRequest';
import type { Diet } from '@/models/Diet';
import type { UpdateDietRequest } from '@/dto/Diet/Request/UpdateDietRequest';

// Auto-generated service for Diet Azure Functions
export const dietFunctionsService = {
  async addDiet(request: AddDietRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/diet/add`, request);
    return response;
  },
  async deleteDiet(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/diet/${id}`);
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
  async findDietsByFields(request: Record<string, any>): Promise<ApiResponse<Diet[]>> {
    const response = await apiService.post<Diet[]>(`/diets/find`, request);
    return response;
  },
  async updateDiet(request: UpdateDietRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/diet/update`, request);
    return response;
  },
};
