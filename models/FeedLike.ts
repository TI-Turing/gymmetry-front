export interface FeedLike {
  Id: string;
  FeedId: string;
  UserId: string;
  CreatedAt: string;
  DeletedAt?: string | null;
  IsActive: boolean;
  IsDeleted: boolean;
  Ip?: string | null;
}
