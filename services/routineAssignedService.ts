import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddRoutineAssignedRequest } from '@/dto/RoutineAssigned/Request/AddRoutineAssignedRequest';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import type { UpdateRoutineAssignedRequest } from '@/dto/RoutineAssigned/Request/UpdateRoutineAssignedRequest';

// Auto-generated service for RoutineAssigned Azure Functions
export const routineAssignedService = {
  async addRoutineAssigned(
    request: AddRoutineAssignedRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/routineassigned/add`,
      request
    );
    return response;
  },
  async deleteRoutineAssigned(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/routineassigned/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<RoutineAssigned[]>> {
    const response = await apiService.post<RoutineAssigned[]>(
      `/routineassigneds/find`,
      request
    );
    return response;
  },
  async updateRoutineAssigned(
    request: UpdateRoutineAssignedRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/routineassigned/update`,
      request
    );
    return response;
  },
};
