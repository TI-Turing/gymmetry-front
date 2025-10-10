/**
 * DTO de respuesta para anuncios activos
 *
 * Versión simplificada del modelo Advertisement que se retorna
 * desde el endpoint GET /api/advertisement/active
 */
export interface AdvertisementResponseDto {
  /**
   * ID único del anuncio
   */
  Id: string;

  /**
   * Título del anuncio
   */
  Title: string;

  /**
   * Descripción del anuncio
   */
  Description: string;

  /**
   * URL de la imagen
   */
  ImageUrl: string;

  /**
   * Texto del botón CTA
   */
  CtaText: string;

  /**
   * URL de destino al hacer click
   */
  TargetUrl: string;

  /**
   * Prioridad de visualización
   */
  DisplayPriority: number;
}

/**
 * DTO de configuración de anuncios
 *
 * Retornado por GET /api/advertisement/config
 */
export interface AdConfigResponseDto {
  /**
   * Cada cuántos posts se debe mostrar un anuncio
   * @example 5 significa 1 anuncio cada 5 posts
   */
  PostsPerAd: number;

  /**
   * Porcentaje de anuncios que deben ser AdMob vs propios
   * @example 60 significa 60% AdMob, 40% propios
   * @min 0
   * @max 100
   */
  AdMobPercentage: number;
}
