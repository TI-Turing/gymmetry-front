// __tests__/utils/errorUtils.test.ts
import { handleApiError } from '../../utils/errorUtils';
import { ERROR_MESSAGES } from '../../constants';

describe('Error Utils', () => {
  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const networkError = { code: 'NETWORK_ERROR' };
      const result = handleApiError(networkError);
      expect(result).toBe(ERROR_MESSAGES.NETWORK.CONNECTION_ERROR);
    });

    it('should handle timeout errors', () => {
      const timeoutError = { code: 'ECONNABORTED' };
      const result = handleApiError(timeoutError);
      expect(result).toBe(ERROR_MESSAGES.NETWORK.TIMEOUT);
    });

    it('should handle timeout message errors', () => {
      const timeoutError = { message: 'timeout of 5000ms exceeded' };
      const result = handleApiError(timeoutError);
      expect(result).toBe(ERROR_MESSAGES.NETWORK.TIMEOUT);
    });

    it('should handle 401 unauthorized errors', () => {
      const authError = { response: { status: 401 } };
      const result = handleApiError(authError);
      expect(result).toBe(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    });

    it('should handle 403 forbidden errors', () => {
      const forbiddenError = { response: { status: 403 } };
      const result = handleApiError(forbiddenError);
      expect(result).toBe(ERROR_MESSAGES.AUTH.ACCESS_DENIED);
    });

    it('should handle 404 not found errors', () => {
      const notFoundError = { response: { status: 404 } };
      const result = handleApiError(notFoundError);
      expect(result).toBe(ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR);
    });

    it('should handle 500 server errors', () => {
      const serverError = { response: { status: 500 } };
      const result = handleApiError(serverError);
      expect(result).toBe(ERROR_MESSAGES.NETWORK.SERVER_ERROR);
    });

    it('should handle custom error messages from response', () => {
      const customError = {
        response: {
          status: 400,
          data: { message: 'Custom error message' },
        },
      };
      const result = handleApiError(customError);
      expect(result).toBe('Custom error message');
    });

    it('should handle error data as string', () => {
      const customError = {
        response: {
          status: 400,
          data: 'String error message',
        },
      };
      const result = handleApiError(customError);
      expect(result).toBe('String error message');
    });

    it('should return generic error for unknown errors', () => {
      const unknownError = { something: 'weird' };
      const result = handleApiError(unknownError);
      expect(result).toBe(ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR);
    });

    it('should handle null/undefined errors', () => {
      expect(handleApiError(null)).toBe(
        ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR
      );
      expect(handleApiError(undefined)).toBe(
        ERROR_MESSAGES.GENERIC.UNEXPECTED_ERROR
      );
    });

    it('should handle network message errors', () => {
      const networkError = { message: 'Network Error' };
      const result = handleApiError(networkError);
      expect(result).toBe(ERROR_MESSAGES.NETWORK.CONNECTION_ERROR);
    });
  });
});
