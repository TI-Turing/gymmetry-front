// Auto-generated from C# class MachineCategory. Do not edit manually.
import type { Machine } from './Machine';
import type { MachineCategoryType } from './MachineCategoryType';

export interface MachineCategory {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  MachineId: string;
  MachineCategoryTypeId: string;
  Machine: Machine;
  MachineCategoryType: MachineCategoryType;
}
