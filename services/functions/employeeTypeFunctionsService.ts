import { apiService, ApiResponse } from '../apiService';
import type { AddEmployeeTypeRequest } from '@/dto/EmployeeType/Request/AddEmployeeTypeRequest';
import type { EmployeeType } from '@/models/EmployeeType';
import type { UpdateEmployeeTypeRequest } from '@/dto/EmployeeType/Request/UpdateEmployeeTypeRequest';

// Auto-generated service for EmployeeType Azure Functions
export const employeeTypeFunctionsService = {
  async addEmployeeType(request: AddEmployeeTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/employeetype/add`, request);
    return response;
  },
  async deleteEmployeeType(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/employeetype/${id}`);
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
  async findEmployeeTypesByFields(request: Record<string, any>): Promise<ApiResponse<EmployeeType[]>> {
    const response = await apiService.post<EmployeeType[]>(`/employeetypes/find`, request);
    return response;
  },
  async updateEmployeeType(request: UpdateEmployeeTypeRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/employeetype/update`, request);
    return response;
  },
};
