import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddEmployeeRegisterDailyRequest } from '@/dto/EmployeeRegisterDaily/Request/AddEmployeeRegisterDailyRequest';
import type { EmployeeRegisterDaily } from '@/models/EmployeeRegisterDaily';
import type { UpdateEmployeeRegisterDailyRequest } from '@/dto/EmployeeRegisterDaily/Request/UpdateEmployeeRegisterDailyRequest';

// Auto-generated service for EmployeeRegisterDaily Azure Functions
export const employeeRegisterDailyService = {
  async addEmployeeRegisterDaily(
    request: AddEmployeeRegisterDailyRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/employeeregisterdaily/add`,
      request
    );
    return response;
  },
  async deleteEmployeeRegisterDaily(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<EmployeeRegisterDaily[]>> {
    const response = await apiService.post<EmployeeRegisterDaily[]>(
      `/employeeregisterdailies/find`,
      request
    );
    return response;
  },
  async updateEmployeeRegisterDaily(
    request: UpdateEmployeeRegisterDailyRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/employeeregisterdaily/update`,
      request
    );
    return response;
  },

  // Alias para compatibilidad
  async getAllEmployeeRegisterDaily(): Promise<
    ApiResponse<EmployeeRegisterDaily[]>
  > {
    return this.getAllEmployeeRegisterDailies();
  },
};
