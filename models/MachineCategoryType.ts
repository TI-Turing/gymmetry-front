// Auto-generated from C# class MachineCategoryType. Do not edit manually.
import type { MachineCategory } from './MachineCategory';

export interface MachineCategoryType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  MachineCategories: MachineCategory[];
}
