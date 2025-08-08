// Auto-generated from C# class GymPlanSelectedModule. Do not edit manually.
import type { GymPlanSelected } from './GymPlanSelected';
import type { Module } from './Module';

export interface GymPlanSelectedModule {
  Id: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  GymPlanSelectedId: string;
  GymPlanSelected: GymPlanSelected;
  Modules: Module[];
}
