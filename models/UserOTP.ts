// Auto-generated from C# class UserOTP. Do not edit manually.
import type { User } from './User';
import type { VerificationType } from './VerificationType';

export interface UserOTP {
  Id: string;
  OTP: string;
  Method: string;
  IsVerified: boolean;
  VerificationTypeId: string;
  UserId: string;
  Ip: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  IsActive: boolean;
  Recipient: string | null;
  User: User;
  VerificationType: VerificationType;
}
