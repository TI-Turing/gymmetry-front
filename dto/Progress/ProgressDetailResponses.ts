import type {
  ExerciseFreq,
  ObjectiveGap,
  WeekdayBreakdown,
} from './ProgressSummaryResponse';

export interface ExercisesDetailResponse {
  From: string;
  To: string;
  DistinctExercises: number;
  Exercises: ExerciseFreq[];
  TotalSeries: number;
  TotalReps: number;
}

export interface ObjectivesDetailResponse {
  From: string;
  To: string;
  Planned: Record<string, number>;
  Executed: Record<string, number>;
  Gaps: ObjectiveGap[];
}

export interface MusclesDetailResponse {
  From: string;
  To: string;
  Distribution: Record<string, number>;
  Dominant: string[];
  Underworked: string[];
  BalanceIndex: number;
  Alerts: string[];
}

export interface SuggestionsResponse {
  From: string;
  To: string;
  Suggestions: string[];
}

export interface DisciplineDetailResponse {
  From: string;
  To: string;
  ConsistencyIndex: number;
  CommonStartHour?: string | null;
  ScheduleRegularity: number;
  Weekdays: WeekdayBreakdown[];
  CurrentStreak: number;
  MaxStreak: number;
  AdherencePct: number;
}
