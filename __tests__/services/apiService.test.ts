// __tests__/services/apiService.test.ts
import { apiService } from '../../services/apiService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        data: {
          Success: true,
          Data: { id: 1, name: 'Test' },
          Message: 'Success',
          StatusCode: 200,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.get('/test');

      expect(mockAxios.get).toHaveBeenCalledWith('/test', undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle GET request errors', async () => {
      const error = new Error('Network Error');
      mockAxios.get.mockRejectedValue(error);

      await expect(apiService.get('/test')).rejects.toThrow('Network Error');
    });

    it('should pass config options', async () => {
      const mockResponse = {
        data: { Success: true, Data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const config = { timeout: 5000 };
      await apiService.get('/test', config);

      expect(mockAxios.get).toHaveBeenCalledWith('/test', config);
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockResponse = {
        data: {
          Success: true,
          Data: { id: 1, created: true },
          Message: 'Created',
          StatusCode: 201,
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const postData = { name: 'New Item' };
      const result = await apiService.post('/test', postData);

      expect(mockAxios.post).toHaveBeenCalledWith('/test', postData, undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle POST request errors', async () => {
      const error = new Error('Validation Error');
      mockAxios.post.mockRejectedValue(error);

      const postData = { name: 'Invalid Item' };
      await expect(apiService.post('/test', postData)).rejects.toThrow(
        'Validation Error'
      );
    });

    it('should pass config options to POST', async () => {
      const mockResponse = {
        data: { Success: true, Data: null },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const postData = { name: 'Test' };
      const config = { headers: { 'Content-Type': 'application/json' } };

      await apiService.post('/test', postData, config);

      expect(mockAxios.post).toHaveBeenCalledWith('/test', postData, config);
    });

    it('should handle POST without data', async () => {
      const mockResponse = {
        data: { Success: true, Data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.post.mockResolvedValue(mockResponse);

      const result = await apiService.post('/test');

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/test',
        undefined,
        undefined
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockResponse = {
        data: {
          Success: true,
          Data: { id: 1, updated: true },
          Message: 'Updated',
          StatusCode: 200,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.put.mockResolvedValue(mockResponse);

      const putData = { id: 1, name: 'Updated Item' };
      const result = await apiService.put('/test/1', putData);

      expect(mockAxios.put).toHaveBeenCalledWith('/test/1', putData, undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle PUT request errors', async () => {
      const error = new Error('Not Found');
      mockAxios.put.mockRejectedValue(error);

      const putData = { id: 999, name: 'Non-existent' };
      await expect(apiService.put('/test/999', putData)).rejects.toThrow(
        'Not Found'
      );
    });
  });

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = {
        data: {
          Success: true,
          Data: null,
          Message: 'Deleted',
          StatusCode: 200,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const result = await apiService.delete('/test/1');

      expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', undefined);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle DELETE request errors', async () => {
      const error = new Error('Forbidden');
      mockAxios.delete.mockRejectedValue(error);

      await expect(apiService.delete('/test/1')).rejects.toThrow('Forbidden');
    });

    it('should pass config to DELETE', async () => {
      const mockResponse = {
        data: { Success: true, Data: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.delete.mockResolvedValue(mockResponse);

      const config = { headers: { Authorization: 'Bearer token' } };
      await apiService.delete('/test/1', config);

      expect(mockAxios.delete).toHaveBeenCalledWith('/test/1', config);
    });
  });

  describe('Response handling', () => {
    it('should return response data directly', async () => {
      const responseData = {
        Success: true,
        Data: { message: 'test' },
        Message: 'OK',
        StatusCode: 200,
      };

      const mockResponse = {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.get('/test');
      expect(result).toEqual(responseData);
    });

    it('should handle responses without data', async () => {
      const mockResponse = {
        data: null,
        status: 204,
        statusText: 'No Content',
        headers: {},
        config: {},
      };

      mockAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.get('/test');
      expect(result).toBeNull();
    });
  });
});
