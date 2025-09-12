// TODO: Eliminar si el backend ya exporta el DTO
export interface MultiProgressReportRequest {
  UserId: string;
  Periods: { From: string; To: string; Days?: number }[];
  IncludeHistory?: boolean;
  Timezone?: string;
}
