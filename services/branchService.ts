import { apiService, ApiResponse } from './apiService';
import type { AddBranchRequest } from '@/dto/branch/AddBranchRequest';
import type { Branch } from '@/models/Branch';
import type { UpdateBranchRequest } from '@/dto/branch/UpdateBranchRequest';

// Auto-generated service for Branch Azure Functions
export const branchService = {
  async addBranch(
    request: AddBranchRequest
  ): Promise<ApiResponse<Branch | string>> {
    const response = await apiService.post<Branch | string>(
      `/branch/add`,
      request
    );
    return response;
  },
  async deleteBranch(id: string): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(`/branch/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<Branch[]>> {
    const response = await apiService.post<Branch[]>(`/branches/find`, request);
    return response;
  },
  async updateBranch(
    request: UpdateBranchRequest
  ): Promise<ApiResponse<Branch>> {
    const response = await apiService.put<Branch>(`/branch/update`, request);
    return response;
  },
};
