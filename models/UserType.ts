// Auto-generated from C# class UserType. Do not edit manually.
import type { Bill } from './Bill';
import type { Module } from './Module';
import type { Permission } from './Permission';
import type { User } from './User';

export interface UserType {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Bills: Bill[];
  Modules: Module[];
  Permissions: Permission[];
  Users: User[];
}
