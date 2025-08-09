import { apiService, ApiResponse } from './apiService';
import type { AddGymTypeRequest } from '@/dto/GymType/Request/AddGymTypeRequest';
import type { GymType } from '@/dto/gym/GymType';
import type { UpdateGymTypeRequest } from '@/dto/GymType/Request/UpdateGymTypeRequest';

// Auto-generated service for GymType Azure Functions
export const gymTypeService = {
  async addGymType(request: AddGymTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gymtype/add`, request);
    return response;
  },
  async deleteGymType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/gymtype/${id}`);
    return response;
  },
  async getGymTypeById(id: string): Promise<ApiResponse<GymType>> {
    const response = await apiService.get<GymType>(`/gymtype/${id}`);
    return response;
  },
  async getAllGymTypes(): Promise<ApiResponse<GymType[]>> {
    const response = await apiService.get<GymType[]>(`/gymtypes`);
    return response;
  },
  async findGymTypesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<GymType[]>> {
    const response = await apiService.post<GymType[]>(
      `/gymtypes/find`,
      request
    );
    return response;
  },
  async updateGymType(
    request: UpdateGymTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/gymtype/update`, request);
    return response;
  },
};
