import { apiService, ApiResponse } from '@/services/apiService';
import {
  GymStep1Data,
  GymTypesResponse,
  GymRegistrationResponse,
  CountriesResponse,
  GymUpdateResponse,
  GymCompleteData,
  BackendApiResponse,
} from './types';

export class GymService {
  // Helper para transformar respuesta del apiService a formato del backend C#
  private static transformResponse<T>(
    apiResponse: ApiResponse<T>
  ): BackendApiResponse<T> {
    return {
      Success: apiResponse.success,
      Message: apiResponse.message || '',
      Data: apiResponse.data,
      StatusCode: 200, // El apiService no retorna StatusCode, asumimos 200 si es exitoso
    };
  }
  // Paso 1: Registrar gimnasio inicial
  static async registerGym(
    data: GymStep1Data
  ): Promise<GymRegistrationResponse> {
    const response = await apiService.post<any>('/gym/add', {
      name: data.name,
      email: data.email,
      phone: data.phone,
      nit: data.nit,
    });
    return this.transformResponse(response);
  }

  // Actualizar información del gimnasio (pasos 2-5)
  static async updateGym(
    gymId: string,
    data: Partial<GymCompleteData>
  ): Promise<GymUpdateResponse> {
    const response = await apiService.put<any>('/gym/update', {
      id: gymId,
      ...data,
    });
    return this.transformResponse(response);
  }

  // Obtener tipos de gimnasio
  static async getGymTypes(): Promise<GymTypesResponse> {
    const response = await apiService.get<any>('/gymtypes');
    return this.transformResponse(response);
  }

  // Obtener países
  static async getCountries(): Promise<CountriesResponse> {
    const response = await apiService.get<any>('/countries');
    return this.transformResponse(response);
  }

  // Método helper para actualizar paso específico
  static async updateGymStep(
    gymId: string,
    stepData: Partial<GymCompleteData>
  ): Promise<GymUpdateResponse> {
    return this.updateGym(gymId, stepData);
  }
}
