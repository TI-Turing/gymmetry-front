import { apiService, ApiResponse } from './apiService';

// Auto-generated service for GymImage Azure Functions
export const gymImageService = {
  async addGymImage(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gymimage/add`, request);
    return response;
  },
  async deleteGymImage(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/gymimage/${id}`);
    return response;
  },
  async getGymImageById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/gymimage/${id}`);
    return response;
  },
  async getAllGymImages(): Promise<ApiResponse<any[]>> {
    const response = await apiService.get<any[]>(`/gymimages`);
    return response;
  },
  async updateGymImage(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/gymimage/update`, request);
    return response;
  },
  async uploadGymImage(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gymimage/upload`, request);
    return response;
  },
};
