// Auto-generated from C# class AccessMethodType. Do not edit manually.
import type { Branch } from './Branch';

export interface AccessMethodType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  Description: string | null;
  IsActive: boolean;
  Branches: Branch[];
}
