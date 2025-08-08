// Auto-generated from C# class LogUninstall. Do not edit manually.
import type { UninstallOption } from './UninstallOption';
import type { User } from './User';

export interface LogUninstall {
  Id: string;
  Comments: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  UnnistallOptionsId: string;
  UnnistallOptions: UninstallOption;
  User: User;
}
