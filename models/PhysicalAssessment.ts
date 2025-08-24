// Auto-generated from C# class PhysicalAssessment. Do not edit manually.
import type { User } from './User';

export interface PhysicalAssessment {
  Id: string;
  Height: string | null;
  Weight: string | null;
  LeftArm: string | null;
  RighArm: string | null;
  LeftForearm: string | null;
  RightForearm: string | null;
  LeftThigh: string | null;
  RightThigh: string | null;
  LeftCalf: string | null;
  RightCalf: string | null;
  Abdomen: string | null;
  Chest: string | null;
  UpperBack: string | null;
  LowerBack: string | null;
  Neck: string | null;
  Waist: string | null;
  Hips: string | null;
  Shoulders: string | null;
  Wrist: string | null;
  BodyFatPercentage: string | null;
  MuscleMass: string | null;
  Bmi: string | null;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean | null;
  UserId: string;
  User: User;
}
