import { ApiResponse } from '../types';

export const handleApiError = (error: any): string => {
  if (error?.response?.data?.Message) {
    return error.response.data.Message;
  }

  if (error?.Message) {
    return error.Message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

export const isApiResponseSuccess = <T>(response: any): response is ApiResponse<T> => {
  return response && typeof response === 'object' && 'Success' in response;
};

export const extractApiError = (response: ApiResponse): string => {
  return response.Message || 'Error desconocido del servidor';
};
