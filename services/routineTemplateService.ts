import { apiService, ApiResponse } from './apiService';
import type { AddRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/AddRoutineTemplateRequest';
import type { DuplicateRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/DuplicateRoutineTemplateRequest';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { UpdateRoutineTemplateRequest } from '@/dto/RoutineTemplate/Request/UpdateRoutineTemplateRequest';

// Auto-generated service for RoutineTemplate Azure Functions
export const routineTemplateService = {
  async addRoutineTemplate(
    request: AddRoutineTemplateRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/routinetemplate/add`,
      request
    );
    return response;
  },
  async duplicateRoutineTemplate(
    request: DuplicateRoutineTemplateRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/routinetemplate/duplicate`,
      request
    );
    return response;
  },
  async deleteRoutineTemplate(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/routinetemplate/${id}`);
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
    request: Record<string, any>
  ): Promise<ApiResponse<RoutineTemplate[]>> {
    const response = await apiService.post<RoutineTemplate[]>(
      `/routinetemplates/find`,
      request
    );
    return response;
  },
  async updateRoutineTemplate(
    request: UpdateRoutineTemplateRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/routinetemplate/update`,
      request
    );
    return response;
  },
};
