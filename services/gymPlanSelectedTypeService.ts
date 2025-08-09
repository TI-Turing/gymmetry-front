import { apiService, ApiResponse } from './apiService';
import type { AddGymPlanSelectedTypeRequest } from '@/dto/GymPlanSelectedType/Request/AddGymPlanSelectedTypeRequest';
import type { GymPlanSelectedType } from '@/dto/gymPlan/GymPlanSelectedType';
import type { UpdateGymPlanSelectedTypeRequest } from '@/dto/GymPlanSelectedType/Request/UpdateGymPlanSelectedTypeRequest';

// Auto-generated service for GymPlanSelectedType Azure Functions
export const gymPlanSelectedTypeService = {
  async addGymPlanSelectedType(
    request: AddGymPlanSelectedTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/gymplanselectedtype/add`,
      request
    );
    return response;
  },
  async deleteGymPlanSelectedType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/gymplanselectedtype/${id}`);
    return response;
  },
  async getById(id: string): Promise<ApiResponse<GymPlanSelectedType>> {
    const response = await apiService.get<GymPlanSelectedType>(
      `/gymplanselectedtype/${id}`
    );
    return response;
  },
  async getAll(): Promise<ApiResponse<GymPlanSelectedType[]>> {
    const response = await apiService.get<GymPlanSelectedType[]>(
      `/gymplanselectedtypes`
    );
    return response;
  },
  async findByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<GymPlanSelectedType[]>> {
    const response = await apiService.post<GymPlanSelectedType[]>(
      `/gymplanselectedtypes/find`,
      request
    );
    return response;
  },
  async updateGymPlanSelectedType(
    request: UpdateGymPlanSelectedTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/gymplanselectedtype/update`,
      request
    );
    return response;
  },
};
