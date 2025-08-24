import { ApiResponse } from '../types';

type ErrorWithResponse = {
  response?: {
    data?: unknown;
    status?: number;
  };
};
type ApiErrorData = {
  Message?: string;
  error?: string;
  errors?: Record<string, unknown>;
};

export const handleApiError = (error: unknown): string => {
  // Si es un error de axios con respuesta del servidor
  const hasResponse =
    !!error &&
    typeof error === 'object' &&
    'response' in (error as ErrorWithResponse);
  if (hasResponse) {
    const resp = (error as ErrorWithResponse).response;
    const data = (resp?.data as ApiErrorData | undefined) || undefined;
    const status = typeof resp?.status === 'number' ? resp.status : undefined;

    // Para códigos 4xx que son errores esperados del servidor
    if (typeof status === 'number' && status >= 400 && status < 500) {
      // Si la respuesta tiene el formato estándar con Message
      if (data && typeof data.Message === 'string') {
        return data.Message as string;
      }
      // Si la respuesta tiene un campo de error diferente
      if (data && typeof data.error === 'string') {
        return data.error as string;
      }
      // Si la respuesta tiene campos de validación específicos
      if (data && data.errors && typeof data.errors === 'object') {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError)) {
          return firstError[0] as string;
        }
        return firstError as string;
      }
    }

    // Para otros errores del servidor
    if (data && typeof data.Message === 'string') {
      return data.Message as string;
    }
  }

  // Si el error ya tiene un Message directo
  if (
    !!error &&
    typeof error === 'object' &&
    'Message' in (error as Record<string, unknown>) &&
    typeof (error as Record<string, unknown>).Message === 'string'
  ) {
    return (error as Record<string, unknown>).Message as string;
  }

  // Si es un string
  if (typeof error === 'string') {
    return error;
  }

  // Si es un error estándar de JavaScript
  if (error instanceof Error && typeof error.message === 'string') {
    return error.message;
  }

  // Error genérico
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
};

export const isApiResponseSuccess = <T>(
  response: unknown
): response is ApiResponse<T> => {
  return (
    !!response &&
    typeof response === 'object' &&
    'Success' in (response as Record<string, unknown>) &&
    typeof (response as Record<string, unknown>).Success === 'boolean'
  );
};

export const extractApiError = <T>(response: ApiResponse<T>): string => {
  return response?.Message || 'Error desconocido del servidor';
};
