import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddUninstallOptionRequest } from '@/dto/UninstallOption/Request/AddUninstallOptionRequest';
import type { UninstallOption } from '@/models/UninstallOption';
import type { UpdateUninstallOptionRequest } from '@/dto/UninstallOption/Request/UpdateUninstallOptionRequest';

// Auto-generated service for UninstallOption Azure Functions
export const uninstallOptionService = {
  async addUninstallOption(
    request: AddUninstallOptionRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/uninstalloption/add`,
      request
    );
    return response;
  },
  async deleteUninstallOption(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/uninstalloption/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<UninstallOption[]>> {
    const response = await apiService.post<UninstallOption[]>(
      `/uninstalloptions/find`,
      request
    );
    return response;
  },
  async updateUninstallOption(
    request: UpdateUninstallOptionRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/uninstalloption/update`,
      request
    );
    return response;
  },
};
