import { ApiError } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Handles API errors and returns user-friendly error messages
 */
type AxiosLikeError = {
  code?: string;
  message?: string;
  response?: {
    status?: number;
    data?: { message?: string; errors?: unknown } | undefined;
  };
};

export const handleApiError = (error: unknown): string => {
  const err = (error || {}) as AxiosLikeError;
  if (!error) {
    return ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR;
  }

  // Network errors
  if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
  }

  // Timeout errors
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return ERROR_MESSAGES.NETWORK.TIMEOUT;
  }

  // HTTP status errors
  if (err.response?.status) {
    const status = err.response.status;

    switch (status) {
      case 400:
        return err.response?.data?.message || 'Datos inválidos';
      case 401:
        return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
      case 403:
        return ERROR_MESSAGES.AUTH.ACCESS_DENIED;
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return err.response?.data?.message || 'Conflicto en los datos';
      case 422:
        return err.response?.data?.message || 'Datos de validación incorrectos';
      case 429:
        return 'Demasiadas solicitudes. Intenta más tarde';
      case 500:
        return 'Error del servidor. Intenta más tarde';
      case 503:
        return 'Servicio no disponible temporalmente';
      default:
        return (
          err.response?.data?.message || ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR
        );
    }
  }

  // Specific error messages from API
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  // Generic error message
  if (err.message) {
    return err.message;
  }

  return ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR;
};

/**
 * Creates a standardized API error object
 */
export const createApiError = (
  message: string,
  status?: number,
  code?: string,
  details?: unknown
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  error.details = details;
  return error;
};

/**
 * Validates if an error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const err = (error || {}) as AxiosLikeError;
  return (
    err.code === 'NETWORK_ERROR' ||
    err.message === 'Network Error' ||
    !err.response
  );
};

/**
 * Validates if an error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  const err = (error || {}) as AxiosLikeError;
  return err.response?.status === 401 || err.response?.status === 403;
};

/**
 * Validates if an error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  const err = (error || {}) as AxiosLikeError;
  return err.response?.status === 400 || err.response?.status === 422;
};

/**
 * Extracts validation errors from API response
 */
export const extractValidationErrors = (
  error: unknown
): Record<string, string[]> => {
  const err = (error || {}) as AxiosLikeError;
  if (!err.response?.data?.errors) {
    return {};
  }

  const errors = err.response.data?.errors as unknown;

  if (Array.isArray(errors)) {
    return { general: errors as string[] };
  }

  if (typeof errors === 'object') {
    return errors as Record<string, string[]>;
  }

  return { general: [String(errors)] };
};

/**
 * Formats error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  const message = handleApiError(error);

  // Capitalize first letter
  return message.charAt(0).toUpperCase() + message.slice(1);
};

/**
 * Retry function for API calls
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on certain errors
      if (isAuthError(error) || isValidationError(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

export default {
  handleApiError,
  createApiError,
  isNetworkError,
  isAuthError,
  isValidationError,
  extractValidationErrors,
  formatErrorMessage,
  retryApiCall,
};
