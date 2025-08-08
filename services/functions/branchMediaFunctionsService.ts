import { apiService, ApiResponse } from '../apiService';
import type { BranchMedia } from '@/models/BranchMedia';

// Auto-generated service for BranchMedia Azure Functions
export const branchMediaFunctionsService = {
  async addBranchMedia(request: BranchMedia): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/branchmedia/add`, request);
    return response;
  },
  async deleteBranchMedia(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/branchmedia/${id}`);
    return response;
  },
  async getBranchMediaById(id: string): Promise<ApiResponse<BranchMedia>> {
    const response = await apiService.get<BranchMedia>(`/branchmedia/${id}`);
    return response;
  },
  async getAllBranchMedias(): Promise<ApiResponse<BranchMedia[]>> {
    const response = await apiService.get<BranchMedia[]>(`/branchmedias`);
    return response;
  },
  async findBranchMediasByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<BranchMedia[]>> {
    const response = await apiService.post<BranchMedia[]>(
      `/branchmedias/find`,
      request
    );
    return response;
  },
  async updateBranchMedia(request: BranchMedia): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/branchmedia/update`, request);
    return response;
  },
};
