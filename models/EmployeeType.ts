// Auto-generated from C# class EmployeeType. Do not edit manually.
import type { EmployeeUser } from './EmployeeUser';

export interface EmployeeType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  EmployeeUsers: EmployeeUser[];
}
