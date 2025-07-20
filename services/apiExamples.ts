// Ejemplo de uso del servicio de API

import { apiService } from '../services';
import { 
  User, 
  CreateUserRequest, 
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse
} from '@/dto/user';
import {
  LoginRequest, 
  LoginResponse,
  RegisterRequest, 
  RegisterResponse 
} from '@/dto/auth';

// API específica para usuarios
export const userAPI = {
  // Crear usuario inicial (Step 1 del registro)
  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    try {
      console.log('🚀 [USER API] Iniciando creación de usuario...');
      console.log('🔗 [USER API] URL que se va a llamar: /user/add');
      console.log('📤 [USER API] Datos a enviar:', userData);
      
      const response = await apiService.post<CreateUserResponse>('/user/add', userData);
      
      console.log('✅ [USER API] Usuario creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [USER API] Error al crear usuario:', error);
      throw error;
    }
  },

  // Obtener todos los usuarios
  getUsers: async () => {
    return await apiService.get<User[]>('/users');
  },

  // Obtener usuario por ID
  getUserById: async (id: number) => {
    return await apiService.get<User>(`/users/${id}`);
  },

  // Actualizar usuario (Steps 2-4 del registro)
  updateUser: async (userId: string, userData: Partial<UpdateUserRequest>): Promise<UpdateUserResponse> => {
    try {
      console.log('🔄 [USER API] Iniciando actualización de usuario...');
      console.log('🔗 [USER API] URL que se va a llamar: /user/update');
      console.log('👤 [USER API] ID del usuario:', userId);
      console.log('📤 [USER API] Datos a enviar:', userData);
      
      const updateData = {
        ...userData,
        id: userId
      };
      
      const response = await apiService.put<UpdateUserResponse>('/user/update', updateData);
      
      console.log('✅ [USER API] Usuario actualizado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [USER API] Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  deleteUser: async (id: number) => {
    return await apiService.delete(`/users/${id}`);
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
    console.log('Usuario creado:', response);
    // Continuar con los siguientes pasos del registro
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    // Mostrar error al usuario
  }
};
*/
