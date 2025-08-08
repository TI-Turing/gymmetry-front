import { apiService, ApiResponse } from '../apiService';

// Auto-generated service for BranchService Azure Functions
export const branchServiceFunctionsService = {
  async addBranchService(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/branchservice/add`, request);
    return response;
  },
  async deleteBranchService(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/branchservice/${id}`);
    return response;
  },
  async getBranchServiceById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/branchservice/${id}`);
    return response;
  },
  async getAllBranchServices(): Promise<ApiResponse<any[]>> {
    const response = await apiService.get<any[]>(`/branchservices`);
    return response;
  },
  async findBranchServicesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<any[]>> {
    const response = await apiService.post<any[]>(
      `/branchservices/find`,
      request
    );
    return response;
  },
  async updateBranchService(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/branchservice/update`,
      request
    );
    return response;
  },
};
