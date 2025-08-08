// Auto-generated from C# class PlanType. Do not edit manually.
import type { Plan } from './Plan';

export interface PlanType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Price: number | null;
  UsdPrice: number | null;
  Description: string | null;
  Plans: Plan[];
}
