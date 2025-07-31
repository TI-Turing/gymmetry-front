// Servicio principal para Gym - Todas las funciones centralizadas aquí
import { apiService, ApiResponse } from './apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar tipos necesarios desde components/gym/types
import {
  GymStep1Data,
  GymRegistrationResponse,
  GymUpdateResponse,
  GymCompleteData,
  BackendApiResponse,
  GymGetResponse,
  GymType,
  Gym,
} from '@/components/gym/types';

// Constante para la clave de AsyncStorage
const GYM_DATA_KEY = '@gym_data';

// Interface para datos del gym en cache
export interface CachedGymData {
  gym: Gym | null;
  lastFetched: string;
}

// Interfaces DTO adicionales (replicadas desde C#)
export interface GenerateGymQrRequest {
  gymId: string;
  url: string;
}

export interface UploadGymLogoRequest {
  gymId: string;
  image: ArrayBuffer;
  fileName?: string;
  contentType?: string;
}

export interface GenerateGymQrResponse {
  qrCode: string;
  gymPlanSelectedType: any; // Puedes definir la interfaz si tienes el modelo
}

// Interface para búsqueda por campos (genérica)
export interface FindGymsByFieldsRequest {
  fields: { [key: string]: any };
}

export interface GymBasicInfo {
  id: string;
  name: string;
  email: string;
  nit: string;
  isVerified: boolean;
}

// Interface para respuesta de búsqueda por nombre
export interface FindGymsByNameResponse {
  Id: string;
  Name: string;
  Nit: string;
  Email: string;
  LogoUrl: string | null;
  Description: string;
  PhoneNumber: string | null;
  WebsiteUrl: string | null;
  SocialMediaLinks: string | null;
  LegalRepresentative: string | null;
  BillingEmail: string | null;
  SubscriptionPlanId: string | null;
  IsVerified: boolean;
  Tags: string | null;
  Owner_UserId: string;
  BrandColor: string | null;
  MaxBranchesAllowed: number | null;
  QrImageUrl: string | null;
  TrialEndsAt: string | null;
  CountryId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  GymTypeId: string;
  GymType: any;
  Bills: any[];
  Branches: any[];
  GymPlanSelecteds: any[];
  Plans: any[];
  RoutineTemplates: any[];
  UserGyms: any[];
  PaymentAttempts: any[];
  FacbookUrl: string | null;
  InstagramUrl: string | null;
  Slogan: string | null;
  PaisId: string | null;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
// Nota: ApiResponse ya está importado desde apiService

// Clase principal del servicio de Gym
export class GymService {
  private static cachedGym: CachedGymData | null = null;

  // Helper para transformar respuesta del apiService a formato del backend C#
  private static transformResponse<T>(
    apiResponse: ApiResponse<T>
  ): BackendApiResponse<T> {
    return {
      Success: apiResponse.Success,
      Message: apiResponse.Message || '',
      Data: apiResponse.Data,
      StatusCode: 200, // El apiService no retorna StatusCode, asumimos 200 si es exitoso
    };
  }

  // Paso 1: Registrar gimnasio inicial
  static async registerGym(
    data: GymStep1Data
  ): Promise<GymRegistrationResponse> {
    // Llamar al endpoint y obtener el wrapper del backend
    const apiResp = await apiService.post<any>('/gym/add', {
      name: data.name,
      nit: data.nit,
      email: data.email,
      owner_userId: data.owner_UserId, // Enviar Owner_UserId al backend
      countryId: 'b1a7c2e2-1234-4cde-8f2a-123456789abc',
    });

    // Extraer el ID real desde apiResp.Data
    const gymId = apiResp.Data || '';
    const transformedResponse: GymRegistrationResponse = {
      Success: apiResp.Success,
      Message: apiResp.Message || '',
      Data: gymId,
      StatusCode: apiResp.StatusCode || 200,
    };
    return transformedResponse;
  }

  // Actualizar información del gimnasio (pasos 2-5)
  static async updateGym(
    data: Partial<GymCompleteData>
  ): Promise<GymUpdateResponse> {
    const response = await apiService.put<any>('/gym/update', {
      ...data,
    });
    return this.transformResponse(response);
  }

  // Obtener tipos de gimnasio
  static async getGymTypes(): Promise<ApiResponse<GymType[]>> {
    const response = await apiService.get<GymType[]>('/gymtypes');

    return response;
  }

