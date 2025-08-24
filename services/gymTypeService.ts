import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddGymTypeRequest } from '@/dto/GymType/Request/AddGymTypeRequest';
import type { GymType } from '@/dto/gym/GymType';
import type { UpdateGymTypeRequest } from '@/dto/GymType/Request/UpdateGymTypeRequest';

// Auto-generated service for GymType Azure Functions
export const gymTypeService = {
  async addGymType(request: AddGymTypeRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/gymtype/add`, request);
    return response;
  },
  async deleteGymType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/gymtype/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<GymType[]>> {
    const response = await apiService.post<GymType[]>(
      `/gymtypes/find`,
      request
    );
    return response;
  },
  async updateGymType(
    request: UpdateGymTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/gymtype/update`, request);
    return response;
  },
};
