import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddEmployeeTypeRequest } from '@/dto/EmployeeType/Request/AddEmployeeTypeRequest';
import type { EmployeeType } from '@/models/EmployeeType';
import type { UpdateEmployeeTypeRequest } from '@/dto/EmployeeType/Request/UpdateEmployeeTypeRequest';

// Auto-generated service for EmployeeType Azure Functions
export const employeeTypeService = {
  async addEmployeeType(
    request: AddEmployeeTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/employeetype/add`,
      request
    );
    return response;
  },
  async deleteEmployeeType(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/employeetype/${id}`);
    return response;
  },
  async getEmployeeTypeById(id: string): Promise<ApiResponse<EmployeeType>> {
    const response = await apiService.get<EmployeeType>(`/employeetype/${id}`);
    return response;
  },
  async getAllEmployeeTypes(): Promise<ApiResponse<EmployeeType[]>> {
    const response = await apiService.get<EmployeeType[]>(`/employeetypes`);
    return response;
  },
  async findEmployeeTypesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<EmployeeType[]>> {
    const response = await apiService.post<EmployeeType[]>(
      `/employeetypes/find`,
      request
    );
    return response;
  },
  async updateEmployeeType(
    request: UpdateEmployeeTypeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/employeetype/update`,
      request
    );
    return response;
  },
};
