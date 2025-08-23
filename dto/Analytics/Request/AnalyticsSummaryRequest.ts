export interface AnalyticsSummaryRequest {
  /** GUID del usuario (Auth) */
  UserId: string;
  /** ISO date (YYYY-MM-DD) */
  StartDate: string;
  /** ISO date (YYYY-MM-DD) */
  EndDate: string;
  /** Zona horaria IANA opcional, p.ej. 'America/Bogota' */
  Timezone?: string;
}
