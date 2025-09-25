// DTOs para el endpoint agregador app-state/overview
import type { Gym } from '@/models/Gym';
import type { User } from '@/models/User';
import type { Feed } from '@/models/Feed';
import type { PhysicalAssessment } from '@/models/PhysicalAssessment';
import type { Branch } from '@/models/Branch';

export interface AppStateOverviewResponse {
  Home: HomeStateDto;
  Gym: GymStateDto;
  Progress: ProgressStateDto;
  Feed: FeedStateDto;
  Profile: ProfileStateDto;
  LastUpdated: string;
}

export interface HomeStateDto {
  Discipline: DisciplineDataDto;
  PlanInfo: PlanInfoDto;
  TodayRoutine: TodayRoutineDto;
  DetailedProgress: DetailedProgressDto;
}

export interface GymStateDto {
  GymData: Gym | null;
  IsConnectedToGym: boolean;
  GymId: string;
  AvailableBranches?: Branch[];
}

export interface ProgressStateDto {
  Summary: ProgressSummaryDto;
  DefaultPeriod: string;
}

export interface FeedStateDto {
  RecentFeeds: Feed[];
  TrendingFeeds: Feed[];
  TotalFeedCount: number;
}

export interface ProfileStateDto {
  UserProfile: User;
  LatestAssessment: PhysicalAssessment | null;
  Stats: ProfileStatsDto;
}

// DTOs específicos para datos calculados/agregados
export interface DisciplineDataDto {
  CompletionPercentage: number;
  CompletedDays: number;
  TotalExpectedDays: number;
  CurrentStreak: number;
  ConsistencyIndex: number;
  PeriodDescription: string;
}

export interface PlanInfoDto {
  PlanId: string;
  PlanTypeName: string;
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  ProgressPercentage: number;
  DaysRemaining: number;
}

export interface TodayRoutineDto {
  HasTrainedToday: boolean;
  TodayRoutineDayId: string;
  RoutineName: string;
  EstimatedDurationMinutes: number;
  TodayExercises: string[];
  LastWorkout?: string;
}

export interface DetailedProgressDto {
  TotalWorkouts: number;
  TotalMinutes: number;
  AvgWorkoutMinutes: number;
  AvgCompletionRate: number;
  RecentWorkouts: RecentWorkoutDto[];
}

export interface RecentWorkoutDto {
  Date: string;
  DurationMinutes: number;
  CompletionRate: number;
  RoutineName?: string;
}

export interface ProgressSummaryDto {
  AdherencePercentage: number;
  WorkoutsSummary: number;
  TotalMinutes: number;
  MuscleDistribution: Record<string, number>;
  DominantMuscles: string[];
  UnderworkedMuscles: string[];
  BalanceIndex: number;
}

export interface ProfileStatsDto {
  TotalWorkouts: number;
  CurrentStreak: number;
  TotalDays: number;
  MemberSince: string;
  CurrentWeight?: string;
  CurrentHeight?: string;
  LastAssessment?: string;
}
