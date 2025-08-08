// Auto-generated from C# class EmployeeRegisterDaily. Do not edit manually.
import type { User } from './User';

export interface EmployeeRegisterDaily {
  Id: string;
  StartDate: string;
  EndDate: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Users: User[];
}
