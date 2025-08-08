// Auto-generated from C# class Notification. Do not edit manually.
import type { NotificationOption } from './NotificationOption';
import type { User } from './User';

export interface Notification {
  Id: string;
  Title: string;
  Body: string;
  Option1: string | null;
  Option2: string | null;
  Urloption1: string | null;
  Urloption2: string | null;
  ImageUrl: string | null;
  Seen: boolean;
  Opened: boolean;
  ShowDate: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  NotificationOptions: NotificationOption[];
  User: User;
}
