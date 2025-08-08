// Auto-generated from C# class LogLogin. Do not edit manually.
import type { User } from './User';

export interface LogLogin {
  Id: string;
  IsSuccess: boolean;
  RefreshToken: string | null;
  RefreshTokenExpiration: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  User: User;
}
