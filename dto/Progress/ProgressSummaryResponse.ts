export interface ProgressSummaryResponse {
  Period: PeriodInfo;
  Adherence: AdherenceBlock;
  Execution: ExecutionBlock;
  Time: TimeBlock;
  Exercises: ExerciseBlock;
  Objectives: ObjectiveBlock;
  Muscles: MuscleBlock;
  Comparison?: ComparisonBlock | null;
  Assessments?: AssessmentBlock | null;
  Discipline: DisciplineBlock;
  Suggestions: string[];
  GeneratedAt: string;
}

export interface PeriodInfo {
  From: string;
  To: string;
  Days: number;
}

export interface AdherenceBlock {
  TargetDays: number;
  Sessions: number;
  CompletedDays: number;
  AdherencePct: number;
  CurrentStreak: number;
  MaxStreak: number;
  ByWeekday: WeekdayBreakdown[];
  BranchAttendance: BranchUsage[];
}
export interface WeekdayBreakdown {
  Weekday: number;
  Done: number;
  Expected: number;
}
export interface BranchUsage {
  BranchId: string;
  Name: string;
  Visits: number;
  Percent: number;
}

export interface ExecutionBlock {
  AvgCompletion: number;
  StdevCompletion: number;
  BestSessions: SessionInfo[];
  LowCompletionSessions: SessionInfo[];
  Series: DailyPoint[];
}
export interface SessionInfo {
  DailyId: string;
  Date: string;
  Percentage: number;
  DurationMinutes: number;
}
export interface DailyPoint {
  Date: string;
  DurationMinutes: number;
  Percentage: number;
}

export interface TimeBlock {
  TotalMinutes: number;
  AvgPerSession: number;
  MinSession: number;
  MaxSession: number;
}

export interface ExerciseBlock {
  DistinctExercises: number;
  TopExercises: ExerciseFreq[];
  UnderusedExercises: ExerciseFreq[];
  TotalSeries: number;
  TotalReps: number;
  MissingPlanned: MissingPlannedItem[];
  NewExercises: ExerciseFreq[];
  PersonalRecords: PersonalRecordItem[];
}
export interface ExerciseFreq {
  ExerciseId: string;
  Name: string;
  Sessions: number;
  Series: number;
  Reps: number;
  PercentSessions: number;
}
export interface MissingPlannedItem {
  ExerciseId: string;
  Name: string;
  PlannedOccurrences: number;
  ExecutedOccurrences: number;
}

export interface ObjectiveBlock {
  Planned: Record<string, number>;
  Executed: Record<string, number>;
  Gaps: ObjectiveGap[];
}
export interface ObjectiveGap {
  Objective: string;
  Planned: number;
  Executed: number;
  Gap: number;
}

export interface MuscleBlock {
  Distribution: Record<string, number>;
  Dominant: string[];
  Underworked: string[];
  BalanceIndex: number;
  Alerts: string[];
}

export interface ComparisonBlock {
  FirstHalf: SimpleWindowStats;
  SecondHalf: SimpleWindowStats;
  Trend: string;
}
export interface SimpleWindowStats {
  AvgCompletion: number;
  Sessions: number;
  TotalMinutes: number;
  DistinctExercises: number;
}

export interface AssessmentBlock {
  Latest: Record<string, string | null>;
  Changes: AssessmentChange[];
}
export interface AssessmentChange {
  Field: string;
  OldValue?: string | null;
  NewValue?: string | null;
}

export interface DisciplineBlock {
  ConsistencyIndex: number;
  CommonStartHour?: string | null;
  ScheduleRegularity: number;
}

export interface PersonalRecordItem {
  ExerciseId: string;
  ExerciseName: string;
  WeightKg: number;
  AchievedAt: string;
}
