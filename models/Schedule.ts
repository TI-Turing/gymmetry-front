// Auto-generated from C# class Schedule. Do not edit manually.
import type { Branch } from './Branch';
import type { User } from './User';

export interface Schedule {
  Id: string;
  StartDate: string;
  EndDate: string;
  IsHoliday: boolean;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  BranchId: string;
  Branch: Branch;
  Users: User[];
}
