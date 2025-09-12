// TODO: Eliminar si el backend ya exporta el DTO
import type { ProgressSummaryResponse } from './ProgressSummaryResponse';

// Basado en los logs reales: Data: { Periods: [...], History: [...] }
export interface MultiProgressHistoryResponse {
  Periods: ProgressSummaryResponse[]; // Array de análisis de períodos
  History: { Date: string; AdherencePct: number; Sessions: number }[]; // Historia resumida
  [key: string]: unknown;
}

// Tipo alias para compatibilidad
export type MultiProgressData = MultiProgressHistoryResponse;
