import { apiService, ApiResponse } from '../apiService';
import type { AddResponse } from '@/dto/user/Response/AddResponse';
import type { AddRequest } from '@/dto/user/Request/AddRequest';
import type { User } from '@/models/User';
import type { FindUsersByFieldsRequest } from '@/dto/user/FindUsersByFieldsRequest';
import type { ValidateUserFieldsResponse } from '@/dto/user/ValidateUserFieldsResponse';
import type { PasswordUserRequest } from '@/dto/user/PasswordUserRequest';
import type { PaymentRequestDto } from '@/dto/user/Request/PaymentRequestDto';
import type { UpdateRequest } from '@/dto/user/Request/UpdateRequest';
import type { UpdateUserGymRequest } from '@/dto/user/UpdateUserGymRequest';

// Auto-generated service for User Azure Functions
export const userFunctionsService = {
  async addUser(request: AddRequest): Promise<ApiResponse<AddResponse>> {
    const response = await apiService.post<AddResponse>(`/user/add`, request);
    return response;
  },
  async deleteUser(id: string): Promise<ApiResponse<any>> {
    const response = await apiService.delete<any>(`/user/${id}`);
    return response;
  },
  async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await apiService.get<User>(`/user/${id}`);
    return response;
  },
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await apiService.get<User[]>(`/users`);
    return response;
  },
  async findUsersByFields(
    request: FindUsersByFieldsRequest
  ): Promise<ApiResponse<User[]>> {
    const response = await apiService.post<User[]>(`/users/find`, request);
    return response;
  },
  async getInfoUserById(
    id: string
  ): Promise<ApiResponse<ValidateUserFieldsResponse>> {
    const response = await apiService.get<ValidateUserFieldsResponse>(
      `/user/getinfo/${id}`
    );
    return response;
  },
  async phoneExists(): Promise<ApiResponse<any>> {
    const response = await apiService.get<any>(`/user/phone-exists/{phone}`);
    return response;
  },
  async passwordUser(request: PasswordUserRequest): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/user/password/update`,
      request
    );
    return response;
  },
  async generatePaymentUrl(
    request: PaymentRequestDto
  ): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/user/payment-url`, request);
    return response;
  },
  async paymentWebhook(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(`/webhook/payment`, request);
    return response;
  },
  async updateUser(request: UpdateRequest): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/user/update`, request);
    return response;
  },
  async updateUserGym(
    request: UpdateUserGymRequest
  ): Promise<ApiResponse<any>> {
    const response = await apiService.put<any>(`/user/update-gym`, request);
    return response;
  },
  async uploadProfileImage(request: any): Promise<ApiResponse<any>> {
    const response = await apiService.post<any>(
      `/user/upload-profile-image`,
      request
    );
    return response;
  },
};
