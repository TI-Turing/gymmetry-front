import { apiService, ApiResponse } from '../apiService';

// Auto-generated service for Post Azure Functions
export const postFunctionsService = {
  async deletePost(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/post/${id}`);
    return response;
  },
  async createPost(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/post`, request);
    return response;
  },
  async getPostById(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/post/${id}`);
    return response;
  },
  async getPostsByUser(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/post/user/{userId:guid}`);
    return response;
  },
  async getAllPosts(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/post`, request);
    return response;
  },
  async updatePost(id: string, request: any): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/post/${id}`, request);
    return response;
  },
};
