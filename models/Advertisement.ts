/**
 * Modelo de Anuncio
 *
 * Representa un anuncio de sponsor que se muestra en el feed de la app.
 * Los anuncios pueden tener fechas de inicio y fin, prioridad de visualización
 * y métricas de rendimiento (impresiones y clicks).
 */
export interface Advertisement {
  /**
   * ID único del anuncio (GUID)
   */
  Id: string;

  /**
   * Título del anuncio
   * @maxLength 200
   */
  Title: string;

  /**
   * Descripción o contenido del anuncio
   * @maxLength 500
   */
  Description: string;

  /**
   * URL de la imagen del anuncio (Azure Blob Storage)
   */
  ImageUrl: string;

  /**
   * Texto del botón de Call-to-Action
   * @example "Comprar ahora", "Ver más", "Registrarme"
   * @maxLength 50
   */
  CtaText: string;

  /**
   * URL externa que se abre al hacer click en el anuncio
   */
  TargetUrl: string;

  /**
   * Indica si el anuncio está activo
   * @default true
   */
  IsActive: boolean;

  /**
   * Fecha de inicio de visualización del anuncio
   */
  StartDate: string; // ISO 8601 string

  /**
   * Fecha de fin de visualización del anuncio (opcional)
   * null = sin fecha límite
   */
  EndDate?: string | null; // ISO 8601 string

  /**
   * Prioridad de visualización (mayor = más prioritario)
   * @default 0
   */
  DisplayPriority: number;

  /**
   * Criterios de targeting (JSON serializado)
   * @example { "minAge": 18, "interests": ["fitness", "nutrition"] }
   */
  TargetAudience?: string | null;

  /**
   * Contador total de impresiones (visualizaciones)
   */
  TotalImpressions: number;

  /**
   * Contador total de clicks
   */
  TotalClicks: number;

  /**
   * Fecha de creación del anuncio
   */
  CreatedAt: string; // ISO 8601 string

  /**
   * Fecha de última actualización
   */
  UpdatedAt?: string | null; // ISO 8601 string

  /**
   * Indica si el anuncio fue eliminado (soft delete)
   */
  IsDeleted: boolean;

  /**
   * CTR (Click-Through Rate) calculado
   * @computed
   */
  ctr?: number;
}

/**
 * Registro de impresión de anuncio
 */
export interface AdImpression {
  Id: string;
  AdvertisementId: string;
  UserId: string;
  ViewedAt: string; // ISO 8601 string
  ViewDurationMs: number;
}

/**
 * Registro de click en anuncio
 */
export interface AdClick {
  Id: string;
  AdvertisementId: string;
  UserId: string;
  ClickedAt: string; // ISO 8601 string
}
