// Auto-generated from C# class Comment. Do not edit manually.
import type { Post } from './Post';
import type { User } from './User';

export interface Comment {
  Id: string;
  PostId: string;
  UserId: string;
  Content: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  Post: Post;
  User: User;
}
