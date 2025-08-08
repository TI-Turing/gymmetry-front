import { apiService, ApiResponse } from '../apiService';
import type { AddSubModuleRequest } from '@/dto/SubModule/Request/AddSubModuleRequest';
import type { SubModule } from '@/models/SubModule';
import type { UpdateSubModuleRequest } from '@/dto/SubModule/Request/UpdateSubModuleRequest';

// Auto-generated service for SubModule Azure Functions
export const subModuleFunctionsService = {
  async addSubModule(request: AddSubModuleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/submodule/add`, request);
    return response;
  },
  async deleteSubModule(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/submodule/${id}`);
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
  async findSubModulesByFields(request: Record<string, any>): Promise<ApiResponse<SubModule[]>> {
    const response = await apiService.post<SubModule[]>(`/submodules/find`, request);
    return response;
  },
  async updateSubModule(request: UpdateSubModuleRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/submodule/update`, request);
    return response;
  },
};
