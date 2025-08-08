import { apiService, ApiResponse } from '../apiService';
import type { AddAccessMethodTypeRequest } from '@/dto/accessMethodType/AddAccessMethodTypeRequest';
import type { AccessMethodType } from '@/models/AccessMethodType';
import type { FindAccessMethodTypesByFieldsRequest } from '@/dto/accessMethodType/FindAccessMethodTypesByFieldsRequest';
import type { UpdateAccessMethodTypeRequest } from '@/dto/accessMethodType/UpdateAccessMethodTypeRequest';

// Auto-generated service for AccessMethodType Azure Functions
export const accessMethodTypeFunctionsService = {
  async addAccessMethodType(
    request: AddAccessMethodTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/accessmethodtype/add`,
      request
    );
    return response;
  },
  async deleteAccessMethodType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/accessmethodtype/${id}`);
    return response;
  },
  async getAccessMethodTypeById(
    id: string
  ): Promise<ApiResponse<AccessMethodType>> {
    const response = await apiService.get<AccessMethodType>(
      `/accessmethodtype/${id}`
    );
    return response;
  },
  async getAllAccessMethodTypes(): Promise<ApiResponse<AccessMethodType[]>> {
    const response =
      await apiService.get<AccessMethodType[]>(`/accessmethodtypes`);
    return response;
  },
  async findAccessMethodTypesByFields(
    request: FindAccessMethodTypesByFieldsRequest
  ): Promise<ApiResponse<AccessMethodType[]>> {
    const response = await apiService.post<AccessMethodType[]>(
      `/accessmethodtypes/find`,
      request
    );
    return response;
  },
  async updateAccessMethodType(
    request: UpdateAccessMethodTypeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/accessmethodtype/update`,
      request
    );
    return response;
  },
};
