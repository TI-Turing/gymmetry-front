import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { CommentCreateRequestDto } from '@/dto/Comment/Request/CommentCreateRequestDto';

// Auto-generated service for Comment Azure Functions
export const commentService = {
  async deleteComment(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/comment/${id}`);
    return response;
  },
  async createComment(
    request: CommentCreateRequestDto
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(`/comment`, request);
    return response;
  },
  async getCommentById(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/comment/${id}`);
    return response;
  },
  async getCommentsByPost(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(
      `/comment/post/{postId:guid}`
    );
    return response;
  },
  async getCommentsByUser(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(
      `/comment/user/{userId:guid}`
    );
    return response;
  },
  async getAllComments(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(`/comment`);
    return response;
  },
  async updateComment(
    id: string,
    request: unknown
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/comment/${id}`, request);
    return response;
  },
};
