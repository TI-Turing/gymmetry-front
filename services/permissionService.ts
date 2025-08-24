import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddPermissionRequest } from '@/dto/Permission/Request/AddPermissionRequest';
import type { Permission } from '@/models/Permission';
import type { UpdatePermissionRequest } from '@/dto/Permission/Request/UpdatePermissionRequest';

// Auto-generated service for Permission Azure Functions
export const permissionService = {
  async addPermission(
    request: AddPermissionRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/permission/add`, request);
    return response;
  },
  async deletePermission(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/permission/${id}`);
    return response;
  },
  async getPermissionById(id: string): Promise<ApiResponse<Permission>> {
    const response = await apiService.get<Permission>(`/permission/${id}`);
    return response;
  },
  async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    const response = await apiService.get<Permission[]>(`/permissions`);
    return response;
  },
  async findPermissionsByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Permission[]>> {
    const response = await apiService.post<Permission[]>(
      `/permissions/find`,
      request
    );
    return response;
  },
  async updatePermission(
    request: UpdatePermissionRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/permission/update`,
      request
    );
    return response;
  },
};
