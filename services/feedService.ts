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
