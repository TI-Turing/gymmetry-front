// Auto-generated from C# class Branch. Do not edit manually.
import type { AccessMethodType } from './AccessMethodType';
import type { DailyHistory } from './DailyHistory';
import type { Gym } from './Gym';
import type { Schedule } from './Schedule';
import type { SubModule } from './SubModule';

export interface Branch {
  Id: string;
  Address: string;
  CityId: string;
  RegionId: string;
  GymId: string;
  AccessMethodId: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Name: string;
  PhoneNumber: string | null;
  Email: string | null;
  OpeningHours: string | null;
  Manager_UserId: string | null;
  ManagerPhone: string | null;
  Capacity: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Notes: string | null;
  ParkingInfo: string | null;
  WifiAvailable: boolean;
  AccessMethod: AccessMethodType;
  DailyHistories: DailyHistory[];
  Gym: Gym;
  Schedules: Schedule[];
  SubModules: SubModule[];
}
