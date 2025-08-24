import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddMachineRequest } from '@/dto/Machine/Request/AddMachineRequest';
import type { Machine } from '@/models/Machine';
import type { UpdateMachineRequest } from '@/dto/Machine/Request/UpdateMachineRequest';

// Auto-generated service for Machine Azure Functions
export const machineService = {
  async addMachine(request: AddMachineRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/machine/add`, request);
    return response;
  },
  async addMachines(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/machines/add`, request);
    return response;
  },
  async deleteMachine(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/machine/${id}`);
    return response;
  },
  async getMachineById(id: string): Promise<ApiResponse<Machine>> {
    const response = await apiService.get<Machine>(`/machine/${id}`);
    return response;
  },
  async getAllMachines(): Promise<ApiResponse<Machine[]>> {
    const response = await apiService.get<Machine[]>(`/machines`);
    return response;
  },
  async findMachinesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Machine[]>> {
    const response = await apiService.post<Machine[]>(
      `/machines/find`,
      request
    );
    return response;
  },
  async updateMachine(
    request: UpdateMachineRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/machine/update`, request);
    return response;
  },
};
