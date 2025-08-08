// Auto-generated from C# class FitUser. Do not edit manually.
import type { User } from './User';

export interface FitUser {
  Id: string;
  Goal: string;
  ExperienceLevel: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Users: User[];
}
