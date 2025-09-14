// UserBlock Service - Connects to 9 backend endpoints

import { apiService } from './apiService';
import { UserBlock, BlockStats } from '../models/UserBlock';
import type { ApiResponse } from '../dto/common/ApiResponse';
import {
  BlockUserRequest,
  FindUserBlocksRequest,
  BulkUnblockRequest,
} from '../dto/UserBlock/UserBlockRequest';

// Backend error codes and limits
export const BLOCK_ERROR_CODES = {
  SELF_BLOCK: 'SelfBlock',
  ALREADY_BLOCKED: 'AlreadyBlocked',
  DAILY_LIMIT_REACHED: 'DailyLimitReached',
  USER_NOT_FOUND: 'UserNotFound',
  BULK_LIMIT_EXCEEDED: 'BulkLimitExceeded',
  NOT_FOUND: 'NotFound',
} as const;

export const BLOCK_LIMITS = {
  DAILY_BLOCK_LIMIT: 20,
  BULK_OPERATION_LIMIT: 50,
} as const;

// Type definitions for API responses
interface BlockStatusResult {
  IsBlocked: boolean;
  IsMutualBlock: boolean;
  BlockedAt?: string;
}

interface BulkUnblockResult {
  ProcessedCount: number;
  SucceededCount: number;
  FailedCount: number;
  FailedUserIds: string[];
}

// Enhanced error handling for specific error codes
export interface BlockOperationError {
  code: string;
  message: string;
  userFriendlyMessage: string;
}

class UserBlockService {
  private readonly basePath = '/userblock';

  // Error handling utilities
  parseBlockError(response: ApiResponse<unknown>): BlockOperationError {
    const message = response.Message || 'Unknown error occurred';

    switch (message) {
      case BLOCK_ERROR_CODES.SELF_BLOCK:
        return {
          code: BLOCK_ERROR_CODES.SELF_BLOCK,
          message,
          userFriendlyMessage: 'No puedes bloquearte a ti mismo',
        };
      case BLOCK_ERROR_CODES.ALREADY_BLOCKED:
        return {
          code: BLOCK_ERROR_CODES.ALREADY_BLOCKED,
          message,
          userFriendlyMessage: 'Este usuario ya está bloqueado',
        };
      case BLOCK_ERROR_CODES.DAILY_LIMIT_REACHED:
        return {
          code: BLOCK_ERROR_CODES.DAILY_LIMIT_REACHED,
          message,
          userFriendlyMessage: `Has alcanzado el límite diario de ${BLOCK_LIMITS.DAILY_BLOCK_LIMIT} bloqueos`,
        };
      case BLOCK_ERROR_CODES.USER_NOT_FOUND:
        return {
          code: BLOCK_ERROR_CODES.USER_NOT_FOUND,
          message,
          userFriendlyMessage: 'Usuario no encontrado o inactivo',
        };
      case BLOCK_ERROR_CODES.BULK_LIMIT_EXCEEDED:
        return {
          code: BLOCK_ERROR_CODES.BULK_LIMIT_EXCEEDED,
          message,
          userFriendlyMessage: `Máximo ${BLOCK_LIMITS.BULK_OPERATION_LIMIT} usuarios por operación`,
        };
      case BLOCK_ERROR_CODES.NOT_FOUND:
        return {
          code: BLOCK_ERROR_CODES.NOT_FOUND,
          message,
          userFriendlyMessage: 'Bloqueo no encontrado',
        };
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message,
          userFriendlyMessage: 'Ocurrió un error inesperado',
        };
    }
  }

  // 1. POST /userblock - Block user
  async blockUser(request: BlockUserRequest): Promise<ApiResponse<UserBlock>> {
    return await apiService.post<UserBlock>(this.basePath, request);
  }

  // 2. DELETE /userblock/{blockedUserId} - Unblock user
  async unblockUser(blockedUserId: string): Promise<ApiResponse<boolean>> {
    return await apiService.delete<boolean>(
      `${this.basePath}/${blockedUserId}`
    );
  }

  // 3. GET /userblock/blocked - List of users blocked by current user
  async getBlockedUsers(): Promise<ApiResponse<UserBlock[]>> {
    return await apiService.get<UserBlock[]>(`${this.basePath}/blocked`);
  }

  // 4. GET /userblock/blockers - List of users who blocked me
  async getBlockers(): Promise<ApiResponse<UserBlock[]>> {
    return await apiService.get<UserBlock[]>(`${this.basePath}/blockers`);
  }

  // 5. GET /userblock/check/{userId} - Check if user is blocked
  async checkBlockStatus(
    userId: string
  ): Promise<ApiResponse<BlockStatusResult>> {
    return await apiService.get<BlockStatusResult>(
      `${this.basePath}/check/${userId}`
    );
  }

  // 6. POST /userblock/find - Search with filters
  async findUserBlocksByFields(
    filters: FindUserBlocksRequest
  ): Promise<ApiResponse<UserBlock[]>> {
    return await apiService.post<UserBlock[]>(`${this.basePath}/find`, filters);
  }

  // 7. GET /userblock/stats - Block statistics
  async getBlockStats(): Promise<ApiResponse<BlockStats>> {
    return await apiService.get<BlockStats>(`${this.basePath}/stats`);
  }

  // 8. POST /userblock/bulk/unblock - Unblock multiple users
  async bulkUnblockUsers(
    request: BulkUnblockRequest
  ): Promise<ApiResponse<BulkUnblockResult>> {
    return await apiService.post<BulkUnblockResult>(
      `${this.basePath}/bulk/unblock`,
      request
    );
  }

  // 9. GET /userblock/mutual - List of mutual blocks
  async getMutualBlocks(): Promise<ApiResponse<UserBlock[]>> {
    return await apiService.get<UserBlock[]>(`${this.basePath}/mutual`);
  }

  // Utility methods for common operations
  async isUserBlocked(userId: string): Promise<boolean> {
    try {
      const response = await this.checkBlockStatus(userId);
      return response.Success && response.Data?.IsBlocked === true;
    } catch {
      return false;
    }
  }

  async isMutualBlock(userId: string): Promise<boolean> {
    try {
      const response = await this.checkBlockStatus(userId);
      return response.Success && response.Data?.IsMutualBlock === true;
    } catch {
      return false;
    }
  }

  async getActiveBlockedUsers(): Promise<ApiResponse<UserBlock[]>> {
    return this.findUserBlocksByFields({ IsActive: true });
  }

  async getRecentBlocks(days: number = 7): Promise<ApiResponse<UserBlock[]>> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return this.findUserBlocksByFields({
      IsActive: true,
      CreatedAfter: dateThreshold.toISOString(),
    });
  }

  async unblockMultipleUsers(
    userIds: string[]
  ): Promise<ApiResponse<BulkUnblockResult>> {
    return this.bulkUnblockUsers({
      BlockedUserIds: userIds,
      Reason: 'Bulk unblock operation',
    });
  }
}

export const userBlockService = new UserBlockService();
