// Auto-generated from C# class GymType. Do not edit manually.
import type { Gym } from './Gym';

export interface GymType {
  Id: string;
  Name: string;
  Description: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Gyms: Gym[];
}
