import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddSubModuleRequest } from '@/dto/SubModule/Request/AddSubModuleRequest';
import type { SubModule } from '@/models/SubModule';
import type { UpdateSubModuleRequest } from '@/dto/SubModule/Request/UpdateSubModuleRequest';

// Auto-generated service for SubModule Azure Functions
export const subModuleService = {
  async addSubModule(
    request: AddSubModuleRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/submodule/add`, request);
    return response;
  },
  async deleteSubModule(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/submodule/${id}`);
    return response;
  },
  async getSubModule(id: string): Promise<ApiResponse<SubModule>> {
    const response = await apiService.get<SubModule>(`/submodule/${id}`);
    return response;
  },
  async getAllSubModules(): Promise<ApiResponse<SubModule[]>> {
    const response = await apiService.get<SubModule[]>(`/submodules`);
    return response;
  },
  async findSubModulesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<SubModule[]>> {
    const response = await apiService.post<SubModule[]>(
      `/submodules/find`,
      request
    );
    return response;
  },
  async updateSubModule(
    request: UpdateSubModuleRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/submodule/update`,
      request
    );
    return response;
  },
};
