import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddGymRequest } from '@/dto/gym/Request/AddGymRequest';
import type { FindGymsByFieldsRequest } from '@/dto/gym/FindGymsByFieldsRequest';
import type { UpdateGymRequest } from '@/dto/gym/Request/UpdateGymRequest';
import type { GenerateGymQrRequest } from '@/dto/gym/GenerateGymQrRequest';
import type { GenerateGymQrResponse } from '@/dto/gym/GenerateGymQrResponse';
import type { Gym } from '@/dto/gym/Gym';
import type { FindGymsByNameResponse } from '@/dto/gym/FindGymsByNameResponse';
import type { UploadGymLogoRequest } from '@/dto/gym/UploadGymLogoRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auto-generated service for Gym Azure Functions
export const gymService = {
  cachedGym: null as Gym | null,
  cachedGymId: null as string | null,
  /**
   * Limpia completamente la caché en memoria del gimnasio.
   * No elimina AsyncStorage; para eso, hazlo desde quien maneja sesión (p.ej., authService.logout).
   */
  clearCache(): void {
    this.cachedGym = null;
    this.cachedGymId = null;
  },

  async addGym(request: AddGymRequest): Promise<ApiResponse<string | Gym>> {
    const response = await apiService.post<string | Gym>(`/gym/add`, request);
    return response;
  },
  async deleteGym(id: string): Promise<ApiResponse<string | null>> {
    const response = await apiService.delete<string | null>(`/gym/${id}`);
    return response;
  },
  async getGymById(id: string): Promise<ApiResponse<Gym>> {
    const response = await apiService.get<Gym>(`/gym/${id}`);
    return response;
  },
  async getAllGyms(): Promise<ApiResponse<Gym[]>> {
    const response = await apiService.get<Gym[]>(`/gyms`);
    return response;
  },
  async findGymsByFields(
    request: FindGymsByFieldsRequest
  ): Promise<ApiResponse<Gym[]>> {
    const response = await apiService.post<Gym[]>(`/gyms/find`, request);
    return response;
  },
  async findGymsByName(
    name?: string
  ): Promise<ApiResponse<FindGymsByNameResponse[]>> {
    const endpoint = name
      ? `/gyms/findbyname/${name}`
      : `/gyms/findbyname/{name}`;
    const response = await apiService.get<FindGymsByNameResponse[]>(endpoint);
    return response;
  },
  async updateGym(request: UpdateGymRequest): Promise<ApiResponse<Gym>> {
    const response = await apiService.put<Gym>(`/gym/update`, request);
    return response;
  },
  async generateQr(
    request: GenerateGymQrRequest
  ): Promise<ApiResponse<GenerateGymQrResponse>> {
    const response = await apiService.post<GenerateGymQrResponse>(
      `/gym/generate-qr`,
      request
    );
    return response;
  },
  async uploadLogo(
    request: UploadGymLogoRequest
  ): Promise<ApiResponse<string | Gym>> {
    const response = await apiService.post<string | Gym>(
      `/gym/upload-logo`,
      request
    );
    return response;
  },

  async generateCachedGym(gymId: string) {
    if (!gymId) return null;
    const gymData = await this.fetchAndCacheGymData(gymId);
    this.cachedGym = gymData ?? null;
    this.cachedGymId = gymId ?? null;
    return this.cachedGym;
  },

  async getCachedGymData(): Promise<Gym | null> {
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
  getCachedGym(): Promise<Gym | null> {
    return this.getCachedGymData();
  },

  // Obtiene el gym en caché garantizando que corresponda al gymId actual
  async getCachedGymById(gymId: string): Promise<Gym | null> {
    if (!gymId) return null;
    if (this.cachedGym && this.cachedGymId === gymId) {
      return this.cachedGym;
    }
    return await this.generateCachedGym(gymId);
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
  async registerGym(
    payload: AddGymRequest
  ): Promise<ApiResponse<string | Gym>> {
    const response = await apiService.post<string | Gym>(`/gym/add`, payload);
    if (response.Success) {
      // Guardar solo el ID del gym
      const createdGymId =
        typeof response.Data === 'string'
          ? response.Data
          : (response.Data?.Id ??
            (response.Data as unknown as { id?: string })?.id);
      if (createdGymId) {
        await AsyncStorage.setItem('@gym_id', createdGymId);
      }
    }
    return response;
  },

  async updateGymStep(
    formData: Partial<UpdateGymRequest>
  ): Promise<ApiResponse<Gym>> {
    const response = await apiService.put<Gym>(
      `/gym/update`,
      formData as UpdateGymRequest
    );
    return response;
  },

  async fetchAndCacheGymData(gymId: string): Promise<Gym | null> {
    const response = await this.getGymById(gymId);
    const data = response.Success ? (response.Data as Gym) : null;
    this.cachedGym = data ?? null;
    this.cachedGymId = gymId ?? null;
    return this.cachedGym;
  },
};

// Alias para compatibilidad
export const GymService = gymService;

// Extensiones adicionales para compatibilidad
export const gymServiceExtensions = {
  ...gymService,
  // Métodos adicionales si son necesarios
};
