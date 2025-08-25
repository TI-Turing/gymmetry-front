import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { GymImage } from '@/models/GymImage';

// Auto-generated service for GymImage Azure Functions
export const gymImageService = {
  async addGymImage(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/gymimage/add`, request);
    return response;
  },
  async deleteGymImage(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/gymimage/${id}`);
    return response;
  },
  async getGymImageById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/gymimage/${id}`);
    return response;
  },
  async getAllGymImages(): Promise<ApiResponse<GymImage[]>> {
    const response = await apiService.get<GymImage[]>(`/gymimages`);
    return response;
  },
  async updateGymImage(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/gymimage/update`, request);
    return response;
  },
  async uploadGymImage(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/gymimage/upload`,
      request
    );
    return response;
  },
};
