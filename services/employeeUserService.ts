import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddEmployeeUserRequest } from '@/dto/EmployeeUser/Request/AddEmployeeUserRequest';
import type { EmployeeUser } from '@/models/EmployeeUser';
import type { UpdateEmployeeUserRequest } from '@/dto/EmployeeUser/Request/UpdateEmployeeUserRequest';

// Auto-generated service for EmployeeUser Azure Functions
export const employeeUserService = {
  async addEmployeeUser(
    request: AddEmployeeUserRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/employeeuser/add`,
      request
    );
    return response;
  },
  async deleteEmployeeUser(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/employeeuser/${id}`);
    return response;
  },
  async getEmployeeUserById(id: string): Promise<ApiResponse<EmployeeUser>> {
    const response = await apiService.get<EmployeeUser>(`/employeeuser/${id}`);
    return response;
  },
  async getAllEmployeeUsers(): Promise<ApiResponse<EmployeeUser[]>> {
    const response = await apiService.get<EmployeeUser[]>(`/employeeusers`);
    return response;
  },
  async findEmployeeUsersByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<EmployeeUser[]>> {
    const response = await apiService.post<EmployeeUser[]>(
      `/employeeusers/find`,
      request
    );
    return response;
  },
  async updateEmployeeUser(
    request: UpdateEmployeeUserRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/employeeuser/update`,
      request
    );
    return response;
  },
};
