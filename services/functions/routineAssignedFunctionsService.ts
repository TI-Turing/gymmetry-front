import { apiService, ApiResponse } from '../apiService';
import type { AddRoutineAssignedRequest } from '@/dto/RoutineAssigned/Request/AddRoutineAssignedRequest';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import type { UpdateRoutineAssignedRequest } from '@/dto/RoutineAssigned/Request/UpdateRoutineAssignedRequest';

// Auto-generated service for RoutineAssigned Azure Functions
export const routineAssignedFunctionsService = {
  async addRoutineAssigned(
    request: AddRoutineAssignedRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/routineassigned/add`,
      request
    );
    return response;
  },
  async deleteRoutineAssigned(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/routineassigned/${id}`);
    return response;
  },
  async getRoutineAssigned(id: string): Promise<ApiResponse<RoutineAssigned>> {
    const response = await apiService.get<RoutineAssigned>(
      `/routineassigned/${id}`
    );
    return response;
  },
  async getAllRoutineAssigneds(): Promise<ApiResponse<RoutineAssigned[]>> {
    const response =
      await apiService.get<RoutineAssigned[]>(`/routineassigneds`);
    return response;
  },
  async findRoutineAssignedsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<RoutineAssigned[]>> {
    const response = await apiService.post<RoutineAssigned[]>(
      `/routineassigneds/find`,
      request
    );
    return response;
  },
  async updateRoutineAssigned(
    request: UpdateRoutineAssignedRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/routineassigned/update`,
      request
    );
    return response;
  },
};
