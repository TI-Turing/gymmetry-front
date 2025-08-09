import { apiService, ApiResponse } from './apiService';
import type { CurrentOccupancy } from '@/models/CurrentOccupancy';

// Auto-generated service for CurrentOccupancy Azure Functions
export const currentOccupancyService = {
  async addCurrentOccupancy(
    request: CurrentOccupancy
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/currentoccupancy/add`,
      request
    );
    return response;
  },
  async deleteCurrentOccupancy(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/currentoccupancy/${id}`);
    return response;
  },
  async getCurrentOccupancyById(
    id: string
  ): Promise<ApiResponse<CurrentOccupancy>> {
    const response = await apiService.get<CurrentOccupancy>(
      `/currentoccupancy/${id}`
    );
    return response;
  },
  async getAllCurrentOccupancies(): Promise<ApiResponse<CurrentOccupancy[]>> {
    const response =
      await apiService.get<CurrentOccupancy[]>(`/currentoccupancies`);
    return response;
  },
  async findCurrentOccupanciesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<CurrentOccupancy[]>> {
    const response = await apiService.post<CurrentOccupancy[]>(
      `/currentoccupancies/find`,
      request
    );
    return response;
  },
  async updateCurrentOccupancy(
    request: CurrentOccupancy
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/currentoccupancy/update`,
      request
    );
    return response;
  },
};
