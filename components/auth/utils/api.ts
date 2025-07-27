import { ApiResponse } from '../types';

export const handleApiError = (error: any): string => {
  console.log('🔍 [API ERROR] Procesando error:', error);
  
  // Si es un error de axios con respuesta del servidor
  if (error?.response?.data) {
    const { data, status } = error.response;
    console.log('🔍 [API ERROR] Status:', status, 'Data:', data);
    
    // Para códigos 4xx que son errores esperados del servidor
    if (status >= 400 && status < 500) {
      // Si la respuesta tiene el formato estándar con Message
      if (data.Message) {
        return data.Message;
      }
      // Si la respuesta tiene un campo de error diferente
      if (data.error) {
        return data.error;
      }
      // Si la respuesta tiene campos de validación específicos
      if (data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0] as string;
        }
        return firstError as string;
      }
    }
    
    // Para otros errores del servidor
    if (data.Message) {
      return data.Message;
    }
  }

  // Si el error ya tiene un Message directo
  if (error?.Message) {
    return error.Message;
  }

  // Si es un string
  if (typeof error === 'string') {
    return error;
  }

  // Si es un error estándar de JavaScript
  if (error?.message) {
    return error.message;
  }

  // Error genérico
  console.log('⚠️ [API ERROR] Error no identificado:', error);
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

export const isApiResponseSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response === 'object' && 'Success' in response;
};

export const extractApiError = (response: ApiResponse): string => {
  return response.Message || 'Error desconocido del servidor';
};
