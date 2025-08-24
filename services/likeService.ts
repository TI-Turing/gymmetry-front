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
  async getLikesByPost(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like/post/{postId:guid}`);
    return response;
  },
  async getLikesByUser(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like/user/{userId:guid}`);
    return response;
  },
  async getAllLikes(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/like`);
    return response;
  },
  async getLikeByPostAndUser(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(
      `/like/post/{postId:guid}/user/{userId:guid}`
    );
    return response;
  },
};
