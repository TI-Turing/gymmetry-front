// Servicio para PlanType
import { apiService } from './apiService';

// Interfaces DTO (replicadas desde C#)
export interface PlanType {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreatePlanTypeRequest {
  name: string;
  description: string;
  price: number;
  features: string[];
  isActive?: boolean;
}

export interface UpdatePlanTypeRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  isActive?: boolean;
}

export interface FindPlanTypesByFieldsRequest {
  fields: { [key: string]: any };
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Servicio principal
export const planTypeService = {
  // Crear un nuevo tipo de plan
  async addPlanType(
    request: CreatePlanTypeRequest
  ): Promise<ApiResponse<string>> {
    const response = await apiService.post<ApiResponse<string>>(
      '/plantype/add',
      request
    );
    return response.data;
  },

  // Obtener un tipo de plan por ID
  async getPlanTypeById(id: string): Promise<ApiResponse<PlanType>> {
    const response = await apiService.get<ApiResponse<PlanType>>(
      `/plantype/${id}`
    );
    return response.data;
  },

  // Actualizar un tipo de plan
  async updatePlanType(
    request: UpdatePlanTypeRequest
  ): Promise<ApiResponse<boolean>> {
    const response = await apiService.put<ApiResponse<boolean>>(
      '/plantype/update',
      request
    );
    return response.data;
  },

  // Eliminar un tipo de plan
  async deletePlanType(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.delete<ApiResponse<boolean>>(
      `/plantype/${id}`
    );
    return response.data;
  },

  // Buscar tipos de plan por campos específicos
  async findPlanTypesByFields(
    request: FindPlanTypesByFieldsRequest
  ): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.post<ApiResponse<PlanType[]>>(
      '/plantype/findbyfields',
      request
    );
    return response.data;
  },

  // Obtener todos los tipos de plan activos
  async getAllActivePlanTypes(): Promise<ApiResponse<PlanType[]>> {
    const response =
      await apiService.get<ApiResponse<PlanType[]>>('/plantype/active');
    return response.data;
  },

  // Obtener todos los tipos de plan
  async getAllPlanTypes(): Promise<ApiResponse<PlanType[]>> {
    const response =
      await apiService.get<ApiResponse<PlanType[]>>('/plantype/all');
    return response.data;
  },
};

export default planTypeService;
