// Auto-generated from C# class BranchServiceType. Do not edit manually.
import type { BranchService } from './BranchService';

export interface BranchServiceType {
  Id: string;
  Name: string;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  BranchServices: BranchService[];
}
