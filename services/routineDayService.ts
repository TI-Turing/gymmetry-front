import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddRoutineDayRequest } from '@/dto/RoutineDay/Request/AddRoutineDayRequest';
import type { AddRoutineDaysRequest } from '@/dto/RoutineDay/Request/AddRoutineDaysRequest';
import type { RoutineDay } from '@/models/RoutineDay';
import type { UpdateRoutineDayRequest } from '@/dto/RoutineDay/Request/UpdateRoutineDayRequest';

// Auto-generated service for RoutineDay Azure Functions
export const routineDayService = {
  async addRoutineDay(
    request: AddRoutineDayRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/routineday/add`, request);
    return response;
  },
  async addRoutineDays(
    request: AddRoutineDaysRequest
  ): Promise<ApiResponse<RoutineDay[]>> {
    const response = await apiService.post<RoutineDay[]>(
      `/routineday/addmany`,
      request
    );
    return response;
  },
  async deleteRoutineDay(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/routineday/${id}`);
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
  async findRoutineDaysByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<RoutineDay[]>> {
    const response = await apiService.post<RoutineDay[]>(
      `/routinedays/find`,
      request
    );
    return response;
  },
  async updateRoutineDay(
    request: UpdateRoutineDayRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/routineday/update`,
      request
    );
    return response;
  },
};
