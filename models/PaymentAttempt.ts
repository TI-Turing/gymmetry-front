// Auto-generated from C# class PaymentAttempt. Do not edit manually.
import type { Gym } from './Gym';
import type { GymPlanSelected } from './GymPlanSelected';
import type { PaymentAttemptStatus } from './PaymentAttemptStatus';
import type { Plan } from './Plan';
import type { User } from './User';

export interface PaymentAttempt {
  Id: string;
  UserId: string | null;
  Amount: number;
  Description: string;
  Gateway: string;
  ExternalPaymentId: string;
  CountryCode: string;
  GymId: string | null;
  PlanId: string | null;
  GymPlanSelectedId: string | null;
  StatusId: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  User: User;
  Gym: Gym;
  Plan: Plan;
  GymPlanSelected: GymPlanSelected;
  Status: PaymentAttemptStatus;
}
