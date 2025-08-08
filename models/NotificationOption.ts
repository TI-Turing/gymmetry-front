// Auto-generated from C# class NotificationOption. Do not edit manually.
import type { Notification } from './Notification';
import type { User } from './User';

export interface NotificationOption {
  Id: string;
  Mail: string;
  Push: string;
  App: string;
  WhatsaApp: string;
  Sms: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  UserId: string;
  NotificationOptionNotificationNotificationOptionId: string;
  NotificationOptionNotificationNotificationOption: Notification;
  User: User;
}
