import { apiService, ApiResponse } from './apiService';
import type { AddBranchRequest } from '@/dto/branch/AddBranchRequest';
import type { Branch } from '@/models/Branch';
import type { UpdateBranchRequest } from '@/dto/branch/UpdateBranchRequest';

// Auto-generated service for Branch Azure Functions
export const branchService = {
  async addBranch(request: AddBranchRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/branch/add`, request);
    return response;
  },
  async deleteBranch(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/branch/${id}`);
    return response;
  },
  async getBranchById(id: string): Promise<ApiResponse<Branch>> {
    const response = await apiService.get<Branch>(`/branch/${id}`);
    return response;
  },
  async getAllBranches(): Promise<ApiResponse<Branch[]>> {
    const response = await apiService.get<Branch[]>(`/branches`);
    return response;
  },
  async findBranchesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<Branch[]>> {
    const response = await apiService.post<Branch[]>(`/branches/find`, request);
    return response;
  },
  async updateBranch(request: UpdateBranchRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/branch/update`, request);
    return response;
  },
};
