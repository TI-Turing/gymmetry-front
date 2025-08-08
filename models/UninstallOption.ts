// Auto-generated from C# class UninstallOption. Do not edit manually.
import type { LogUninstall } from './LogUninstall';

export interface UninstallOption {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  LogUninstalls: LogUninstall[];
}
