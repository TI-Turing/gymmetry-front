// Auto-generated from C# class Permission. Do not edit manually.
import type { User } from './User';
import type { UserType } from './UserType';

export interface Permission {
  Id: string;
  See: string;
  Create: string;
  Read: string;
  Update: string;
  Delete: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserTypeId: string;
  UserId: string;
  User: User;
  UserType: UserType;
}
