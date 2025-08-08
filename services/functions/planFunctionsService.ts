import { apiService, ApiResponse } from '../apiService';
import type { AddPlanRequest } from '@/dto/plan/Request/AddPlanRequest';
import type { Plan } from '@/dto/plan/Plan';
import type { FindPlansByFieldsRequest } from '@/dto/plan/FindPlansByFieldsRequest';
import type { UpdatePlanRequest } from '@/dto/plan/UpdatePlanRequest';

// Auto-generated service for Plan Azure Functions
export const planFunctionsService = {
  async addPlan(request: AddPlanRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/plan/add`, request);
    return response;
  },
  async deletePlan(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/plan/${id}`);
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
  async updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/plan/update`, request);
    return response;
  },
};
