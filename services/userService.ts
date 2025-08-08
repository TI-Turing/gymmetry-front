// Servicio para User basado en las Azure Functions y DTOs del backend
import { apiService, ApiResponse } from './apiService';
import { AddUserRequest } from '@/dto/user/AddUserRequest';
import { UpdateUserRequest } from '@/dto/user/UpdateUserRequest';
import { OtpRequest } from '@/dto/user/OtpRequest';
import { ValidateOtpRequest } from '@/dto/user/ValidateOtpRequest';
import { PasswordUserRequest } from '@/dto/user/PasswordUserRequest';
import { UpdateUserGymRequest } from '@/dto/user/UpdateUserGymRequest';
import { AddUserResponse } from '@/dto/user/AddUserResponse';
import { ValidateUserFieldsResponse } from '@/dto/user/ValidateUserFieldsResponse';
import { FindUsersByFieldsRequest } from '@/dto/user/FindUsersByFieldsRequest';
import { UserBasicInfo } from '@/dto/user/UserBasicInfo';

// Funciones del servicio
export const userService = {
  async addUser(
    request: AddUserRequest
  ): Promise<ApiResponse<AddUserResponse>> {
    // POST /user/add (según la ruta de la Azure Function)
    const response = await apiService.post<AddUserResponse>(
      '/user/add',
      request
    );
    return response;
  },

  async getUserById(id: string): Promise<ApiResponse<any>> {
    // GET /user/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<any>(`/user/${id}`);
    return response;
  },

  async updateUser(request: UpdateUserRequest): Promise<ApiResponse<boolean>> {
    // PUT /user/update (según la ruta de la Azure Function)
    const response = await apiService.put<boolean>('/user/update', request);
    return response;
  },

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    // DELETE /user/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<boolean>(`/user/${id}`);
    return response;
  },

  async passwordUser(
    request: PasswordUserRequest
  ): Promise<ApiResponse<boolean>> {
    // POST /user/password/update (según la ruta de la Azure Function)
    const response = await apiService.post<boolean>(
      '/user/password/update',
      request
    );
    return response;
  },

  async requestOtp(request: OtpRequest): Promise<ApiResponse<boolean>> {
    // POST /user/otp/request (según la ruta de la Azure Function)
    const response = await apiService.post<boolean>(
      '/user/otp/request',
      request
    );
    return response;
  },

  async validateOtp(
    request: ValidateOtpRequest
  ): Promise<ApiResponse<boolean>> {
    // POST /user/otp/validate (según la ruta de la Azure Function)
    const response = await apiService.post<boolean>(
      '/user/otp/validate',
      request
    );
    return response;
  },

  async updateUserGym(
    request: UpdateUserGymRequest
  ): Promise<ApiResponse<boolean>> {
    // PUT /user/update-gym (según el endpoint proporcionado)
    const response = await apiService.put<boolean>('/user/update-gym', request);
    return response;
  },

  async validateUserFields(
    id: string
  ): Promise<ApiResponse<ValidateUserFieldsResponse>> {
    // GET /user/validate-fields/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<ValidateUserFieldsResponse>(
      `/user/validate-fields/${id}`
    );
    return response;
  },

  async findUsersByFields(
    request: FindUsersByFieldsRequest
  ): Promise<ApiResponse<UserBasicInfo[]>> {
    // POST /user/find (según User_FindUsersByFieldsFunction)
    const response = await apiService.post<UserBasicInfo[]>(
      '/user/find',
      request
    );
    return response;
  },

  async getAllUsers(): Promise<ApiResponse<UserBasicInfo[]>> {
    // GET /user/all (según GetUserFunction - GetAllUsers)
    const response = await apiService.get<UserBasicInfo[]>('/user/all');
    return response;
  },

  async getUsersByGym(gymId: string): Promise<ApiResponse<UserBasicInfo[]>> {
    // POST /user/find (búsqueda directa por gymId)
    const response = await apiService.post<UserBasicInfo[]>('/users/find', {
      fields: { gymId },
    });
    return response;
  },

  async checkPhoneExists(phone: string): Promise<ApiResponse<boolean>> {
    // GET /user/phone-exists/{phone}
    const response = await apiService.get<boolean>(
      `/user/phone-exists/${encodeURIComponent(phone)}`
    );
    return response;
  },

  async checkEmailExists(email: string): Promise<ApiResponse<boolean>> {
    // GET /user/email-exists/{email}
    const response = await apiService.get<boolean>(
      `/user/email-exists/${encodeURIComponent(email)}`
    );
    return response;
  },
};
