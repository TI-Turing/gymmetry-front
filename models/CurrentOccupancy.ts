// Auto-generated from C# class CurrentOccupancy. Do not edit manually.
import type { Branch } from './Branch';

export interface CurrentOccupancy {
  Id: string;
  BranchId: string;
  Occupancy: number;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Branch: Branch;
}
