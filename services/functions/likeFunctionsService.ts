import { apiService, ApiResponse } from '../apiService';
import type { LikeCreateRequestDto } from '@/dto/Like/Request/LikeCreateRequestDto';

// Auto-generated service for Like Azure Functions
export const likeFunctionsService = {
  async deleteLike(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/like/${id}`);
    return response;
  },
  async createLike(request: LikeCreateRequestDto): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/like`, request);
    return response;
  },
  async getLikeById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/like/${id}`);
    return response;
  },
  async getLikesByPost(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/like/post/{postId:guid}`);
    return response;
  },
  async getLikesByUser(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/like/user/{userId:guid}`);
    return response;
  },
  async getAllLikes(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/like`);
    return response;
  },
  async getLikeByPostAndUser(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/like/post/{postId:guid}/user/{userId:guid}`);
    return response;
  },
};
