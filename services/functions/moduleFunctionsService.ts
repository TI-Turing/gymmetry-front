import { apiService, ApiResponse } from '../apiService';
import type { AddModuleRequest } from '@/dto/Module/Request/AddModuleRequest';
import type { Module } from '@/models/Module';
import type { UpdateModuleRequest } from '@/dto/Module/Request/UpdateModuleRequest';

// Auto-generated service for Module Azure Functions
export const moduleFunctionsService = {
  async addModule(request: AddModuleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/module/add`, request);
    return response;
  },
  async deleteModule(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/module/${id}`);
    return response;
  },
  async getModuleById(id: string): Promise<ApiResponse<Module>> {
    const response = await apiService.get<Module>(`/module/${id}`);
    return response;
  },
  async getAllModules(): Promise<ApiResponse<Module[]>> {
    const response = await apiService.get<Module[]>(`/modules`);
    return response;
  },
  async findModulesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<Module[]>> {
    const response = await apiService.post<Module[]>(`/modules/find`, request);
    return response;
  },
  async updateModule(request: UpdateModuleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/module/update`, request);
    return response;
  },
};
