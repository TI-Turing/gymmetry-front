import { apiService, ApiResponse } from '../apiService';
import type { FeedCreateRequestDto } from '@/dto/Feed/Request/FeedCreateRequestDto';

// Auto-generated service for Feed Azure Functions
export const feedFunctionsService = {
  async deleteFeed(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/feed/${id}`);
    return response;
  },
  async createFeed(request: FeedCreateRequestDto): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/feed`, request);
    return response;
  },
  async uploadMedia(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/feed/upload-media`, request);
    return response;
  },
  async getFeedById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/feed/${id}`);
    return response;
  },
  async getAllFeeds(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/feed`);
    return response;
  },
  async searchFeeds(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/feed/search`, request);
    return response;
  },
  async updateFeed(id: string, request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/feed/${id}`, request);
    return response;
  },
};
