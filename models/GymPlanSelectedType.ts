// Auto-generated from C# class GymPlanSelectedType. Do not edit manually.
import type { GymPlanSelected } from './GymPlanSelected';

export interface GymPlanSelectedType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  CountryId: string | null;
  Price: number | null;
  UsdPrice: number | null;
  Description: string | null;
  GymPlanSelecteds: GymPlanSelected[];
}
