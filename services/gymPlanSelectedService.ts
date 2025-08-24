import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddGymPlanSelectedRequest } from '@/dto/GymPlanSelected/Request/AddGymPlanSelectedRequest';
import type { GymPlanSelected } from '@/dto/gymPlan/GymPlanSelected';
import type { UpdateGymPlanSelectedRequest } from '@/dto/GymPlanSelected/Request/UpdateGymPlanSelectedRequest';

// Auto-generated service for GymPlanSelected Azure Functions
export const gymPlanSelectedService = {
  async addGymPlanSelected(
    request: AddGymPlanSelectedRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/gymplanselected/add`,
      request
    );
    return response;
  },
  async deleteGymPlanSelected(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/gymplanselected/${id}`);
    return response;
  },
  async getGymPlanSelectedById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/gymplanselected/${id}`);
    return response;
  },
  async getAllGymPlanSelecteds(): Promise<ApiResponse<GymPlanSelected[]>> {
    const response =
      await apiService.get<GymPlanSelected[]>(`/gymplanselecteds`);
    return response;
  },
  async findGymPlanSelectedsByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<GymPlanSelected[]>> {
    const response = await apiService.post<GymPlanSelected[]>(
      `/gymplanselecteds/find`,
      request
    );
    return response;
  },
  async updateGymPlanSelected(
    request: UpdateGymPlanSelectedRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/gymplanselected/update`,
      request
    );
    return response;
  },
};
