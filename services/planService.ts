import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddPlanRequest } from '@/dto/plan/Request/AddPlanRequest';
import type { Plan } from '@/dto/plan/Plan';
import type { FindPlansByFieldsRequest } from '@/dto/plan/FindPlansByFieldsRequest';
import type { UpdatePlanRequest } from '@/dto/plan/UpdatePlanRequest';

// Auto-generated service for Plan Azure Functions
export const planService = {
  async addPlan(request: AddPlanRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/plan/add`, request);
    return response;
  },
  async deletePlan(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/plan/${id}`);
    return response;
  },
  async getPlan(id: string): Promise<ApiResponse<Plan>> {
    const response = await apiService.get<Plan>(`/plan/${id}`);
    return response;
  },
  async getAllPlans(): Promise<ApiResponse<Plan[]>> {
    const response = await apiService.get<Plan[]>(`/plans`);
    return response;
  },
  async findPlansByFields(
    request: FindPlansByFieldsRequest
  ): Promise<ApiResponse<Plan[]>> {
    const response = await apiService.post<Plan[]>(`/plans/find`, request);
    return response;
  },
  async updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/plan/update`, request);
    return response;
  },
};
