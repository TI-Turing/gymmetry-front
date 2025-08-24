import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Servicio específico para funciones de branch que se usaban con el alias branchServiceFunctionsService
export const branchServiceFunctions = {
  async getBranchServiceById<T = unknown>(id: string): Promise<ApiResponse<T>> {
    const response = await apiService.get<T>(`/branch-service/${id}`);
    return response;
  },

  async addBranchService<TBody = unknown, TRes = string | unknown>(
    body: TBody
  ): Promise<ApiResponse<TRes>> {
    const response = await apiService.post<TRes>(`/branch-service/add`, body);
    return response;
  },

  async updateBranchService<TBody = unknown, TRes = unknown>(
    body: TBody
  ): Promise<ApiResponse<TRes>> {
    const response = await apiService.put<TRes>(`/branch-service/update`, body);
    return response;
  },

  async deleteBranchService(id: string): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(
      `/branch-service/${id}`
    );
    return response;
  },
};
