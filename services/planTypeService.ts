// Servicio para PlanType
import { apiService, ApiResponse } from './apiService';
import { PlanType } from '@/dto/planType/PlanType';
import { CreatePlanTypeRequest } from '@/dto/planType/CreatePlanTypeRequest';
import { UpdatePlanTypeRequest } from '@/dto/planType/UpdatePlanTypeRequest';
import { FindPlanTypesByFieldsRequest } from '@/dto/planType/FindPlanTypesByFieldsRequest';

// Servicio principal
export const planTypeService = {
  // Crear un nuevo tipo de plan
  async addPlanType(
    request: CreatePlanTypeRequest
  ): Promise<ApiResponse<string>> {
    const response = await apiService.post<string>('/plantype/add', request);
    return response;
  },

  // Obtener un tipo de plan por ID
  async getPlanTypeById(id: string): Promise<ApiResponse<PlanType>> {
    const response = await apiService.get<PlanType>(`/plantype/${id}`);
    return response;
  },

  // Actualizar un tipo de plan
  async updatePlanType(
    request: UpdatePlanTypeRequest
  ): Promise<ApiResponse<boolean>> {
    const response = await apiService.put<boolean>('/plantype/update', request);
    return response;
  },

  // Eliminar un tipo de plan
  async deletePlanType(id: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.delete<boolean>(`/plantype/${id}`);
    return response;
  },

  // Buscar tipos de plan por campos específicos
  async findPlanTypesByFields(
    request: FindPlanTypesByFieldsRequest
  ): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.post<PlanType[]>(
      '/plantype/findbyfields',
      request
    );
    return response;
  },

  // Obtener todos los tipos de plan activos
  async getAllActivePlanTypes(): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.get<PlanType[]>('/plantype/active');
    return response;
  },

  // Obtener todos los tipos de plan
  async getAllPlanTypes(): Promise<ApiResponse<PlanType[]>> {
    const response = await apiService.get<PlanType[]>('/plantypes');
    return response;
  },
};

export default planTypeService;
