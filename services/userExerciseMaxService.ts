import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import type { AddUserExerciseMaxRequest } from '@/dto/UserExerciseMax/Request/AddUserExerciseMaxRequest';
import type { UpdateUserExerciseMaxRequest } from '@/dto/UserExerciseMax/Request/UpdateUserExerciseMaxRequest';
import type { UserExerciseMax } from '@/models/UserExerciseMax';

// Service for UserExerciseMax Azure Functions
export const userExerciseMaxService = {
  async addUserExerciseMax(
    request: AddUserExerciseMaxRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/userexercisemax/add`,
      request
    );
    return response;
  },
  async updateUserExerciseMax(
    request: UpdateUserExerciseMaxRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(
      `/userexercisemax/update`,
      request
    );
    return response;
  },
  async deleteUserExerciseMax(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/userexercisemax/${id}`);
    return response;
  },
  async getUserExerciseMaxById(
    id: string
  ): Promise<ApiResponse<UserExerciseMax>> {
    const response = await apiService.get<UserExerciseMax>(
      `/userexercisemax/${id}`
    );
    return response;
  },
  async getAllUserExerciseMaxes(): Promise<ApiResponse<UserExerciseMax[]>> {
    const response =
      await apiService.get<UserExerciseMax[]>(`/userexercisemaxes`);
    return response;
  },
  async findUserExerciseMaxesByFields(
    request: Record<string, unknown>
  ): Promise<ApiResponse<UserExerciseMax[]>> {
    const response = await apiService.post<UserExerciseMax[]>(
      `/userexercisemaxes/find`,
      request
    );
    return response;
  },
};
