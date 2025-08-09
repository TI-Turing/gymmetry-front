import { apiService, ApiResponse } from './apiService';

// Servicio específico para funciones de branch que se usaban con el alias branchServiceFunctionsService
export const branchServiceFunctions = {
  async getBranchServiceById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/branch-service/${id}`);
    return response;
  },

  async addBranchService(body: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/branch-service/add`, body);
    return response;
  },

  async updateBranchService(body: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/branch-service/update`, body);
    return response;
  },

  async deleteBranchService(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/branch-service/${id}`);
    return response;
  }
};
