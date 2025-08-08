import { apiService, ApiResponse } from '../apiService';
import type { AddGymPlanSelectedRequest } from '@/dto/GymPlanSelected/Request/AddGymPlanSelectedRequest';
import type { GymPlanSelected } from '@/dto/gymPlan/GymPlanSelected';
import type { UpdateGymPlanSelectedRequest } from '@/dto/GymPlanSelected/Request/UpdateGymPlanSelectedRequest';

// Auto-generated service for GymPlanSelected Azure Functions
export const gymPlanSelectedFunctionsService = {
  async addGymPlanSelected(
    request: AddGymPlanSelectedRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/gymplanselected/add`,
      request
    );
    return response;
  },
  async deleteGymPlanSelected(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/gymplanselected/${id}`);
    return response;
  },
  async getGymPlanSelectedById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/gymplanselected/${id}`);
    return response;
  },
  async getAllGymPlanSelecteds(): Promise<ApiResponse<GymPlanSelected[]>> {
    const response =
      await apiService.get<GymPlanSelected[]>(`/gymplanselecteds`);
    return response;
  },
  async findGymPlanSelectedsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<GymPlanSelected[]>> {
    const response = await apiService.post<GymPlanSelected[]>(
      `/gymplanselecteds/find`,
      request
    );
    return response;
  },
  async updateGymPlanSelected(
    request: UpdateGymPlanSelectedRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/gymplanselected/update`,
      request
    );
    return response;
  },
};
