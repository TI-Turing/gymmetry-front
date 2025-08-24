import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';

// Auto-generated service for Post Azure Functions
export const postService = {
  async deletePost(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/post/${id}`);
    return response;
  },
  async createPost(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/post`, request);
    return response;
  },
  async getPostById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/post/${id}`);
    return response;
  },
  async getPostsByUser(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/post/user/{userId:guid}`);
    return response;
  },
  async getAllPosts(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/post`, request);
    return response;
  },
  async updatePost(
    id: string,
    request: unknown
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/post/${id}`, request);
    return response;
  },
};
