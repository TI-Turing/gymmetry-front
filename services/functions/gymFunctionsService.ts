import { apiService, ApiResponse } from '../apiService';
import type { AddGymRequest } from '@/dto/gym/Request/AddGymRequest';
import type { FindGymsByFieldsRequest } from '@/dto/gym/FindGymsByFieldsRequest';
import type { UpdateGymRequest } from '@/dto/gym/Request/UpdateGymRequest';
import type { GenerateGymQrRequest } from '@/dto/gym/GenerateGymQrRequest';

// Auto-generated service for Gym Azure Functions
export const gymFunctionsService = {
  async addGym(request: AddGymRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gym/add`, request);
    return response;
  },
  async deleteGym(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/gym/${id}`);
    return response;
  },
  async getGymById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/gym/${id}`);
    return response;
  },
  async getAllGyms(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/gyms`);
    return response;
  },
  async findGymsByFields(
    request: FindGymsByFieldsRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gyms/find`, request);
    return response;
  },
  async findGymsByName(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/gyms/findbyname/{name}`);
    return response;
  },
  async updateGym(request: UpdateGymRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/gym/update`, request);
    return response;
  },
  async generateQr(request: GenerateGymQrRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gym/generate-qr`, request);
    return response;
  },
  async uploadLogo(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gym/upload-logo`, request);
    return response;
  },
};
