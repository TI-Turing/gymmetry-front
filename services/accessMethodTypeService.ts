import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddAccessMethodTypeRequest } from '@/dto/accessMethodType/AddAccessMethodTypeRequest';
import type { AccessMethodType } from '@/models/AccessMethodType';
import type { FindAccessMethodTypesByFieldsRequest } from '@/dto/accessMethodType/FindAccessMethodTypesByFieldsRequest';
import type { UpdateAccessMethodTypeRequest } from '@/dto/accessMethodType/UpdateAccessMethodTypeRequest';

// Auto-generated service for AccessMethodType Azure Functions
export const accessMethodTypeService = {
  async addAccessMethodType(
    request: AddAccessMethodTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/accessmethodtype/add`,
      request
    );
    return response;
  },
  async deleteAccessMethodType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(
      `/accessmethodtype/${id}`
    );
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
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/accessmethodtype/update`,
      request
    );
    return response;
  },
};
