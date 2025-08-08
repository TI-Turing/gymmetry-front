// Auto-generated from C# class CategoryExercise. Do not edit manually.
import type { Exercise } from './Exercise';

export interface CategoryExercise {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Exercises: Exercise[];
}
