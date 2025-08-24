import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddPhysicalAssessmentRequest } from '@/dto/PhysicalAssessment/Request/AddPhysicalAssessmentRequest';
import type { PhysicalAssessment } from '@/models/PhysicalAssessment';
import type { UpdatePhysicalAssessmentRequest } from '@/dto/PhysicalAssessment/Request/UpdatePhysicalAssessmentRequest';

// Auto-generated service for PhysicalAssessment Azure Functions
export const physicalAssessmentService = {
  async addPhysicalAssessment(
    request: AddPhysicalAssessmentRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/physicalassessment/add`,
      request
    );
    return response;
  },
  async deletePhysicalAssessment(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(
      `/physicalassessment/${id}`
    );
    return response;
  },
  async getPhysicalAssessmentById(
    id: string
  ): Promise<ApiResponse<PhysicalAssessment>> {
    const response = await apiService.get<PhysicalAssessment>(
      `/physicalassessment/${id}`
    );
    return response;
  },
  async getAllPhysicalAssessments(): Promise<
    ApiResponse<PhysicalAssessment[]>
  > {
    const response =
      await apiService.get<PhysicalAssessment[]>(`/physicalassessments`);
    return response;
  },
  async findPhysicalAssessmentsByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<PhysicalAssessment[]>> {
    const response = await apiService.post<PhysicalAssessment[]>(
      `/physicalassessments/find`,
      request
    );
    return response;
  },
  async updatePhysicalAssessment(
    request: UpdatePhysicalAssessmentRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/physicalassessment/update`,
      request
    );
    return response;
  },
};
