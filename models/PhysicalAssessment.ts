// Auto-generated from C# class PhysicalAssessment. Do not edit manually.
import type { User } from './User';

export interface PhysicalAssessment {
  Id: string;
  Height: string;
  Weight: string;
  LeftArm: string;
  RighArm: string;
  LeftForearm: string;
  RightForearm: string;
  LeftThigh: string;
  RightThigh: string;
  LeftCalf: string;
  RightCalf: string;
  Abdomen: string;
  Chest: string;
  UpperBack: string;
  LowerBack: string;
  Neck: string;
  Waist: string;
  Hips: string;
  Shoulders: string;
  Wrist: string;
  BodyFatPercentage: string;
  MuscleMass: string;
  Bmi: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  User: User;
}
