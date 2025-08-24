import { apiService } from './apiService';
import type { ApiResponse } from '@/dto/common/ApiResponse';
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
export const userService = {
  async addUser(request: AddRequest): Promise<ApiResponse<AddResponse>> {
    const response = await apiService.post<AddResponse>(`/user/add`, request);
    return response;
  },
  async deleteUser(id: string): Promise<ApiResponse<unknown>> {
    const response = await apiService.delete<unknown>(`/user/${id}`);
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
  async phoneExists(): Promise<ApiResponse<unknown>> {
    const response = await apiService.get<unknown>(
      `/user/phone-exists/{phone}`
    );
    return response;
  },
  async passwordUser(
    request: PasswordUserRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/user/password/update`,
      request
    );
    return response;
  },
  async generatePaymentUrl(
    request: PaymentRequestDto
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/user/payment-url`,
      request
    );
    return response;
  },
  async paymentWebhook(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/webhook/payment`,
      request
    );
    return response;
  },
  async updateUser(request: UpdateRequest): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/user/update`, request);
    return response;
  },
  async updateUserGym(
    request: UpdateUserGymRequest
  ): Promise<ApiResponse<unknown>> {
    const response = await apiService.put<unknown>(`/user/update-gym`, request);
    return response;
  },
  async uploadProfileImage(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/user/upload-profile-image`,
      request
    );
    return response;
  },

  // Métodos adicionales para compatibilidad
  async checkEmailExists(email: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.get<boolean>(
      `/user/check-email/${email}`
    );
    return response;
  },

  async checkPhoneExists(phone: string): Promise<ApiResponse<boolean>> {
    const response = await apiService.get<boolean>(
      `/user/check-phone/${phone}`
    );
    return response;
  },

  async requestOtp(request: unknown): Promise<ApiResponse<unknown>> {
    const response = await apiService.post<unknown>(
      `/user/request-otp`,
      request
    );
    return response;
  },

  async validateOtp(request: unknown): Promise<ApiResponse<boolean>> {
    const response = await apiService.post<boolean>(
      `/user/validate-otp`,
      request
    );
    return response;
  },

  async getUsersByGym(gymId: string): Promise<ApiResponse<User[]>> {
    const response = await apiService.get<User[]>(`/user/by-gym/${gymId}`);
    return response;
  },
};
