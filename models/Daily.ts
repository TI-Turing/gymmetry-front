// Auto-generated from C# class Daily. Do not edit manually.
import type { Branch } from './Branch';
import type { DailyExercise } from './DailyExercise';
import type { RoutineExercise } from './RoutineExercise';
import type { User } from './User';

export interface Daily {
  Id: string;
  StartDate: string;
  EndDate: string;
  Percentage: number;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  RoutineDayId: string;
  BranchId: string;
  Branche: Branch;
  DailyExercises: DailyExercise[];
  RoutineExercise: RoutineExercise;
  User: User;
}
