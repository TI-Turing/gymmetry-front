// Response DTOs for UserBlock API endpoints

import { UserBlock, BlockStats } from '../../models/UserBlock';

export interface UserBlockResponse {
  Success: boolean;
  Message: string;
  Data: UserBlock;
  StatusCode: number;
}

export interface UserBlockListResponse {
  Success: boolean;
  Message: string;
  Data: UserBlock[];
  StatusCode: number;
}

export interface BlockStatusResponse {
  Success: boolean;
  Message: string;
  Data: {
    IsBlocked: boolean;
    IsMutualBlock: boolean;
    BlockedAt?: string;
  };
  StatusCode: number;
}

export interface BlockStatsResponse {
  Success: boolean;
  Message: string;
  Data: BlockStats;
  StatusCode: number;
}

export interface BulkUnblockResponse {
  Success: boolean;
  Message: string;
  Data: {
    ProcessedCount: number;
    SucceededCount: number;
    FailedCount: number;
    FailedUserIds: string[];
  };
  StatusCode: number;
}

export interface DeleteResponse {
  Success: boolean;
  Message: string;
  Data: boolean;
  StatusCode: number;
}
