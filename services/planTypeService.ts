import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddPlanTypeRequest } from '@/dto/planType/Request/AddPlanTypeRequest';
import type { PlanType } from '@/dto/planType/PlanType';
import type { FindPlanTypesByFieldsRequest } from '@/dto/planType/FindPlanTypesByFieldsRequest';
import type { UpdatePlanTypeRequest } from '@/dto/planType/UpdatePlanTypeRequest';

// Auto-generated service for PlanType Azure Functions
export const planTypeService = {
  async addPlanType(
    request: AddPlanTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/plantype/add`, request);
    return response;
  },
  async deletePlanType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/plantype/${id}`);
    return response;
  },
  async getPlanType(id: string): Promise<ApiResponse<PlanType>> {
    const response = await apiService.get<PlanType>(`/plantype/${id}`);
    return response;
  },
  async getAllPlanTypes(): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.get<PlanType[]>(`/plantypes`);
    return response;
  },
  async findPlanTypesByFields(
    request: FindPlanTypesByFieldsRequest
  ): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.post<PlanType[]>(
      `/plantypes/find`,
      request
    );
    return response;
  },
  async updatePlanType(
    request: UpdatePlanTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/plantype/update`, request);
    return response;
  },
};
