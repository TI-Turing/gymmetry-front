import { apiService, ApiResponse } from './apiService';
import type { AddBrandRequest } from '@/dto/Brand/Request/AddBrandRequest';
import type { Brand } from '@/models/Brand';
import type { UpdateBrandRequest } from '@/dto/Brand/Request/UpdateBrandRequest';

// Auto-generated service for Brand Azure Functions
export const brandService = {
  async addBrand(
    request: AddBrandRequest
  ): Promise<ApiResponse<Brand | string>> {
    const response = await apiService.post<Brand | string>(
      `/brand/add`,
      request
    );
    return response;
  },
  async deleteBrand(id: string): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(`/brand/${id}`);
    return response;
  },
  async getBrandById(id: string): Promise<ApiResponse<Brand>> {
    const response = await apiService.get<Brand>(`/brand/${id}`);
    return response;
  },
  async getAllBrands(): Promise<ApiResponse<Brand[]>> {
    const response = await apiService.get<Brand[]>(`/brands`);
    return response;
  },
  async findBrandsByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<Brand[]>> {
    const response = await apiService.post<Brand[]>(`/brands/find`, request);
    return response;
  },
  async updateBrand(request: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
    const response = await apiService.put<Brand>(`/brand/update`, request);
    return response;
  },
};
