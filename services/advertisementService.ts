import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type {
  AdvertisementResponseDto,
  AdConfigResponseDto,
} from '@/dto/Advertisement/Response/AdvertisementResponseDto';
import type {
  AdImpressionRequestDto,
  AdClickRequestDto,
} from '@/dto/Advertisement/Request/AdRequestDto';
import type { AdConfigRequestDto } from '@/dto/Advertisement/Request/AdConfigRequestDto';

/**
 * Servicio para gestionar anuncios en la aplicación
 *
 * Maneja:
 * - Obtención de anuncios activos
 * - Tracking de impresiones (visualizaciones)
 * - Tracking de clicks
 * - Configuración de frecuencia de anuncios
 */
export const advertisementService = {
  /**
   * Obtiene la lista de anuncios activos para mostrar en el feed
   *
   * @returns Promise con array de anuncios activos ordenados por prioridad
   *
   * @example
   * ```typescript
   * const resp = await advertisementService.getActiveAds();
   * if (resp?.Success && resp.Data) {
   *   const ads = resp.Data;
   *   console.log(`${ads.length} anuncios activos`);
   * }
   * ```
   */
  async getActiveAds(): Promise<
    ApiResponse<AdvertisementResponseDto[]> | undefined
  > {
    try {
      return await apiService.get<AdvertisementResponseDto[]>(
        '/advertisement/active'
      );
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Registra una impresión (visualización) de un anuncio
   *
   * Debe llamarse cuando:
   * - El anuncio ha estado visible en pantalla >= 1 segundo
   * - El usuario scrollea más allá del anuncio
   *
   * Validaciones:
   * - ViewDurationMs debe ser >= 1000
   * - Backend previene duplicados en <5min del mismo usuario
   *
   * @param dto Datos de la impresión
   * @returns Promise con true si se registró correctamente
   *
   * @example
   * ```typescript
   * const dto: AdImpressionRequestDto = {
   *   AdvertisementId: adId,
   *   ViewDurationMs: 3500, // 3.5 segundos
   * };
   *
   * const resp = await advertisementService.trackImpression(dto);
   * if (resp?.Success) {
   *   console.log('Impresión registrada');
   * }
   * ```
   */
  async trackImpression(
    dto: AdImpressionRequestDto
  ): Promise<ApiResponse<boolean> | undefined> {
    try {
      // Validación frontend
      if (dto.ViewDurationMs < 1000) {
        return {
          Success: false,
          Message: 'Duración muy corta',
          Data: false,
          StatusCode: 400,
        };
      }

      return await apiService.post<boolean>('/advertisement/impression', dto);
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Registra un click en un anuncio
   *
   * Debe llamarse inmediatamente cuando:
   * - El usuario toca el anuncio
   * - Antes de abrir la URL externa
   *
   * No hay restricción de duplicados (un usuario puede clickear múltiples veces)
   *
   * @param dto Datos del click
   * @returns Promise con true si se registró correctamente
   *
   * @example
   * ```typescript
   * const handleAdClick = async (adId: string) => {
   *   const dto: AdClickRequestDto = { AdvertisementId: adId };
   *
   *   const resp = await advertisementService.trackClick(dto);
   *   if (resp?.Success) {
   *     console.log('Click registrado');
   *     // Abrir URL externa
   *     await Linking.openURL(targetUrl);
   *   }
   * };
   * ```
   */
  async trackClick(
    dto: AdClickRequestDto
  ): Promise<ApiResponse<boolean> | undefined> {
    try {
      return await apiService.post<boolean>('/advertisement/click', dto);
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Obtiene la configuración de visualización de anuncios
   *
   * Configuración incluye:
   * - PostsPerAd: Cada cuántos posts mostrar un anuncio (ej: 5)
   * - AdMobPercentage: Ratio AdMob vs propios (ej: 60 = 60% AdMob, 40% propios)
   *
   * Esta configuración debe usarse en los hooks para determinar:
   * - Frecuencia de inserción de anuncios en el feed
   * - Cuándo mostrar AdMob vs anuncio propio
   *
   * @returns Promise con configuración de anuncios
   *
   * @example
   * ```typescript
   * const resp = await advertisementService.getConfig();
   * if (resp?.Success && resp.Data) {
   *   const { PostsPerAd, AdMobPercentage } = resp.Data;
   *   console.log(`Mostrar anuncio cada ${PostsPerAd} posts`);
   *   console.log(`${AdMobPercentage}% AdMob, ${100-AdMobPercentage}% propios`);
   * }
   * ```
   */
  async getConfig(): Promise<ApiResponse<AdConfigResponseDto> | undefined> {
    try {
      return await apiService.get<AdConfigResponseDto>('/advertisement/config');
    } catch (error) {
      // Retornar configuración por defecto si falla
      return {
        Success: true,
        Message: 'Configuración por defecto',
        Data: {
          PostsPerAd: 5,
          AdMobPercentage: 60,
        },
        StatusCode: 200,
      };
    }
  },

  /**
   * Actualiza la configuración de visualización de anuncios
   *
   * Permite ajustar dinámicamente:
   * - PostsPerAd: Frecuencia de anuncios (3-10 recomendado)
   * - AdMobPercentage: Ratio AdMob vs propios (0-100)
   *
   * Validaciones frontend:
   * - PostsPerAd debe estar entre 3 y 10
   * - AdMobPercentage debe estar entre 0 y 100
   *
   * Después de actualizar, se recomienda:
   * 1. Refetch de posts para aplicar nueva configuración
   * 2. Guardar en AsyncStorage para persistencia local
   *
   * @param dto Nueva configuración
   * @returns Promise con configuración actualizada
   *
   * @example
   * ```typescript
   * const newConfig: AdConfigRequestDto = {
   *   PostsPerAd: 7,
   *   AdMobPercentage: 70,
   * };
   *
   * const resp = await advertisementService.updateConfig(newConfig);
   * if (resp?.Success) {
   *   console.log('Configuración actualizada');
   *   // Guardar localmente
   *   await AsyncStorage.setItem('ad_config', JSON.stringify(newConfig));
   * }
   * ```
   */
  async updateConfig(
    dto: AdConfigRequestDto
  ): Promise<ApiResponse<AdConfigResponseDto> | undefined> {
    try {
      // Validaciones frontend
      if (dto.PostsPerAd < 3 || dto.PostsPerAd > 10) {
        return {
          Success: false,
          Message: 'PostsPerAd debe estar entre 3 y 10',
          Data: {} as AdConfigResponseDto,
          StatusCode: 400,
        };
      }

      if (dto.AdMobPercentage < 0 || dto.AdMobPercentage > 100) {
        return {
          Success: false,
          Message: 'AdMobPercentage debe estar entre 0 y 100',
          Data: {} as AdConfigResponseDto,
          StatusCode: 400,
        };
      }

      return await apiService.put<AdConfigResponseDto>(
        '/advertisement/config',
        dto
      );
    } catch (error) {
      return undefined;
    }
  },
};
