// Auto-generated from C# class Like. Do not edit manually.
import type { Post } from './Post';
import type { User } from './User';

export interface Like {
  Id: string;
  PostId: string;
  UserId: string;
  CreatedAt: string;
  DeletedAt: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  Post: Post;
  User: User;
}
