import { apiService, ApiResponse } from './apiService';
import type { AddGymRequest } from '@/dto/gym/Request/AddGymRequest';
import type { FindGymsByFieldsRequest } from '@/dto/gym/FindGymsByFieldsRequest';
import type { UpdateGymRequest } from '@/dto/gym/Request/UpdateGymRequest';
import type { GenerateGymQrRequest } from '@/dto/gym/GenerateGymQrRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auto-generated service for Gym Azure Functions
export const gymService = {

  cachedGym: null as any | null,

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

  async generateCachedGym(gymId: string) {
    if (!gymId) return null;
    const gymData = await this.fetchAndCacheGymData(gymId);
    this.cachedGym = gymData ?? null;
    return this.cachedGym;
  },

  async getCachedGymData(): Promise<any> {
    // Implementación básica para compatibilidad
    const gymId = await AsyncStorage.getItem('@gym_id');
    if (gymId) {
      if (this.cachedGym == null) {
        this.cachedGym = await this.generateCachedGym(gymId);
      }
    }
    return this.cachedGym;
  },

  // Alias para compatibilidad con getCachedGym
  getCachedGym(): any {
    return this.getCachedGymData();
  },

  async updateCacheFromObserver(gymId: string): Promise<void> {
    // Implementación básica para compatibilidad
    await this.generateCachedGym(gymId);
  },

  // Método para refrescar datos del gimnasio
  async refreshGymData(gymId?: string): Promise<void> {
    console.log('refreshGymData called with gymId:', gymId);
    // Implementación básica para compatibilidad
  },

  // Métodos adicionales para los pasos del gimnasio
  async registerGym(payload: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/gym/add`, payload);
    if (response.Success) {
      // Guardar solo el ID del gym
      const createdGymId = typeof response.Data === 'string' ? response.Data : response.Data?.Id ?? response.Data?.id;
      if (createdGymId) {
        await AsyncStorage.setItem('@gym_id', createdGymId);
      }
    }
    return response;
  },

  async updateGymStep(formData: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/gym/update`, formData);
    return response;
  },

  async fetchAndCacheGymData(gymId: string): Promise<any> {
    const response = await this.getGymById(gymId);
    const data = response.Success ? response.Data : null;
    this.cachedGym = data ?? null;
    return this.cachedGym;
  }
};

// Alias para compatibilidad
export const GymService = gymService;

// Extensiones adicionales para compatibilidad
export const gymServiceExtensions = {
  ...gymService,
  // Métodos adicionales si son necesarios
};
