import { apiService, ApiResponse } from '../apiService';
import type { AddEmployeeRegisterDailyRequest } from '@/dto/EmployeeRegisterDaily/Request/AddEmployeeRegisterDailyRequest';
import type { EmployeeRegisterDaily } from '@/models/EmployeeRegisterDaily';
import type { UpdateEmployeeRegisterDailyRequest } from '@/dto/EmployeeRegisterDaily/Request/UpdateEmployeeRegisterDailyRequest';

// Auto-generated service for EmployeeRegisterDaily Azure Functions
export const employeeRegisterDailyFunctionsService = {
  async addEmployeeRegisterDaily(
    request: AddEmployeeRegisterDailyRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/employeeregisterdaily/add`,
      request
    );
    return response;
  },
  async deleteEmployeeRegisterDaily(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(
      `/employeeregisterdaily/${id}`
    );
    return response;
  },
  async getEmployeeRegisterDailyById(
    id: string
  ): Promise<ApiResponse<EmployeeRegisterDaily>> {
    const response = await apiService.get<EmployeeRegisterDaily>(
      `/employeeregisterdaily/${id}`
    );
    return response;
  },
  async getAllEmployeeRegisterDailies(): Promise<
    ApiResponse<EmployeeRegisterDaily[]>
  > {
    const response = await apiService.get<EmployeeRegisterDaily[]>(
      `/employeeregisterdailies`
    );
    return response;
  },
  async findEmployeeRegisterDailiesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<EmployeeRegisterDaily[]>> {
    const response = await apiService.post<EmployeeRegisterDaily[]>(
      `/employeeregisterdailies/find`,
      request
    );
    return response;
  },
  async updateEmployeeRegisterDaily(
    request: UpdateEmployeeRegisterDailyRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/employeeregisterdaily/update`,
      request
    );
    return response;
  },
};
