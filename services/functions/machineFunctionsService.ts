import { apiService, ApiResponse } from '../apiService';
import type { AddMachineRequest } from '@/dto/Machine/Request/AddMachineRequest';
import type { Machine } from '@/models/Machine';
import type { UpdateMachineRequest } from '@/dto/Machine/Request/UpdateMachineRequest';

// Auto-generated service for Machine Azure Functions
export const machineFunctionsService = {
  async addMachine(request: AddMachineRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/machine/add`, request);
    return response;
  },
  async addMachines(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/machines/add`, request);
    return response;
  },
  async deleteMachine(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/machine/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<Machine[]>> {
    const response = await apiService.post<Machine[]>(
      `/machines/find`,
      request
    );
    return response;
  },
  async updateMachine(
    request: UpdateMachineRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/machine/update`, request);
    return response;
  },
};
