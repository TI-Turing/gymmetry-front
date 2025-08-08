// Auto-generated from C# class Brand. Do not edit manually.
import type { Machine } from './Machine';

export interface Brand {
  Id: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Machines: Machine[];
}
