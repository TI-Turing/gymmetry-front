import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { LikeCreateRequestDto } from '@/dto/Like/Request/LikeCreateRequestDto';

// Auto-generated service for Like Azure Functions
export const likeService = {
  async deleteLike(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/like/${id}`);
    return response;
  },
  async createLike(
    request: LikeCreateRequestDto
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/like`, request);
    return response;
  },
  async getLikeById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like/${id}`);
    return response;
  },
  async getLikesByPost(postId: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like/post/${postId}`);
    return response;
  },
  async getLikesByUser(userId: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like/user/${userId}`);
    return response;
  },
  async getAllLikes(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like`);
    return response;
  },
  async getLikeByPostAndUser(
    postId: string,
    userId: string
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(
      `/like/post/${postId}/user/${userId}`
    );
    return response;
  },
};
