// Auto-generated from C# class BranchMedia. Do not edit manually.
import type { Branch } from './Branch';

export interface BranchMedia {
  Id: string;
  BranchId: string;
  Url: string;
  MediaType: string;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Branch: Branch;
}
