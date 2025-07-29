// Servicio específico para Branch (Azure Function: Branch_AddBranchFunction)
import { apiService } from './apiService';

// Interfaces DTO (basadas en el cuerpo de la Azure Function)
export interface CreateBranchRequest {
  name: string;
  address: string;
  cityId: string;
  regionId: string;
  gymId: string;
  accessMethodId: string;
}

export interface CreateBranchResponse {
  Success: boolean;
  Message: string;
  Data: string; // ID de la sede creada
  StatusCode: number;
}

// Interface para AccessMethodType
export interface AccessMethodType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt?: string;
}

export interface AccessMethodTypesResponse {
  Success: boolean;
  Message: string;
  Data: AccessMethodType[];
  StatusCode: number;
}

// Funciones del servicio Branch
export const BranchService = {
  async createBranch(
    request: CreateBranchRequest
  ): Promise<CreateBranchResponse> {
    // POST /branch/add (según la Azure Function Branch_AddBranchFunction)
    const response = await apiService.post<CreateBranchResponse>(
      '/branch/add',
      request
    );
    return response.data;
  },

  async getBranchById(id: string): Promise<any> {
    // GET /branch/{id}
    const response = await apiService.get(`/branch/${id}`);
    return response.data;
  },

  async updateBranch(request: any): Promise<any> {
    // PUT /branch/update
    const response = await apiService.put('/branch/update', request);
    return response.data;
  },

  async deleteBranch(id: string): Promise<any> {
    // DELETE /branch/{id}
    const response = await apiService.delete(`/branch/${id}`);
    return response.data;
  },

  // Obtener métodos de acceso disponibles
  async getAccessMethodTypes(): Promise<AccessMethodTypesResponse> {
    // GET /accessmethodtypes (del servicio AccessMethodType)
    const response =
      await apiService.get<AccessMethodTypesResponse>('/accessmethodtypes');
    return response.data;
  },
};
