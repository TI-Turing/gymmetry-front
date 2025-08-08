// Auto-generated from C# class GymPlanSelected. Do not edit manually.
import type { GymPlanSelectedModule } from './GymPlanSelectedModule';
import type { GymPlanSelectedType } from './GymPlanSelectedType';
import type { PaymentAttempt } from './PaymentAttempt';

export interface GymPlanSelected {
  Id: string;
  StartDate: string;
  EndDate: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  GymPlanSelectedTypeId: string;
  GymId: string | null;
  GymPlanSelectedModules: GymPlanSelectedModule[];
  GymPlanSelectedType: GymPlanSelectedType;
  PaymentAttempt: PaymentAttempt | null;
}
