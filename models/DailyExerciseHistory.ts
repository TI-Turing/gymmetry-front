// Auto-generated from C# class DailyExerciseHistory. Do not edit manually.
import type { DailyHistory } from './DailyHistory';
import type { Exercise } from './Exercise';

export interface DailyExerciseHistory {
  Id: string;
  Set: string;
  Repetitions: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  DailyHistoryId: string;
  DailyHistory: DailyHistory;
  Exercises: Exercise[];
}
