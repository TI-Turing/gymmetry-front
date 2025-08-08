import { apiService, ApiResponse } from '../apiService';
import type { CommentCreateRequestDto } from '@/dto/Comment/Request/CommentCreateRequestDto';

// Auto-generated service for Comment Azure Functions
export const commentFunctionsService = {
  async deleteComment(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/comment/${id}`);
    return response;
  },
  async createComment(request: CommentCreateRequestDto): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/comment`, request);
    return response;
  },
  async getCommentById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/comment/${id}`);
    return response;
  },
  async getCommentsByPost(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/comment/post/{postId:guid}`);
    return response;
  },
  async getCommentsByUser(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/comment/user/{userId:guid}`);
    return response;
  },
  async getAllComments(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/comment`);
    return response;
  },
  async updateComment(id: string, request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/comment/${id}`, request);
    return response;
  },
};
