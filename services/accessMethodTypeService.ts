// Servicio para AccessMethodType basado en las Azure Functions y DTOs del backend
import { apiService } from './apiService';

// Interfaces DTO (replicadas desde C#)
export interface AddAccessMethodTypeRequest {
  name: string;
}

export interface UpdateAccessMethodTypeRequest {
  id: string;
  name: string;
}

// Interface para búsqueda por campos (genérica)
export interface FindAccessMethodTypesByFieldsRequest {
  fields: { [key: string]: any };
}

export interface AccessMethodTypeBasicInfo {
  id: string;
  name: string;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Funciones del servicio
export const accessMethodTypeService = {
  async addAccessMethodType(
    request: AddAccessMethodTypeRequest
  ): Promise<ApiResponse<string>> {
    // POST /accessmethodtype/add (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<string>>(
      '/accessmethodtype/add',
      request
    );
    return response.data;
  },

  async getAccessMethodTypeById(id: string): Promise<ApiResponse<any>> {
    // GET /accessmethodtype/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<ApiResponse<any>>(
      `/accessmethodtype/${id}`
    );
    return response.data;
  },

  async updateAccessMethodType(
    request: UpdateAccessMethodTypeRequest
  ): Promise<ApiResponse<boolean>> {
    // PUT /accessmethodtype/update (según la ruta de la Azure Function)
    const response = await apiService.put<ApiResponse<boolean>>(
      '/accessmethodtype/update',
      request
    );
    return response.data;
  },

  async deleteAccessMethodType(id: string): Promise<ApiResponse<boolean>> {
    // DELETE /accessmethodtype/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<ApiResponse<boolean>>(
      `/accessmethodtype/${id}`
    );
    return response.data;
  },

  async getAllAccessMethodTypes(): Promise<ApiResponse<any[]>> {
    // GET /accessmethodtype (según la ruta de la Azure Function)
    const response =
      await apiService.get<ApiResponse<any[]>>('/accessmethodtype');
    return response.data;
  },

  async findAccessMethodTypesByFields(
    request: FindAccessMethodTypesByFieldsRequest
  ): Promise<ApiResponse<AccessMethodTypeBasicInfo[]>> {
    // POST /accessmethodtype/find (genérica para buscar por cualquier campo)
    const response = await apiService.post<
      ApiResponse<AccessMethodTypeBasicInfo[]>
    >('/accessmethodtype/find', request);
    return response.data;
  },
};
