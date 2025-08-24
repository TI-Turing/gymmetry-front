import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddJourneyEmployeeRequest } from '@/dto/JourneyEmployee/Request/AddJourneyEmployeeRequest';
import type { JourneyEmployee } from '@/models/JourneyEmployee';
import type { UpdateJourneyEmployeeRequest } from '@/dto/JourneyEmployee/Request/UpdateJourneyEmployeeRequest';

// Auto-generated service for JourneyEmployee Azure Functions
export const journeyEmployeeService = {
  async addJourneyEmployee(
    request: AddJourneyEmployeeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/journeyemployee/add`,
      request
    );
    return response;
  },
  async deleteJourneyEmployee(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/journeyemployee/${id}`);
    return response;
  },
  async getJourneyEmployeeById(
    id: string
  ): Promise<ApiResponse<JourneyEmployee>> {
    const response = await apiService.get<JourneyEmployee>(
      `/journeyemployee/${id}`
    );
    return response;
  },
  async getAllJourneyEmployees(): Promise<ApiResponse<JourneyEmployee[]>> {
    const response =
      await apiService.get<JourneyEmployee[]>(`/journeyemployees`);
    return response;
  },
  async findJourneyEmployeesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<JourneyEmployee[]>> {
    const response = await apiService.post<JourneyEmployee[]>(
      `/journeyemployees/find`,
      request
    );
    return response;
  },
  async updateJourneyEmployee(
    request: UpdateJourneyEmployeeRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/journeyemployee/update`,
      request
    );
    return response;
  },
};
