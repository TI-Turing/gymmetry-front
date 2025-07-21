import { ApiResponse } from '../types';

export const handleApiError = (error: any): string => {
  // Si el error tiene la estructura del backend
  if (error?.response?.data?.Message) {
    return error.response.data.Message;
  }

  // Si el error es un objeto con Message directamente
  if (error?.Message) {
    return error.Message;
  }

  // Si es un string
  if (typeof error === 'string') {
    return error;
  }

  // Si es un error con message
  if (error?.message) {
    return error.message;
  }

  // Fallback por defecto
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

export const isApiResponseSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response === 'object' && 'Success' in response;
};

export const extractApiError = (response: ApiResponse): string => {
  return response.Message || 'Error desconocido del servidor';
};
