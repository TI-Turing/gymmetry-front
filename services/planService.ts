// Servicio para Plan (suscripciones de usuarios)
import { apiService, ApiResponse } from './apiService';
import { Plan } from '@/dto/plan/Plan';
import { CreatePlanRequest } from '@/dto/plan/CreatePlanRequest';
import { UpdatePlanRequest } from '@/dto/plan/UpdatePlanRequest';
import { FindPlansByFieldsRequest } from '@/dto/plan/FindPlansByFieldsRequest';

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
