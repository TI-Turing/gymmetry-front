export interface FeedComment {
  Id: string;
  FeedId: string;
  UserId: string;
  Content: string;
  CreatedAt: string;
  UpdatedAt?: string | null;
  DeletedAt?: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  Ip?: string | null;
  IsAnonymous: boolean;
}
