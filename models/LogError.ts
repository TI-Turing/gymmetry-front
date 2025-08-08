// Auto-generated from C# class LogError. Do not edit manually.
import type { SubModule } from './SubModule';
import type { User } from './User';

export interface LogError {
  Id: string;
  Error: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  SubModuleId: string;
  SubModule: SubModule;
  User: User;
}
