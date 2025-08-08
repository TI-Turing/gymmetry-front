import { apiService, ApiResponse } from '../apiService';
import type { AddPhysicalAssessmentRequest } from '@/dto/PhysicalAssessment/Request/AddPhysicalAssessmentRequest';
import type { PhysicalAssessment } from '@/models/PhysicalAssessment';
import type { UpdatePhysicalAssessmentRequest } from '@/dto/PhysicalAssessment/Request/UpdatePhysicalAssessmentRequest';

// Auto-generated service for PhysicalAssessment Azure Functions
export const physicalAssessmentFunctionsService = {
  async addPhysicalAssessment(request: AddPhysicalAssessmentRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/physicalassessment/add`, request);
    return response;
  },
  async deletePhysicalAssessment(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/physicalassessment/${id}`);
    return response;
  },
  async getPhysicalAssessmentById(id: string): Promise<ApiResponse<PhysicalAssessment>> {
    const response = await apiService.get<PhysicalAssessment>(`/physicalassessment/${id}`);
    return response;
  },
  async getAllPhysicalAssessments(): Promise<ApiResponse<PhysicalAssessment[]>> {
    const response = await apiService.get<PhysicalAssessment[]>(`/physicalassessments`);
    return response;
  },
  async findPhysicalAssessmentsByFields(request: Record<string, any>): Promise<ApiResponse<PhysicalAssessment[]>> {
    const response = await apiService.post<PhysicalAssessment[]>(`/physicalassessments/find`, request);
    return response;
  },
  async updatePhysicalAssessment(request: UpdatePhysicalAssessmentRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/physicalassessment/update`, request);
    return response;
  },
};
