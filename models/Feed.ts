// Auto-generated from C# class Feed. Do not edit manually.
import type { User } from './User';

export interface Feed {
  Id: string;
  UserId: string;
  Title: string;
  Description: string | null;
  MediaUrl: string | null;
  MediaType: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  LikesCount?: number; // nuevo backend: contadores
  CommentsCount?: number;
  User: User;
}
