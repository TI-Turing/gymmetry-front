// Auto-generated from C# class RoutineAssigned. Do not edit manually.
import type { RoutineTemplate } from './RoutineTemplate';
import type { User } from './User';

export interface RoutineAssigned {
  Id: string;
  Comments: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  RoutineTemplate: RoutineTemplate;
  User: User;
}
