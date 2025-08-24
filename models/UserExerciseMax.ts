// Auto-generated from C# class UserExerciseMax. Do not edit manually.
import type { User } from './User';
import type { Exercise } from './Exercise';

export interface UserExerciseMax {
  Id: string;
  UserId: string;
  ExerciseId: string;
  WeightKg: string; // backend decimal; usamos string para consistencia
  AchievedAt: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  User?: User;
  Exercise?: Exercise;
}
