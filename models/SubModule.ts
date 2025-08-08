// Auto-generated from C# class SubModule. Do not edit manually.
import type { Branch } from './Branch';
import type { LogError } from './LogError';
import type { Module } from './Module';

export interface SubModule {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  ModuleId: string;
  BranchId: string;
  Branch: Branch;
  LogErrors: LogError[];
  Module: Module;
}
