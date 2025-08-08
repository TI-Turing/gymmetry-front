import { apiService, ApiResponse } from '../apiService';
import type { AddEmployeeUserRequest } from '@/dto/EmployeeUser/Request/AddEmployeeUserRequest';
import type { EmployeeUser } from '@/models/EmployeeUser';
import type { UpdateEmployeeUserRequest } from '@/dto/EmployeeUser/Request/UpdateEmployeeUserRequest';

// Auto-generated service for EmployeeUser Azure Functions
export const employeeUserFunctionsService = {
  async addEmployeeUser(
    request: AddEmployeeUserRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/employeeuser/add`, request);
    return response;
  },
  async deleteEmployeeUser(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/employeeuser/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<EmployeeUser[]>> {
    const response = await apiService.post<EmployeeUser[]>(
      `/employeeusers/find`,
      request
    );
    return response;
  },
  async updateEmployeeUser(
    request: UpdateEmployeeUserRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/employeeuser/update`, request);
    return response;
  },
};
