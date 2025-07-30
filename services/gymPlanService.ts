import { apiService, ApiResponse } from './apiService';

// Interfaces para los planes de gym
export interface GymPlanSelectedType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  ip: string | null;
  isActive: boolean;
  countryId: string;
  price: number | null;
  usdPrice: number | null;
  description: string;
  gymPlanSelecteds: any[];
}

export interface CreateGymPlanRequest {
  GymId: string;
  StartDate: string;
  EndDate: string;
  GymPlanSelectedTypeId: string;
}

export interface GymPlanSelected {
  id: string;
  gymId: string;
  gymPlanSelectedTypeId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  gymPlanSelectedType?: GymPlanSelectedType;
}

class GymPlanService {
  /**
   * Obtiene todos los tipos de planes disponibles para gimnasios
   */
  async getGymPlanTypes(): Promise<ApiResponse<GymPlanSelectedType[]>> {
    try {
      const response = await apiService.get<GymPlanSelectedType[]>(
        '/gymplanselectedtypes'
      );
      console.log('GymPlanTypes Response:', response);

      // Ahora el apiService devuelve directamente la estructura del backend
      return response;
    } catch {
      // En caso de error, devolver array vacío para evitar crashes
      return {
        success: false,
        message: 'Error al cargar tipos de planes',
        data: [],
        statusCode: 500,
      };
    }
  }

  /**
   * Obtiene el plan actual de un gimnasio específico
   */
  async getCurrentGymPlan(
    gymId: string
  ): Promise<ApiResponse<GymPlanSelected | null>> {
    try {
      // TODO: Implementar cuando el backend tenga este endpoint
      // const response = await apiService.get<GymPlanSelected>(`/gymplanselected/current/${gymId}`);

      // Mock temporal
      const mockResponse: ApiResponse<GymPlanSelected | null> = {
        success: true,
        message: '',
        data: null, // No hay plan activo actualmente
        statusCode: 200,
      };

      return mockResponse;
    } catch (error) {
      console.error('Error al obtener el plan actual del gym:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo plan para el gimnasio
   */
  async createGymPlan(
    planData: CreateGymPlanRequest
  ): Promise<ApiResponse<string>> {
    try {
      const response = await apiService.post<string>(
        '/gymplanselected/add',
        planData
      );
      return response;
    } catch (error) {
      console.error('Error al crear plan de gym:', error);
      throw error;
    }
  }

  /**
   * Genera las fechas de inicio y fin para un plan mensual
   */
  generatePlanDates(): { startDate: string; endDate: string } {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate() - 1,
      23,
      59,
      59
    );

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  }

  /**
   * Formatea el precio para mostrar
   */
  formatPrice(
    price: number | null,
    usdPrice: number | null,
    countryId: string = 'COP'
  ): string {
    if (price === null && usdPrice === null) {
      return 'Contactar';
    }

    if (countryId === 'COP' && price !== null) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(price);
    }

    if (usdPrice !== null) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(usdPrice);
    }

    return 'Precio no disponible';
  }
}

export const gymPlanService = new GymPlanService();
