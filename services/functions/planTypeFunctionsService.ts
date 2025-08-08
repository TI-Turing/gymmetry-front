import { apiService, ApiResponse } from '../apiService';
import type { AddPlanTypeRequest } from '@/dto/planType/Request/AddPlanTypeRequest';
import type { PlanType } from '@/dto/planType/PlanType';
import type { FindPlanTypesByFieldsRequest } from '@/dto/planType/FindPlanTypesByFieldsRequest';
import type { UpdatePlanTypeRequest } from '@/dto/planType/UpdatePlanTypeRequest';

// Auto-generated service for PlanType Azure Functions
export const planTypeFunctionsService = {
  async addPlanType(request: AddPlanTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/plantype/add`, request);
    return response;
  },
  async deletePlanType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/plantype/${id}`);
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
  async findPlanTypesByFields(request: FindPlanTypesByFieldsRequest): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.post<PlanType[]>(`/plantypes/find`, request);
    return response;
  },
  async updatePlanType(request: UpdatePlanTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/plantype/update`, request);
    return response;
  },
};
