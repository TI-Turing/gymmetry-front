// Ejemplo de uso del servicio de API
// NOTA: Para nuevas funcionalidades, usar userService y gymServiceExtensions en lugar de llamadas directas a apiService

import { apiService } from '../services';
import {
  User,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/dto/user';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/dto/auth';
import {
  PhoneVerificationData,
  PhoneVerificationResponse,
  OTPValidationData,
  OTPValidationResponse,
  PhoneExistsResponse,
} from '@/components/auth/types';

// API específica para usuarios (DEPRECATED - usar userService en su lugar)
export const userAPI = {
  // Crear usuario inicial (Step 1 del registro)
  // NUEVO: usar userService.addUser() en su lugar
  createUser: async (
    userData: CreateUserRequest
  ): Promise<CreateUserResponse> => {
    try {
      const response = await apiService.post<CreateUserResponse>(
        '/user/add',
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todos los usuarios
  getUsers: async () => {
    return await apiService.get<User[]>('/users');
  },

  // Obtener usuario por ID
  // NUEVO: usar userService.getUserById() en su lugar
  getUserById: async (id: number) => {
    return await apiService.get<User>(`/users/${id}`);
  },

  // Actualizar usuario (Steps 2-4 del registro)
  updateUser: async (
    userId: string,
    userData: Partial<UpdateUserRequest>
  ): Promise<UpdateUserResponse> => {
    try {
      const updateData = {
        ...userData,
        id: userId,
      };

      const response = await apiService.put<UpdateUserResponse>(
        '/user/update',
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar usuario
  deleteUser: async (id: number) => {
    return await apiService.delete(`/users/${id}`);
  },

  // Verificación de teléfono
  sendPhoneVerification: async (
    data: PhoneVerificationData
  ): Promise<PhoneVerificationResponse> => {
    try {
      const response = await apiService.post<PhoneVerificationResponse>(
        '/otp/generate-otp',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validar código OTP
  validateOTP: async (
    data: OTPValidationData
  ): Promise<OTPValidationResponse> => {
    try {
      const response = await apiService.post<OTPValidationResponse>(
        '/otp/validate-otp',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Validar si telefono existe
  checkPhoneExists: async (phone: string): Promise<PhoneExistsResponse> => {
    try {
      const response = await apiService.get<PhoneExistsResponse>(
        '/user/phone-exists/' + phone
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Ejemplo de funciones para autenticación (cuando esté disponible en la API)
export const authAPI = {
  // Login de usuario
  login: async (credentials: LoginRequest) => {
    return await apiService.post<LoginResponse>('/auth/login', credentials);
  },

  // Registro completo de usuario
  register: async (userData: RegisterRequest) => {
    return await apiService.post<RegisterResponse>('/auth/register', userData);
  },

  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    return await apiService.get<User>('/auth/profile');
  },

  // Logout
  logout: async () => {
    return await apiService.post('/auth/logout', {});
  },
};

// Ejemplo de uso en un componente:
/*
import { userAPI } from './apiExamples';

const handleCreateUser = async (email: string, password: string) => {
  try {
    const response = await userAPI.createUser({ 
      email, 
      Password: password 
    });
    // Continuar con los siguientes pasos del registro
  } catch (error) {
    // Manejar error apropiadamente
    throw error;
  }
};
*/
