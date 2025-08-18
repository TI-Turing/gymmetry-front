// Auto-generated from C# class RoutineTemplate. Do not edit manually.
import type { Gym } from './Gym';
import type { RoutineAssigned } from './RoutineAssigned';
import type { RoutineDay } from './RoutineDay';
import type { RoutineExercise } from './RoutineExercise';
import type { User } from './User';

export interface RoutineTemplate {
  Id: string;
  Name: string;
  Comments: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Premium: boolean;
  GymId: string | null;
  RoutineUserRoutineId: string | null;
  RoutineAssignedId: string | null;
  IsDefault: boolean;
  TagsObjectives: string | null;
  TagsMachines: string | null;
  IsBodyweight: boolean;
  RequiresEquipment: boolean;
  IsCalisthenic: boolean;
  Author_UserId: string | null;
  AuthorUser: User | null;
  Gym: Gym;
  RoutineAssigned: RoutineAssigned;
  RoutineDays: RoutineDay[];
  RoutineExercises: RoutineExercise[];
  RoutineUserRoutine: User;
}
