// Auto-generated from C# class RoutineDay. Do not edit manually.
import type { Exercise } from './Exercise';
import type { RoutineTemplate } from './RoutineTemplate';

export interface RoutineDay {
  Id: string;
  DayNumber: number;
  Name: string;
  Sets: number;
  Repetitions: string;
  Notes: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  RoutineTemplateId: string;
  ExerciseId: string | null;
  RoutineTemplate: RoutineTemplate;
  Exercise: Exercise | null;
}
