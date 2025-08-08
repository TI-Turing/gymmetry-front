// Auto-generated from C# class Bill. Do not edit manually.
import type { Gym } from './Gym';
import type { User } from './User';
import type { UserType } from './UserType';

export interface Bill {
  Id: string;
  Ammount: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserTypeId: string;
  UserId: string;
  UserSellerId: string;
  GymId: string;
  Gym: Gym;
  User: User;
  UserSeller: User;
  UserType: UserType;
}
