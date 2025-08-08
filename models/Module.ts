// Auto-generated from C# class Module. Do not edit manually.
import type { GymPlanSelectedModule } from './GymPlanSelectedModule';
import type { SubModule } from './SubModule';
import type { UserType } from './UserType';

export interface Module {
  Id: string;
  Name: string;
  Url: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserTypeId: string;
  GymPlanSelectedModuleModuleModuleId: string;
  GymPlanSelectedModuleModuleModule: GymPlanSelectedModule;
  SubModules: SubModule[];
  UserType: UserType;
}
