import { apiService, ApiResponse } from '../apiService';
import type { AddPermissionRequest } from '@/dto/Permission/Request/AddPermissionRequest';
import type { Permission } from '@/models/Permission';
import type { UpdatePermissionRequest } from '@/dto/Permission/Request/UpdatePermissionRequest';

// Auto-generated service for Permission Azure Functions
export const permissionFunctionsService = {
  async addPermission(
    request: AddPermissionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/permission/add`, request);
    return response;
  },
  async deletePermission(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/permission/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<Permission[]>> {
    const response = await apiService.post<Permission[]>(
      `/permissions/find`,
      request
    );
    return response;
  },
  async updatePermission(
    request: UpdatePermissionRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/permission/update`, request);
    return response;
  },
};
