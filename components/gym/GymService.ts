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
    // eslint-disable-next-line no-console
    console.log('🏋️ Registrando gimnasio con datos:', data);
    const response = await apiService.post<string>('/gym/add', {
      name: data.name,
      nit: data.nit,
      email: data.email,
      countryId: 'b1a7c2e2-1234-4cde-8f2a-123456789abc', // TODO: Obtener del formulario cuando se implemente selección de país
      gymTypeId: 'B8AECF5D-A091-414A-89B6-159A80A2453E', // TODO: Obtener del formulario cuando se implemente selección de tipo
    });

    // eslint-disable-next-line no-console
    console.log('📡 API Response:', response);

    // Transformar la respuesta: el backend retorna solo el ID como string en Data
    const transformedResponse: GymRegistrationResponse = {
      Success: response.success,
      Message: response.message || '',
      Data: { Id: response.data || '' },
      StatusCode: 200,
    };

    // eslint-disable-next-line no-console
    console.log('🔄 Transformed Response:', transformedResponse);

    return transformedResponse;
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
    // eslint-disable-next-line no-console
    console.log('🏷️ Cargando tipos de gimnasio...');
    const response = await apiService.get<any>('/gymtypes');
    // eslint-disable-next-line no-console
    console.log('📡 Raw gymTypes response:', response);

    // El backend retorna un objeto con propiedades numeradas, convertir a array
    let gymTypesArray = [];
    if (response.data && typeof response.data === 'object') {
      // Si es un objeto con propiedades numeradas, convertir a array
      gymTypesArray = Object.values(response.data);
    } else if (Array.isArray(response.data)) {
      // Si ya es un array, usarlo directamente
      gymTypesArray = response.data;
    }

    // eslint-disable-next-line no-console
    console.log('🔄 Converted to array:', gymTypesArray);

    const transformedResponse: GymTypesResponse = {
      Success: response.success,
      Message: response.message || '',
      Data: gymTypesArray,
      StatusCode: 200,
    };

    // eslint-disable-next-line no-console
    console.log('🔄 Transformed gymTypes response:', transformedResponse);

    return transformedResponse;
  }

  // Obtener países
  static async getCountries(): Promise<CountriesResponse> {
    // eslint-disable-next-line no-console
    console.log('🌍 Cargando países...');
    const response = await apiService.get<any>('/countries');
    // eslint-disable-next-line no-console
    console.log('📡 Raw countries response:', response);

    // El backend retorna un objeto con propiedades numeradas, convertir a array
    let countriesArray = [];
    if (response.data && typeof response.data === 'object') {
      // Si es un objeto con propiedades numeradas, convertir a array
      countriesArray = Object.values(response.data);
    } else if (Array.isArray(response.data)) {
      // Si ya es un array, usarlo directamente
      countriesArray = response.data;
    }

    const transformedResponse: CountriesResponse = {
      Success: response.success,
      Message: response.message || '',
      Data: countriesArray,
      StatusCode: 200,
    };

    return transformedResponse;
  }

  // Método helper para actualizar paso específico
  static async updateGymStep(
    gymId: string,
    stepData: Partial<GymCompleteData>
  ): Promise<GymUpdateResponse> {
    return this.updateGym(gymId, stepData);
  }
}
