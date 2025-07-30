// Servicio para User basado en las Azure Functions y DTOs del backend
import { apiService } from './apiService';

// Interfaces DTO (replicadas desde C#)
export interface AddUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  idEps?: string;
  name: string;
  lastName: string;
  userName: string;
  idGender?: string;
  birthDate?: string;
  documentTypeId?: string;
  phone?: string;
  countryId?: string;
  address?: string;
  cityId?: string;
  regionId?: string;
  rh?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  physicalExceptions?: string;
  userTypeId?: string;
  physicalExceptionsNotes?: string;
}

export interface OtpRequest {
  userId: string;
  verificationType: string;
  recipient: string;
  method: string;
}

export interface ValidateOtpRequest {
  userId: string;
  otp: string;
  verificationType: string;
  recipient: string;
}

export interface PasswordUserRequest {
  email: string;
  newPassword: string;
  token: string;
}

export interface UpdateUserGymRequest {
  UserId: string;
  GymId: string;
}

export interface AddUserResponse {
  id: string;
  token: string;
}

export interface ValidateUserFieldsResponse {
  isComplete: boolean;
  missingFields: string[];
}

// Interface para búsqueda por campos (User_FindUsersByFieldsFunction)
export interface FindUsersByFieldsRequest {
  fields: { [key: string]: any };
}

export interface UserBasicInfo {
  id: string;
  name: string;
  lastName: string;
  userName: string;
  email: string;
  gymId?: string;
  userTypeId?: string;
}

// Interfaces de respuesta del backend (formato estándar de Azure Functions)
export interface ApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T;
  StatusCode: number;
}

// Funciones del servicio
export const userService = {
  async addUser(
    request: AddUserRequest
  ): Promise<ApiResponse<AddUserResponse>> {
    // POST /user/add (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<AddUserResponse>>(
      '/user/add',
      request
    );
    return response.data;
  },

  async getUserById(id: string): Promise<ApiResponse<any>> {
    // GET /user/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<ApiResponse<any>>(`/user/${id}`);
    return response.data;
  },

  async updateUser(request: UpdateUserRequest): Promise<ApiResponse<boolean>> {
    // PUT /user/update (según la ruta de la Azure Function)
    const response = await apiService.put<ApiResponse<boolean>>(
      '/user/update',
      request
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    // DELETE /user/{id} (según la ruta de la Azure Function)
    const response = await apiService.delete<ApiResponse<boolean>>(
      `/user/${id}`
    );
    return response.data;
  },

  async passwordUser(
    request: PasswordUserRequest
  ): Promise<ApiResponse<boolean>> {
    // POST /user/password/update (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<boolean>>(
      '/user/password/update',
      request
    );
    return response.data;
  },

  async requestOtp(request: OtpRequest): Promise<ApiResponse<boolean>> {
    // POST /user/otp/request (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<boolean>>(
      '/user/otp/request',
      request
    );
    return response.data;
  },

  async validateOtp(
    request: ValidateOtpRequest
  ): Promise<ApiResponse<boolean>> {
    // POST /user/otp/validate (según la ruta de la Azure Function)
    const response = await apiService.post<ApiResponse<boolean>>(
      '/user/otp/validate',
      request
    );
    return response.data;
  },

  async updateUserGym(
    request: UpdateUserGymRequest
  ): Promise<ApiResponse<boolean>> {
    // PUT /user/update-gym (según el endpoint proporcionado)
    const response = await apiService.put<ApiResponse<boolean>>(
      '/user/update-gym',
      request
    );
    return response.data;
  },

  async validateUserFields(
    id: string
  ): Promise<ApiResponse<ValidateUserFieldsResponse>> {
    // GET /user/validate-fields/{id} (según la ruta de la Azure Function)
    const response = await apiService.get<
      ApiResponse<ValidateUserFieldsResponse>
    >(`/user/validate-fields/${id}`);
    return response.data;
  },

  async findUsersByFields(
    request: FindUsersByFieldsRequest
  ): Promise<ApiResponse<UserBasicInfo[]>> {
    // POST /user/find (según User_FindUsersByFieldsFunction)
    const response = await apiService.post<ApiResponse<UserBasicInfo[]>>(
      '/user/find',
      request
    );
    return response.data;
  },

  async getAllUsers(): Promise<ApiResponse<UserBasicInfo[]>> {
    // GET /user/all (según GetUserFunction - GetAllUsers)
    const response =
      await apiService.get<ApiResponse<UserBasicInfo[]>>('/user/all');
    return response.data;
  },

  async getUsersByGym(gymId: string): Promise<ApiResponse<UserBasicInfo[]>> {
    // POST /user/find (búsqueda directa por gymId)
    console.log(apiService.getBaseURL() + '/users/find');
    const response = await apiService.post<ApiResponse<UserBasicInfo[]>>(
      '/users/find',
      { fields: { gymId } }
    );
    return response.data;
  },
};