  // Obtener información de un gimnasio por ID
  static async getGymById(gymId: string): Promise<GymGetResponse> {
    const response = await apiService.get<any>(`/gym/${gymId}`);
    const backendResponse = response.Data;

    const transformedResponse: GymGetResponse = {
      Success: backendResponse?.Success || false,
      Message: backendResponse?.Message || '',
      Data: backendResponse?.Data || null,
      StatusCode: backendResponse?.StatusCode || 200,
    };

    return transformedResponse;
  }

  // Método helper para actualizar paso específico
  static async updateGymStep(
    stepData: Partial<GymCompleteData>
  ): Promise<GymUpdateResponse> {
    return this.updateGym(stepData);
  }

  // ========== MÉTODOS DE CACHE DEL GYM ==========

  // Obtener el gym cacheado
  static getCachedGym(): Gym | null {
    return this.cachedGym?.gym || null;
  }

  // Obtener los datos completos del cache (incluyendo lastFetched)
  static getCachedGymData(): CachedGymData | null {
    return this.cachedGym;
  }

  // Consultar y cachear datos del gym
  static async fetchAndCacheGymData(gymId: string): Promise<Gym | null> {
    try {
      const response = await this.getGymById(gymId);
      if (response.Success && response.Data) {
        const gymData: CachedGymData = {
          gym: response.Data,
          lastFetched: new Date().toISOString(),
        };
        this.cachedGym = gymData;
        await AsyncStorage.setItem(GYM_DATA_KEY, JSON.stringify(gymData));

        return response.Data;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Refrescar datos del gym usando un gymId específico
  static async refreshGymData(gymId?: string): Promise<Gym | null> {
    if (gymId) {
      return await this.fetchAndCacheGymData(gymId);
    }

    // Si no se proporciona gymId, intentar usar el del cache actual
    const currentGymId = this.cachedGym?.gym?.Id;
    if (currentGymId) {
      return await this.fetchAndCacheGymData(currentGymId);
    }

    return null;
  }

  // Cargar datos del gym desde AsyncStorage
  static async loadGymDataFromStorage(): Promise<Gym | null> {
    try {
      const gymDataString = await AsyncStorage.getItem(GYM_DATA_KEY);
      if (gymDataString) {
        this.cachedGym = JSON.parse(gymDataString);
        return this.cachedGym?.gym || null;
      }
      return null;
    } catch {
      // Error al parsear datos del gym, limpiar
      await AsyncStorage.removeItem(GYM_DATA_KEY);
      return null;
    }
  }

  // Limpiar cache del gym
  static async clearGymCache(): Promise<void> {
    this.cachedGym = null;
    await AsyncStorage.removeItem(GYM_DATA_KEY);
  }

  // Verificar si hay datos del gym en cache
  static hasGymData(): boolean {
    return this.cachedGym?.gym !== null;
  }

  // Método para que el observador actualice el cache cuando detecte cambios
  static async updateCacheFromObserver(gymId: string): Promise<void> {
    try {
      await this.fetchAndCacheGymData(gymId);
    } catch {
      // Manejo silencioso de errores
    }
  }
}

// Funciones del servicio adicionales
export const gymServiceExtensions = {
  async generateGymQr(
    request: GenerateGymQrRequest
  ): Promise<ApiResponse<GenerateGymQrResponse>> {
    // POST /gym/generate-qr (según la ruta de la Azure Function)
    const response = await apiService.post<GenerateGymQrResponse>(
      '/gym/generate-qr',
      request
    );
    return response;
  },

  async uploadGymLogo(
    request: UploadGymLogoRequest
  ): Promise<ApiResponse<string>> {
    // POST /gym/upload-logo (según la ruta de la Azure Function)
    const response = await apiService.post<string>('/gym/upload-logo', request);
    return response;
  },

  async deleteGym(gymId: string): Promise<ApiResponse<boolean>> {
    // DELETE /gym/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<boolean>(`/gym/${gymId}`);
    return response;
  },

  async findGymsByFields(
    request: FindGymsByFieldsRequest
  ): Promise<ApiResponse<GymBasicInfo[]>> {
    // POST /gym/find (genérica para buscar gyms por cualquier campo)
    const response = await apiService.post<GymBasicInfo[]>(
      '/gym/find',
      request
    );
    return response;
  },

  async findGymsByName(
    name: string
  ): Promise<ApiResponse<FindGymsByNameResponse[]>> {
    // GET /gyms/findbyname/{name} (según la Azure Function especificada)
    const response = await apiService.get<FindGymsByNameResponse[]>(
      `/gyms/findbyname/${encodeURIComponent(name)}`
    );
    return response;
  },
};
