// Request DTOs for UserBlock API endpoints

export interface BlockUserRequest {
  BlockedUserId: string;
}

export interface UnblockUserRequest {
  BlockedUserId: string;
}

export interface CheckBlockStatusRequest {
  UserId: string;
}

export interface FindUserBlocksRequest {
  BlockerId?: string;
  BlockedUserId?: string;
  IsActive?: boolean;
  CreatedAfter?: string;
  CreatedBefore?: string;
}

export interface BulkUnblockRequest {
  BlockedUserIds: string[];
  Reason?: string;
}
