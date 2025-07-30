// Servicio para Plan (suscripciones de usuarios)
import { apiService } from './apiService';

// Interfaces DTO (replicadas desde C#)
export interface Plan {
  id: string;
  startDate: string;
  endDate: string;
  planTypeId: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  planType?: any; // Se puede expandir con la interfaz PlanType
  user?: any; // Se puede expandir con la interfaz User
}

export interface CreatePlanRequest {
  startDate: string;
  endDate: string;
  planTypeId: string;
  userId: string;
}

export interface UpdatePlanRequest {
  id: string;
  startDate?: string;
  endDate?: string;
  planTypeId?: string;
  userId?: string;
  isActive?: boolean;
}

export interface FindPlansByFieldsRequest {
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
export const planService = {
  // Crear un nuevo plan para un usuario
  async addPlan(request: CreatePlanRequest): Promise<ApiResponse<string>> {
    const response = await apiService.post<string>('/plan/add', request);
    return response;
  },

  // Obtener un plan por ID
  async getPlanById(id: string): Promise<ApiResponse<Plan>> {
    const response = await apiService.get<Plan>(`/plan/${id}`);
    return response;
  },

  // Actualizar un plan
  async updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<boolean>> {
    const response = await apiService.put<boolean>('/plan/update', request);
    return response;
  },

  // Eliminar un plan
  async deletePlan(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.delete<boolean>(`/plan/${id}`);
    return response;
  },

  // Buscar planes por campos específicos
  async findPlansByFields(
    request: FindPlansByFieldsRequest
  ): Promise<ApiResponse<Plan[]>> {
    const response = await apiService.post<Plan[]>(
      '/plan/findbyfields',
      request
    );
    return response;
  },

  // Obtener planes activos de un usuario
  async getUserActivePlans(userId: string): Promise<ApiResponse<Plan[]>> {
    const response = await apiService.get<Plan[]>(
      `/plan/user/${userId}/active`
    );
    return response;
  },

  // Obtener todos los planes de un usuario
  async getUserPlans(userId: string): Promise<ApiResponse<Plan[]>> {
    const response = await apiService.get<Plan[]>(`/plan/user/${userId}`);
    return response;
  },

  // Obtener el plan actual del usuario (el más reciente activo)
  async getCurrentUserPlan(userId: string): Promise<ApiResponse<Plan>> {
    const response = await apiService.get<Plan>(`/plan/user/${userId}/current`);
    return response;
  },

  // Cancelar un plan (marcar como inactivo)
  async cancelPlan(planId: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.put<boolean>(
      `/plan/${planId}/cancel`,
      {}
    );
    return response;
  },

  // Renovar un plan (extender fecha de finalización)
  async renewPlan(
    planId: string,
    newEndDate: string
  ): Promise<ApiResponse<boolean>> {
    const response = await apiService.put<boolean>(`/plan/${planId}/renew`, {
      endDate: newEndDate,
    });
    return response;
  },
};

export default planService;
