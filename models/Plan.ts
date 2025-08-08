// Auto-generated from C# class Plan. Do not edit manually.
import type { PaymentAttempt } from './PaymentAttempt';
import type { PlanType } from './PlanType';
import type { User } from './User';

export interface Plan {
  Id: string;
  StartDate: string;
  EndDate: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  PlanTypeId: string;
  User: User;
  PlanType: PlanType;
  PaymentAttempt: PaymentAttempt | null;
}
