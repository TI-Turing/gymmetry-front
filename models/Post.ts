// Auto-generated from C# class Post. Do not edit manually.
import type { Comment } from './Comment';
import type { Like } from './Like';
import type { User } from './User';

export interface Post {
  Id: string;
  UserId: string;
  Content: string;
  MediaUrl: string | null;
  MediaType: string | null;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  User: User;
  Comments: Comment[];
  Likes: Like[];
}
