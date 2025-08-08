// Auto-generated from C# class RoutineExercise. Do not edit manually.
import type { Daily } from './Daily';
import type { DailyHistory } from './DailyHistory';
import type { Exercise } from './Exercise';
import type { RoutineTemplate } from './RoutineTemplate';

export interface RoutineExercise {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Sets: string;
  Repetitions: string;
  RoutineTemplateId: string;
  ExerciseId: string;
  Dailies: Daily[];
  DailyHistories: DailyHistory[];
  Exercise: Exercise;
  RoutineTemplate: RoutineTemplate;
}
