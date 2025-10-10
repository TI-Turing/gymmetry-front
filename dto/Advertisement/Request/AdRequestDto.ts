/**
 * DTO para registrar una impresión (visualización) de anuncio
 *
 * Enviado a POST /api/advertisement/impression
 */
export interface AdImpressionRequestDto {
  /**
   * ID del anuncio visualizado
   */
  AdvertisementId: string;

  /**
   * Duración de la visualización en milisegundos
   * Debe ser >= 1000 (mínimo 1 segundo)
   */
  ViewDurationMs: number;
}

/**
 * DTO para registrar un click en anuncio
 *
 * Enviado a POST /api/advertisement/click
 */
export interface AdClickRequestDto {
  /**
   * ID del anuncio clickeado
   */
  AdvertisementId: string;
}
