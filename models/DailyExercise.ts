// Auto-generated from C# class DailyExercise. Do not edit manually.
import type { Daily } from './Daily';
import type { Exercise } from './Exercise';

export interface DailyExercise {
  Id: string;
  Set: string;
  Repetitions: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  DailyId: string;
  ExerciseId: string;
  Daily: Daily;
  Exercise: Exercise;
}
