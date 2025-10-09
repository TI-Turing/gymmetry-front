import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AppStateOverviewResponse } from '@/dto/appState/AppStateOverviewResponse';
import { logger } from '@/utils';

const base = '/app-state';

export const appStateService = {
  /**
   * Obtiene el estado consolidado de la aplicación para todas las pantallas principales
   */
  async getOverview(): Promise<ApiResponse<AppStateOverviewResponse>> {
    try {
      const response = await apiService.get<AppStateOverviewResponse>(
        `${base}/overview`
      );

      return response;
    } catch (error) {
      logger.error('Error fetching app state overview:', error);
      throw error;
    }
  },

  /**
   * Refresca una sección específica del estado de la aplicación
   * Para futuras implementaciones cuando el backend soporte refrescos parciales
   */
  async refreshSection(
    section: 'home' | 'gym' | 'progress' | 'feed' | 'profile'
  ): Promise<ApiResponse<AppStateOverviewResponse>> {
    // Por ahora, refrescar toda la aplicación
    // En futuras versiones el backend podría soportir refrescos parciales
    logger.debug(`Refreshing section: ${section}`);
    return this.getOverview();
  },
};
