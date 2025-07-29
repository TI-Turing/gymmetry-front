// Servicio para Branch basado en las Azure Functions y DTOs del backend
import { apiService } from './apiService';

// Interfaces DTO (replicadas desde C#)
export interface AddBranchRequest {
  name: string;
  address: string;
  cityId: string;
  regionId: string;
  gymId: string;
  accessMethodId: string;
}

export interface UpdateBranchRequest {
  id: string;
  address: string;
  cityId: string;
  regionId: string;
  gymId: string;
  branchDailyBranchId: string;
  accessMethodId: string;
}

// Interface para búsqueda por campos (genérica)
export interface FindBranchesByFieldsRequest {
  fields: { [key: string]: any };
}

export interface BranchBasicInfo {
  id: string;
  name: string;
  address: string;
  gymId: string;
  accessMethodId: string;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Funciones del servicio
export const branchService = {
  async addBranch(request: AddBranchRequest): Promise<ApiResponse<string>> {
    // POST /branch/add (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<string>>(
      '/branch/add',
      request
    );
    return response.data;
  },

  async getBranchById(id: string): Promise<ApiResponse<any>> {
    // GET /branch/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<ApiResponse<any>>(`/branch/${id}`);
    return response.data;
  },

  async getBranchesByGymId(gymId: string): Promise<ApiResponse<any[]>> {
    // GET /branch/gym/{gymId} (ruta inferida para obtener sedes de un gym)
    const response = await apiService.get<ApiResponse<any[]>>(
      `/branch/gym/${gymId}`
    );
    return response.data;
  },

  async updateBranch(
    request: UpdateBranchRequest
  ): Promise<ApiResponse<boolean>> {
    // PUT /branch/update (según la ruta de la Azure Function)
    const response = await apiService.put<ApiResponse<boolean>>(
      '/branch/update',
      request
    );
    return response.data;
  },

  async deleteBranch(id: string): Promise<ApiResponse<boolean>> {
    // DELETE /branch/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<ApiResponse<boolean>>(
      `/branch/${id}`
    );
    return response.data;
  },

  async getAllBranches(): Promise<ApiResponse<any[]>> {
    // GET /branch (según la ruta de la Azure Function)
    const response = await apiService.get<ApiResponse<any[]>>('/branch');
    return response.data;
  },

  async findBranchesByFields(
    request: FindBranchesByFieldsRequest
  ): Promise<ApiResponse<BranchBasicInfo[]>> {
    // POST /branch/find (genérica para buscar por cualquier campo)
    const response = await apiService.post<ApiResponse<BranchBasicInfo[]>>(
      '/branch/find',
      request
    );
    return response.data;
  },

  async getBranchesByGym(
    gymId: string
  ): Promise<ApiResponse<BranchBasicInfo[]>> {
    // Función helper que usa findBranchesByFields para buscar por gymId
    return this.findBranchesByFields({
      fields: { gymId },
    });
  },
};
