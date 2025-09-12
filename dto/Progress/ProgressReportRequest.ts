export interface ProgressReportRequest {
  UserId: string;
  StartDate: string; // yyyy-MM-dd
  EndDate: string; // yyyy-MM-dd inclusive
  Timezone?: string | null;
  IncludeAssessments?: boolean;
  ComparePreviousPeriod?: boolean;
  MinCompletionForAdherence?: number; // porcentaje mínimo
  TopExercises?: number; // límite ranking
}
