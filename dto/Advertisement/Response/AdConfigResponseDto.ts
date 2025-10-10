/**
 * DTO para la configuración de anuncios
 * Controla la frecuencia y el ratio de mezcla de anuncios
 */
export interface AdConfigResponseDto {
  /**
   * Cada cuántos posts se debe insertar un anuncio
   * @example 5 (un anuncio cada 5 posts)
   */
  PostsPerAd: number;

  /**
   * Porcentaje de anuncios que deben ser de AdMob (0-100)
   * El resto serán anuncios propios
   * @example 60 (60% AdMob, 40% propios)
   */
  AdMobPercentage: number;

  /**
   * Fecha de última actualización de la configuración
   */
  UpdatedAt?: string;

  /**
   * Usuario que actualizó la configuración
   */
  UpdatedBy?: string;
}
