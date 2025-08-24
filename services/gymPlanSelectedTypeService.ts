import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddGymPlanSelectedTypeRequest } from '@/dto/GymPlanSelectedType/Request/AddGymPlanSelectedTypeRequest';
import type { GymPlanSelectedType } from '@/dto/gymPlan/GymPlanSelectedType';
import type { UpdateGymPlanSelectedTypeRequest } from '@/dto/GymPlanSelectedType/Request/UpdateGymPlanSelectedTypeRequest';

// Auto-generated service for GymPlanSelectedType Azure Functions
export const gymPlanSelectedTypeService = {
  async addGymPlanSelectedType(
    request: AddGymPlanSelectedTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/gymplanselectedtype/add`,
      request
    );
    return response;
  },
  async deleteGymPlanSelectedType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(
      `/gymplanselectedtype/${id}`
    );
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<GymPlanSelectedType[]>> {
    const response = await apiService.post<GymPlanSelectedType[]>(
      `/gymplanselectedtypes/find`,
      request
    );
    return response;
  },
  async updateGymPlanSelectedType(
    request: UpdateGymPlanSelectedTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/gymplanselectedtype/update`,
      request
    );
    return response;
  },
};
