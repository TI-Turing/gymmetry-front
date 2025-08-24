import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddModuleRequest } from '@/dto/Module/Request/AddModuleRequest';
import type { Module } from '@/models/Module';
import type { UpdateModuleRequest } from '@/dto/Module/Request/UpdateModuleRequest';

// Auto-generated service for Module Azure Functions
export const moduleService = {
  async addModule(request: AddModuleRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/module/add`, request);
    return response;
  },
  async deleteModule(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/module/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<Module[]>> {
    const response = await apiService.post<Module[]>(`/modules/find`, request);
    return response;
  },
  async updateModule(
    request: UpdateModuleRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/module/update`, request);
    return response;
  },
};
