// Auto-generated from C# class EmployeeUser. Do not edit manually.
import type { EmployeeType } from './EmployeeType';
import type { JourneyEmployee } from './JourneyEmployee';
import type { User } from './User';

export interface EmployeeUser {
  Id: string;
  Arl: string;
  PensionFund: string;
  StartContract: string;
  EndContract: string | null;
  BankId: string;
  AccountType: string;
  AccountNumber: string;
  Salary: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  EmployeeTypeId: string;
  EmployeeType: EmployeeType;
  JourneyEmployees: JourneyEmployee[];
  Users: User[];
}
