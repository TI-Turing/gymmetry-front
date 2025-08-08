// Auto-generated from C# class Machine. Do not edit manually.
import type { Brand } from './Brand';
import type { Exercise } from './Exercise';
import type { MachineCategory } from './MachineCategory';

export interface Machine {
  Id: string;
  Name: string;
  Status: string;
  Observations: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  BrandId: string;
  Brand: Brand;
  MachineCategories: MachineCategory[];
  Exercises: Exercise[];
}
