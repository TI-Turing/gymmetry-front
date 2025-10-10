/**
 * DTO para actualizar la configuración de anuncios
 */
export interface AdConfigRequestDto {
  /**
   * Cada cuántos posts se debe insertar un anuncio
   * Valores válidos: 3-10
   * @example 5
   */
  PostsPerAd: number;

  /**
   * Porcentaje de anuncios que deben ser de AdMob (0-100)
   * @example 60
   */
  AdMobPercentage: number;
}
