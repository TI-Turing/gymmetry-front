// Auto-generated from C# class Diet. Do not edit manually.
import type { User } from './User';

export interface Diet {
  Id: string;
  BreakFast: string;
  MidMorning: string;
  Lunch: string;
  MidAfternoon: string;
  Night: string;
  MidNight: string;
  Observations: string | null;
  StartDate: string;
  EndDate: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  User: User;
  Users: User[];
}
