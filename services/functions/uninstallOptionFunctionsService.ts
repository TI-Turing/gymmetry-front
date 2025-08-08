import { apiService, ApiResponse } from '../apiService';
import type { AddUninstallOptionRequest } from '@/dto/UninstallOption/Request/AddUninstallOptionRequest';
import type { UninstallOption } from '@/models/UninstallOption';
import type { UpdateUninstallOptionRequest } from '@/dto/UninstallOption/Request/UpdateUninstallOptionRequest';

// Auto-generated service for UninstallOption Azure Functions
export const uninstallOptionFunctionsService = {
  async addUninstallOption(
    request: AddUninstallOptionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/uninstalloption/add`,
      request
    );
    return response;
  },
  async deleteUninstallOption(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/uninstalloption/${id}`);
    return response;
  },
  async getUninstallOption(id: string): Promise<ApiResponse<UninstallOption>> {
    const response = await apiService.get<UninstallOption>(
      `/uninstalloption/${id}`
    );
    return response;
  },
  async getAllUninstallOptions(): Promise<ApiResponse<UninstallOption[]>> {
    const response =
      await apiService.get<UninstallOption[]>(`/uninstalloptions`);
    return response;
  },
  async findUninstallOptionsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<UninstallOption[]>> {
    const response = await apiService.post<UninstallOption[]>(
      `/uninstalloptions/find`,
      request
    );
    return response;
  },
  async updateUninstallOption(
    request: UpdateUninstallOptionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/uninstalloption/update`,
      request
    );
    return response;
  },
};
