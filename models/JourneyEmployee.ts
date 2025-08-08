// Auto-generated from C# class JourneyEmployee. Do not edit manually.
import type { EmployeeUser } from './EmployeeUser';

export interface JourneyEmployee {
  Id: string;
  Name: string;
  StartHour: string;
  EndHour: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  EmployeeUserId: string;
  EmployeeUser: EmployeeUser;
}
