// Servicio específico para Branch (Azure Function: Branch_AddBranchFunction)
import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Interfaces DTO (basadas en el cuerpo de la Azure Function)
export interface CreateBranchRequest {
  name: string;
  address: string;
  cityId: string;
  regionId: string;
  gymId: string;
  accessMethodId: string;
}

// Las respuestas usan el ApiResponse estándar del backend

// Interface para AccessMethodType
export interface AccessMethodType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt?: string;
}

// Acceso a métodos de acceso: ApiResponse<AccessMethodType[]>

// Funciones del servicio Branch
export const BranchApiService = {
  async createBranch(
    request: CreateBranchRequest
  ): Promise<ApiResponse<string>> {
    // POST /branch/add (según la Azure Function Branch_AddBranchFunction)
    const response = await apiService.post<string>('/branch/add', request);
    return response;
  },

  async getBranchById(id: string): Promise<ApiResponse<unknown>> {
    // GET /branch/{id}
    const response = await apiService.get<unknown>(`/branch/${id}`);
    return response;
  },

  async updateBranch(request: unknown): Promise<ApiResponse<unknown>> {
    // PUT /branch/update
    const response = await apiService.put<unknown>('/branch/update', request);
    return response;
  },

  async deleteBranch(id: string): Promise<ApiResponse<unknown>> {
    // DELETE /branch/{id}
    const response = await apiService.delete<unknown>(`/branch/${id}`);
    return response;
  },

  // Obtener métodos de acceso disponibles
  async getAccessMethodTypes(): Promise<ApiResponse<AccessMethodType[]>> {
    // GET /accessmethodtypes (del servicio AccessMethodType)
    const response =
      await apiService.get<AccessMethodType[]>('/accessmethodtypes');
    return response;
  },
};
