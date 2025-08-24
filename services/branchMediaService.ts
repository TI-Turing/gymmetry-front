import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { BranchMedia } from '@/models/BranchMedia';

// Auto-generated service for BranchMedia Azure Functions
export const branchMediaService = {
  async addBranchMedia(request: BranchMedia): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/branchmedia/add`,
      request
    );
    return response;
  },
  async deleteBranchMedia(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/branchmedia/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<BranchMedia[]>> {
    const response = await apiService.post<BranchMedia[]>(
      `/branchmedias/find`,
      request
    );
    return response;
  },
  async updateBranchMedia(request: BranchMedia): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/branchmedia/update`,
      request
    );
    return response;
  },
};
