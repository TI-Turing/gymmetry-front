import { apiService, ApiResponse } from '../apiService';
import type { AddUserTypeRequest } from '@/dto/UserType/Request/AddUserTypeRequest';
import type { UserType } from '@/models/UserType';
import type { UpdateUserTypeRequest } from '@/dto/UserType/Request/UpdateUserTypeRequest';

// Auto-generated service for UserType Azure Functions
export const userTypeFunctionsService = {
  async addUserType(request: AddUserTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/usertype/add`, request);
    return response;
  },
  async deleteUserType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/usertype/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<UserType[]>> {
    const response = await apiService.post<UserType[]>(
      `/usertypes/find`,
      request
    );
    return response;
  },
  async updateUserType(
    request: UpdateUserTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/usertype/update`, request);
    return response;
  },
};
