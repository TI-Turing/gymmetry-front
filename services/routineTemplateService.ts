import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/AddRoutineTemplateRequest';
import type { DuplicateRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/DuplicateRoutineTemplateRequest';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { UpdateRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/UpdateRoutineTemplateRequest';

// Auto-generated service for RoutineTemplate Azure Functions
export const routineTemplateService = {
  async addRoutineTemplate(
    request: AddRoutineTemplateRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/routinetemplate/add`,
      request
    );
    return response;
  },
  async duplicateRoutineTemplate(
    request: DuplicateRoutineTemplateRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/routinetemplate/duplicate`,
      request
    );
    return response;
  },
  async deleteRoutineTemplate(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/routinetemplate/${id}`);
    return response;
  },
  async getRoutineTemplate(id: string): Promise<ApiResponse<RoutineTemplate>> {
    const response = await apiService.get<RoutineTemplate>(
      `/routinetemplate/${id}`
    );
    return response;
  },
  async getAllRoutineTemplates(): Promise<ApiResponse<RoutineTemplate[]>> {
    const response =
      await apiService.get<RoutineTemplate[]>(`/routinetemplates`);
    return response;
  },
  async findRoutineTemplatesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<RoutineTemplate[]>> {
    const response = await apiService.post<RoutineTemplate[]>(
      `/routinetemplates/find`,
      request
    );
    return response;
  },
  async updateRoutineTemplate(
    request: UpdateRoutineTemplateRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/routinetemplate/update`,
      request
    );
    return response;
  },
};
