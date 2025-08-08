// Auto-generated from C# class LogChange. Do not edit manually.
import type { User } from './User';

export interface LogChange {
  Id: string;
  Table: string;
  PastObject: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  InvocationId: string | null;
  User: User;
}
