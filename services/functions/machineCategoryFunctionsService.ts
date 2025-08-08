import { apiService, ApiResponse } from '../apiService';
import type { AddMachineCategoryRequest } from '@/dto/MachineCategory/Request/AddMachineCategoryRequest';
import type { MachineCategory } from '@/models/MachineCategory';
import type { UpdateMachineCategoryRequest } from '@/dto/MachineCategory/Request/UpdateMachineCategoryRequest';

// Auto-generated service for MachineCategory Azure Functions
export const machineCategoryFunctionsService = {
  async addMachineCategory(
    request: AddMachineCategoryRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/machinecategory/add`,
      request
    );
    return response;
  },
  async deleteMachineCategory(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/machinecategory/${id}`);
    return response;
  },
  async getMachineCategoryById(
    id: string
  ): Promise<ApiResponse<MachineCategory>> {
    const response = await apiService.get<MachineCategory>(
      `/machinecategory/${id}`
    );
    return response;
  },
  async getAllMachineCategories(): Promise<ApiResponse<MachineCategory[]>> {
    const response =
      await apiService.get<MachineCategory[]>(`/machinecategories`);
    return response;
  },
  async findMachineCategoriesByFields(
    request: Record<string, any>
  ): Promise<ApiResponse<MachineCategory[]>> {
    const response = await apiService.post<MachineCategory[]>(
      `/machinecategories/find`,
      request
    );
    return response;
  },
  async updateMachineCategory(
    request: UpdateMachineCategoryRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(
      `/machinecategory/update`,
      request
    );
    return response;
  },
};
