// Auto-generated from C# class DailyHistory. Do not edit manually.
import type { Branch } from './Branch';
import type { DailyExerciseHistory } from './DailyExerciseHistory';
import type { RoutineExercise } from './RoutineExercise';
import type { User } from './User';

export interface DailyHistory {
  Id: string;
  StartDate: string;
  EndDate: string;
  Percentage?: number; // nuevo en backend
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  BranchId: string;
  RoutineExerciseId: string;
  Branch: Branch;
  DailyExerciseHistories: DailyExerciseHistory[];
  RoutineExercise: RoutineExercise;
  User: User;
}
