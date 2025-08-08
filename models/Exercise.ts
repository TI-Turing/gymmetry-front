// Auto-generated from C# class Exercise. Do not edit manually.
import type { CategoryExercise } from './CategoryExercise';
import type { DailyExercise } from './DailyExercise';
import type { Machine } from './Machine';
import type { RoutineDay } from './RoutineDay';
import type { RoutineExercise } from './RoutineExercise';

export interface Exercise {
  Id: string;
  Name: string;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  CategoryExerciseId: string;
  TagsObjectives: string | null;
  RequiresEquipment: boolean;
  UrlImage: string | null;
  MachineId: string | null;
  CategoryExercise: CategoryExercise;
  DailyExercises: DailyExercise[];
  RoutineExercises: RoutineExercise[];
  Machine: Machine | null;
  RoutineDays: RoutineDay[];
}
