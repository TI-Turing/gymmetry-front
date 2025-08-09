import { apiService, ApiResponse } from './apiService';
import type { AddGymPlanSelectedModuleRequest } from '@/dto/GymPlanSelectedModule/Request/AddGymPlanSelectedModuleRequest';
import type { GymPlanSelectedModule } from '@/models/GymPlanSelectedModule';
import type { UpdateGymPlanSelectedModuleRequest } from '@/dto/GymPlanSelectedModule/Request/UpdateGymPlanSelectedModuleRequest';

// Auto-generated service for GymPlanSelectedModule Azure Functions
export const gymPlanSelectedModuleService = {
  async addGymPlanSelectedModule(
    request: AddGymPlanSelectedModuleRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/gymplanselectedmodule/add`,
      request
    );
    return response;
  },
  async deleteGymPlanSelectedModule(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(
      `/gymplanselectedmodule/${id}`
    );
    return response;
  },
  async getGymPlanSelectedModuleById(
    id: string
  ): Promise<ApiResponse<GymPlanSelectedModule>> {
    const response = await apiService.get<GymPlanSelectedModule>(
      `/gymplanselectedmodule/${id}`
    );
    return response;
  },
  async getAllGymPlanSelectedModules(): Promise<
    ApiResponse<GymPlanSelectedModule[]>
  > {
    const response = await apiService.get<GymPlanSelectedModule[]>(
      `/gymplanselectedmodules`
    );
    return response;
  },
  async findGymPlanSelectedModulesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<GymPlanSelectedModule[]>> {
    const response = await apiService.post<GymPlanSelectedModule[]>(
      `/gymplanselectedmodules/find`,
      request
    );
    return response;
  },
  async updateGymPlanSelectedModule(
    request: UpdateGymPlanSelectedModuleRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/gymplanselectedmodule/update`,
      request
    );
    return response;
  },
};
