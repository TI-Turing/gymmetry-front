export interface RoutineUsageItem {
  RoutineTemplateId: string;
  RoutineTemplateName: string;
  /** cantidad de días del rango en los que se trabajó esta rutina */
  DaysUsed: number;
  /** total de días del rango en los que estaba asignada */
  DaysAssigned?: number | null;
  /** porcentaje de uso sobre los días del rango: DaysUsed / (DaysAssigned||totalDays) */
  UsagePercent: number;
}

export interface WeekdayDisciplineItem {
  Weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Domingo
  DaysTrained: number;
}

export interface BranchAttendanceItem {
  BranchId: string;
  BranchName: string;
  Visits: number;
  /** porcentaje respecto al total de visitas */
  Percent: number;
}

export interface AnalyticsSummaryResponse {
  // Totales del periodo
  TotalWorkouts: number;
  TotalCalories: number;
  TotalDurationMinutes: number;
  /** Promedio por sesión */
  AvgDurationMinutes: number;

  /** Días avanzados (Daily con % avance > 0) en el rango */
  DaysAdvanced: number;
  /** Días que debía avanzar (días asignados/planificados en el rango) */
  DaysExpected: number;

  // Rachas
  CurrentStreakDays: number;
  LongestStreakDays: number;

  // Peso (mock si no existe en back todavía)
  CurrentWeightKg?: number | null;
  WeightChangeKg?: number | null;

  // Uso de rutinas
  RoutineUsage: RoutineUsageItem[];

  // Días de la semana con mayor disciplina
  WeekdayDiscipline: WeekdayDisciplineItem[];

  // Sedes más visitadas
  BranchAttendance: BranchAttendanceItem[];
}
