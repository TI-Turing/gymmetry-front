// Auto-generated from C# class BranchService. Do not edit manually.
import type { Branch } from './Branch';
import type { BranchServiceType } from './BranchServiceType';

export interface BranchService {
  Id: string;
  BranchId: string;
  BranchServiceTypeId: string;
  Notes: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Branch: Branch;
  BranchServiceType: BranchServiceType;
}
