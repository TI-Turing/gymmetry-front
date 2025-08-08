// Servicio para Branch basado en las Azure Functions y DTOs del backend
import { apiService, ApiResponse } from './apiService';
import { AddBranchRequest } from '@/dto/branch/AddBranchRequest';
import { UpdateBranchRequest } from '@/dto/branch/UpdateBranchRequest';
import { FindBranchesByFieldsRequest } from '@/dto/branch/FindBranchesByFieldsRequest';
import { BranchBasicInfo } from '@/dto/branch/BranchBasicInfo';

// Funciones del servicio
export const branchService = {
  async addBranch(request: AddBranchRequest): Promise<ApiResponse<string>> {
    // POST /branch/add (según la ruta de la Azure Function)
    const response = await apiService.post<string>('/branch/add', request);
    return response;
  },

  async getBranchById(id: string): Promise<ApiResponse<any>> {
    // GET /branch/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<any>(`/branch/${id}`);
    return response;
  },

  async getBranchesByGymId(gymId: string): Promise<ApiResponse<any[]>> {
    // GET /branch/gym/{gymId} (ruta inferida para obtener sedes de un gym)
    const response = await apiService.get<any[]>(`/branch/gym/${gymId}`);
    return response;
  },

  async updateBranch(
    request: UpdateBranchRequest
  ): Promise<ApiResponse<boolean>> {
    // PUT /branch/update (según la ruta de la Azure Function)
    const response = await apiService.put<boolean>('/branch/update', request);
    return response;
  },

  async deleteBranch(id: string): Promise<ApiResponse<boolean>> {
    // DELETE /branch/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<boolean>(`/branch/${id}`);
    return response;
  },

  async getAllBranches(): Promise<ApiResponse<any[]>> {
    // GET /branch (según la ruta de la Azure Function)
    const response = await apiService.get<any[]>('/branch');
    return response;
  },

  async findBranchesByFields(
    request: FindBranchesByFieldsRequest
  ): Promise<ApiResponse<BranchBasicInfo[]>> {
    // POST /branch/find (genérica para buscar por cualquier campo)
    const response = await apiService.post<BranchBasicInfo[]>(
      '/branch/find',
      request
    );
    return response;
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
