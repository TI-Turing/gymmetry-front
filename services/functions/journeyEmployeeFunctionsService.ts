import { apiService, ApiResponse } from '../apiService';
import type { AddJourneyEmployeeRequest } from '@/dto/JourneyEmployee/Request/AddJourneyEmployeeRequest';
import type { JourneyEmployee } from '@/models/JourneyEmployee';
import type { UpdateJourneyEmployeeRequest } from '@/dto/JourneyEmployee/Request/UpdateJourneyEmployeeRequest';

// Auto-generated service for JourneyEmployee Azure Functions
export const journeyEmployeeFunctionsService = {
  async addJourneyEmployee(
    request: AddJourneyEmployeeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/journeyemployee/add`,
      request
    );
    return response;
  },
  async deleteJourneyEmployee(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/journeyemployee/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<JourneyEmployee[]>> {
    const response = await apiService.post<JourneyEmployee[]>(
      `/journeyemployees/find`,
      request
    );
    return response;
  },
  async updateJourneyEmployee(
    request: UpdateJourneyEmployeeRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/journeyemployee/update`,
      request
    );
    return response;
  },
};
