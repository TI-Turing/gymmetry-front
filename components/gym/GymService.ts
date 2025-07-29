import { apiService, ApiResponse } from '@/services/apiService';
import {
  GymStep1Data,
  GymTypesResponse,
  GymRegistrationResponse,
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
    // Llamar al endpoint y obtener el wrapper del backend
    const apiResp = await apiService.post<any>('/gym/add', {
      name: data.name,
      nit: data.nit,
      email: data.email,
      owner_userId: data.owner_UserId, // Enviar Owner_UserId al backend
      countryId: 'b1a7c2e2-1234-4cde-8f2a-123456789abc',
    });
    const backend = apiResp.data as BackendApiResponse<string>;
    // Extraer el ID real desde backend.Data
    const gymId = backend.Data || '';
    const transformedResponse: GymRegistrationResponse = {
      Success: backend.Success,
      Message: backend.Message || '',
      Data: gymId,
      StatusCode: backend.StatusCode || 200,
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
  static async getGymTypes(): Promise<GymTypesResponse> {
    const response = await apiService.get<any>('/gymtypes');
    const backendResponse = response.data;

    // Extraer el array de tipos de gimnasio
    let gymTypesArray = [];
    if (
      backendResponse &&
      backendResponse.Data &&
      Array.isArray(backendResponse.Data)
    ) {
      gymTypesArray = backendResponse.Data;
    }

    const transformedResponse: GymTypesResponse = {
      Success: backendResponse?.Success || false,
      Message: backendResponse?.Message || '',
      Data: gymTypesArray,
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
}
