import { apiService, ApiResponse } from '../apiService';
import type { AddRoutineDayRequest } from '@/dto/RoutineDay/Request/AddRoutineDayRequest';
import type { AddRoutineDaysRequest } from '@/dto/RoutineDay/Request/AddRoutineDaysRequest';
import type { RoutineDay } from '@/models/RoutineDay';
import type { UpdateRoutineDayRequest } from '@/dto/RoutineDay/Request/UpdateRoutineDayRequest';

// Auto-generated service for RoutineDay Azure Functions
export const routineDayFunctionsService = {
  async addRoutineDay(request: AddRoutineDayRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/routineday/add`, request);
    return response;
  },
  async addRoutineDays(request: AddRoutineDaysRequest): Promise<ApiResponse<any[]>> {
    const response = await apiService.post<any[]>(`/routineday/addmany`, request);
    return response;
  },
  async deleteRoutineDay(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/routineday/${id}`);
    return response;
  },
  async getRoutineDay(id: string): Promise<ApiResponse<RoutineDay>> {
    const response = await apiService.get<RoutineDay>(`/routineday/${id}`);
    return response;
  },
  async getAllRoutineDays(): Promise<ApiResponse<RoutineDay[]>> {
    const response = await apiService.get<RoutineDay[]>(`/routinedays`);
    return response;
  },
  async findRoutineDaysByFields(request: Record<string, any>): Promise<ApiResponse<RoutineDay[]>> {
    const response = await apiService.post<RoutineDay[]>(`/routinedays/find`, request);
    return response;
  },
  async updateRoutineDay(request: UpdateRoutineDayRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/routineday/update`, request);
    return response;
  },
};
