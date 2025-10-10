import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { FeedCreateRequestDto } from '@/dto/Feed/Request/FeedCreateRequestDto';

// Auto-generated service for Feed Azure Functions
export const feedService = {
  async deleteFeed(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/feed/${id}`);
    return response;
  },
  async createFeed(
    request: FeedCreateRequestDto
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/feed`, request);
    return response;
  },
  async uploadMedia(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/feed/upload-media`,
      request
    );
    return response;
  },
  async getFeedById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/feed/${id}`);
    return response;
  },
  async getAllFeeds(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/feed`);
    return response;
  },

  /**
   * Crea un feed con archivos multimedia usando FormData
   */
  async createFeedWithMedia(formData: FormData): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/feed/create-with-media`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  },
  // Nuevos endpoints paginados y trending
  async getFeedsPaged(page = 1, size = 20): Promise<ApiResponse<unknown>> {
    return apiService.get<unknown>(`/feed/paged?page=${page}&size=${size}`);
  },
  async getUserFeedsPaged(
    userId: string,
    page = 1,
    size = 20
  ): Promise<ApiResponse<unknown>> {
    return apiService.get<unknown>(
      `/feed/user/${userId}/paged?page=${page}&size=${size}`
    );
  },
  async getTrending(hours = 24, take = 20): Promise<ApiResponse<unknown>> {
    return apiService.get<unknown>(
      `/feed/trending?hours=${hours}&take=${take}`
    );
  },

  // Feed View Tracking - Sistema de feeds vistos
  /**
   * Obtiene feeds NO vistos por el usuario autenticado con paginación
   * Incluye contadores HasMore y UnviewedCount para infinite scroll
   */
  async getUnviewedFeeds(page = 1, size = 20): Promise<ApiResponse<unknown>> {
    return apiService.get<unknown>(`/feed/unviewed?page=${page}&size=${size}`);
  },

  /**
   * Marca una lista de feeds como vistos por el usuario autenticado
   * Límite: 50 feeds por request (batch processing automático en hook)
   */
  async markFeedsAsViewed(feedIds: string[]): Promise<ApiResponse<boolean>> {
    return apiService.post<boolean>(`/feed/mark-viewed`, {
      FeedIds: feedIds,
    });
  },
  // Likes
  async like(feedId: string): Promise<ApiResponse<unknown>> {
    return apiService.post<unknown>(`/feed/${feedId}/like`, {});
  },
  async unlike(feedId: string): Promise<ApiResponse<unknown>> {
    return apiService.delete<unknown>(`/feed/${feedId}/like`);
  },
  async getLikesCount(feedId: string): Promise<ApiResponse<number>> {
    return apiService.get<number>(`/feed/${feedId}/likes/count`);
  },
  // Comentarios
  async addComment(
    feedId: string,
    request: { content: string; isAnonymous?: boolean }
  ): Promise<ApiResponse<unknown>> {
    return apiService.post<unknown>(`/feed/${feedId}/comment`, request);
  },
  async deleteComment(commentId: string): Promise<ApiResponse<unknown>> {
    return apiService.delete<unknown>(`/feed/comment/${commentId}`);
  },
  async getCommentsPaged(
    feedId: string,
    page = 1,
    size = 50
  ): Promise<ApiResponse<unknown>> {
    return apiService.get<unknown>(
      `/feed/${feedId}/comments?page=${page}&size=${size}`
    );
  },
  async getCommentsCount(feedId: string): Promise<ApiResponse<number>> {
    return apiService.get<number>(`/feed/${feedId}/comments/count`);
  },
  // Milestones
  async createMilestone(request: {
    userId?: string;
    milestoneCode:
      | 'STREAK_7'
      | 'STREAK_30'
      | 'WEIGHT_LOSS_5'
      | 'FIRST_ASSESSMENT'
      | 'ROUTINE_COMPLETED';
    extra?: unknown;
  }): Promise<ApiResponse<unknown>> {
    return apiService.post<unknown>(`/feed/milestone`, request);
  },
  async searchFeeds(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/feed/search`, request);
    return response;
  },
  async updateFeed(
    id: string,
    request: unknown
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/feed/${id}`, request);
    return response;
  },
};
