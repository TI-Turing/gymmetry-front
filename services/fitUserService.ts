import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddFitUserRequest } from '@/dto/FitUser/Request/AddFitUserRequest';
import type { FitUser } from '@/models/FitUser';
import type { UpdateFitUserRequest } from '@/dto/FitUser/Request/UpdateFitUserRequest';

// Auto-generated service for FitUser Azure Functions
export const fitUserService = {
  async addFitUser(request: AddFitUserRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/fituser/add`, request);
    return response;
  },
  async deleteFitUser(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/fituser/${id}`);
    return response;
  },
  async getFitUserById(id: string): Promise<ApiResponse<FitUser>> {
    const response = await apiService.get<FitUser>(`/fituser/${id}`);
    return response;
  },
  async getAllFitUsers(): Promise<ApiResponse<FitUser[]>> {
    const response = await apiService.get<FitUser[]>(`/fitusers`);
    return response;
  },
  async findFitUsersByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<FitUser[]>> {
    const response = await apiService.post<FitUser[]>(
      `/fitusers/find`,
      request
    );
    return response;
  },
  async updateFitUser(
    request: UpdateFitUserRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/fituser/update`, request);
    return response;
  },

  // Alias para compatibilidad
  async getAllUsers(): Promise<ApiResponse<FitUser[]>> {
    return this.getAllFitUsers();
  },
};
