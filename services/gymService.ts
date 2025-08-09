import { apiService, ApiResponse } from './apiService';
import type { AddGymRequest } from '@/dto/gym/Request/AddGymRequest';
import type { FindGymsByFieldsRequest } from '@/dto/gym/FindGymsByFieldsRequest';
import type { UpdateGymRequest } from '@/dto/gym/Request/UpdateGymRequest';
import type { GenerateGymQrRequest } from '@/dto/gym/GenerateGymQrRequest';

// Auto-generated service for Gym Azure Functions
export const gymService = {
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
  async findGymsByName(name?: string): Promise<ApiResponse<any>> {
    const endpoint = name ? `/gyms/findbyname/${name}` : `/gyms/findbyname/{name}`;
    const response = await apiService.get<any>(endpoint);
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

  // Métodos adicionales para compatibilidad
  async getGymTypes(): Promise<ApiResponse<any[]>> {
    const response = await apiService.get<any[]>(`/gym/types`);
    return response;
  },

  getCachedGymData(): any {
    // Implementación básica para compatibilidad
    return null;
  },

  // Alias para compatibilidad con getCachedGym
  getCachedGym(): any {
    return this.getCachedGymData();
  },

  async updateCacheFromObserver(gymId: string): Promise<void> {
    // Implementación básica para compatibilidad
    console.log('updateCacheFromObserver called with gymId:', gymId);
  },

  // Método para refrescar datos del gimnasio
  async refreshGymData(gymId?: string): Promise<void> {
    console.log('refreshGymData called with gymId:', gymId);
    // Implementación básica para compatibilidad
  },

  // Métodos adicionales para los pasos del gimnasio
  async registerGym(payload: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gym/register`, payload);
    return response;
  },

  async updateGymStep(formData: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/gym/update-step`, formData);
    return response;
  },

  async fetchAndCacheGymData(gymId: string): Promise<any> {
    const response = await this.getGymById(gymId);
    return response.Success ? response.Data : null;
  }
};

// Alias para compatibilidad
export const GymService = gymService;

// Extensiones adicionales para compatibilidad
export const gymServiceExtensions = {
  ...gymService,
  // Métodos adicionales si son necesarios
};
