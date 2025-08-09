import { ApiError } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Handles API errors and returns user-friendly error messages
 */
export const handleApiError = (error: any): string => {
  if (!error) {
    return ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR;
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK.CONNECTION_ERROR;
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return ERROR_MESSAGES.NETWORK.TIMEOUT;
  }

  // HTTP status errors
  if (error.response?.status) {
    const status = error.response.status;

    switch (status) {
      case 400:
        return error.response.data?.message || 'Datos inválidos';
      case 401:
        return ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
      case 403:
        return ERROR_MESSAGES.AUTH.ACCESS_DENIED;
      case 404:
        return 'Recurso no encontrado';
      case 409:
        return error.response.data?.message || 'Conflicto en los datos';
      case 422:
        return (
          error.response.data?.message || 'Datos de validación incorrectos'
        );
      case 429:
        return 'Demasiadas solicitudes. Intenta más tarde';
      case 500:
        return 'Error del servidor. Intenta más tarde';
      case 503:
        return 'Servicio no disponible temporalmente';
      default:
        return error.response.data?.message || ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR;
    }
  }

  // Specific error messages from API
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Generic error message
  if (error.message) {
    return error.message;
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
  details?: any
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
export const isNetworkError = (error: any): boolean => {
  return (
    error.code === 'NETWORK_ERROR' ||
    error.message === 'Network Error' ||
    !error.response
  );
};

/**
 * Validates if an error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Validates if an error is a validation error
 */
export const isValidationError = (error: any): boolean => {
  return error.response?.status === 400 || error.response?.status === 422;
};

/**
 * Extracts validation errors from API response
 */
export const extractValidationErrors = (
  error: any
): Record<string, string[]> => {
  if (!error.response?.data?.errors) {
    return {};
  }

  const errors = error.response.data.errors;

  if (Array.isArray(errors)) {
    return { general: errors };
  }

  if (typeof errors === 'object') {
    return errors;
  }

  return { general: [errors.toString()] };
};

/**
 * Formats error message for display
 */
export const formatErrorMessage = (error: any): string => {
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
  let lastError: any;

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
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
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
