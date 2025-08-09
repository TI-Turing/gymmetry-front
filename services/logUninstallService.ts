import { apiService, ApiResponse } from './apiService';
import type { AddLogUninstallRequest } from '@/dto/LogUninstall/Request/AddLogUninstallRequest';
import type { LogUninstall } from '@/models/LogUninstall';
import type { UpdateLogUninstallRequest } from '@/dto/LogUninstall/Request/UpdateLogUninstallRequest';

// Auto-generated service for LogUninstall Azure Functions
export const logUninstallService = {
  async addLogUninstall(
    request: AddLogUninstallRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/loguninstall/add`, request);
    return response;
  },
  async deleteLogUninstall(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/loguninstall/${id}`);
    return response;
  },
  async getLogUninstallById(id: string): Promise<ApiResponse<LogUninstall>> {
    const response = await apiService.get<LogUninstall>(`/loguninstall/${id}`);
    return response;
  },
  async getAllLogUninstalls(): Promise<ApiResponse<LogUninstall[]>> {
    const response = await apiService.get<LogUninstall[]>(`/loguninstalls`);
    return response;
  },
  async findLogUninstallsByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<LogUninstall[]>> {
    const response = await apiService.post<LogUninstall[]>(
      `/loguninstalls/find`,
      request
    );
    return response;
  },
  async updateLogUninstall(
    request: UpdateLogUninstallRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/loguninstall/update`, request);
    return response;
  },
};
