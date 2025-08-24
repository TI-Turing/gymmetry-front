import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddMachineCategoryRequest } from '@/dto/MachineCategory/Request/AddMachineCategoryRequest';
import type { MachineCategory } from '@/models/MachineCategory';
import type { UpdateMachineCategoryRequest } from '@/dto/MachineCategory/Request/UpdateMachineCategoryRequest';

// Auto-generated service for MachineCategory Azure Functions
export const machineCategoryService = {
  async addMachineCategory(
    request: AddMachineCategoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/machinecategory/add`,
      request
    );
    return response;
  },
  async deleteMachineCategory(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/machinecategory/${id}`);
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
    request: Record<string, unknown>
  ): Promise<ApiResponse<MachineCategory[]>> {
    const response = await apiService.post<MachineCategory[]>(
      `/machinecategories/find`,
      request
    );
    return response;
  },
  async updateMachineCategory(
    request: UpdateMachineCategoryRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/machinecategory/update`,
      request
    );
    return response;
  },
};
