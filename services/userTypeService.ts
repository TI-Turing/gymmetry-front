import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddUserTypeRequest } from '@/dto/UserType/Request/AddUserTypeRequest';
import type { UserType } from '@/models/UserType';
import type { UpdateUserTypeRequest } from '@/dto/UserType/Request/UpdateUserTypeRequest';

// Auto-generated service for UserType Azure Functions
export const userTypeService = {
  async addUserType(
    request: AddUserTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/usertype/add`, request);
    return response;
  },
  async deleteUserType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/usertype/${id}`);
    return response;
  },
  async getUserType(id: string): Promise<ApiResponse<UserType>> {
    const response = await apiService.get<UserType>(`/usertype/${id}`);
    return response;
  },
  async getAllUserTypes(): Promise<ApiResponse<UserType[]>> {
    const response = await apiService.get<UserType[]>(`/usertypes`);
    return response;
  },
  async findUserTypesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<UserType[]>> {
    const response = await apiService.post<UserType[]>(
      `/usertypes/find`,
      request
    );
    return response;
  },
  async updateUserType(
    request: UpdateUserTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/usertype/update`, request);
    return response;
  },
};
