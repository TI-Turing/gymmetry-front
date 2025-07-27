import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { Environment } from '../environment';
import { retryApiCall } from '@/utils';
import { API_CONSTANTS } from '@/constants/AppConstants';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
  retryAttempts?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class ApiService {
  private axiosInstance: AxiosInstance;
  private authToken?: string | undefined;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Environment.API_BASE_URL,
      timeout: API_CONSTANTS.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Gymmetry/1.0.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add environment-specific headers
        if (Environment.API_MAIN_FUNCTIONS_KEY) {
          config.headers['x-functions-key'] =
            Environment.API_MAIN_FUNCTIONS_KEY;
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        // Handle 401 Unauthorized - token refresh logic could go here
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // TODO: Implement token refresh or redirect to login
        }

        return Promise.reject(error);
      }
    );
  }

  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  public clearAuthToken(): void {
    this.authToken = undefined;
  }

  private async makeRequest<T>(
    method: HttpMethod,
    url: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      ...(options.headers && { headers: options.headers }),
      ...(options.timeout && { timeout: options.timeout }),
    };

    const executeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await this.axiosInstance.request(config);

        return {
          data: response.data,
          success: true,
          message: response.data?.message,
        };
      } catch (error) {
        const apiError = error as AxiosError;
        throw apiError;
      }
    };

    // Use retry logic if enabled
    if (options.retry !== false) {
      const retryAttempts =
        options.retryAttempts || API_CONSTANTS.RETRY_ATTEMPTS;
      return retryApiCall(
        executeRequest,
        retryAttempts,
        API_CONSTANTS.RETRY_DELAY
      );
    }

    return executeRequest();
  }

  public async get<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', url, undefined, options);
  }

  public async post<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', url, data, options);
  }

  public async put<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', url, data, options);
  }

  public async patch<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PATCH', url, data, options);
  }

  public async delete<T>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', url, undefined, options);
  }

  // Upload method for file uploads
  public async upload<T>(
    url: string,
    formData: FormData,
    options: RequestOptions & {
      onUploadProgress?: (progress: number) => void;
    } = {}
  ): Promise<ApiResponse<T>> {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
      timeout: options.timeout || API_CONSTANTS.TIMEOUT * 3,
      ...(options.onUploadProgress && {
        onUploadProgress: progressEvent => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          options.onUploadProgress!(progress);
        },
      }),
    };

    try {
      const response = await this.axiosInstance.request(config);

      return {
        data: response.data,
        success: true,
        message: response.data?.message,
      };
    } catch (error) {
      throw error as AxiosError;
    }
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health', { timeout: 5000, retry: false });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Method to update base URL if needed
  public updateBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Get current configuration
  public getConfig() {
    return {
      baseURL: this.axiosInstance.defaults.baseURL,
      timeout: this.axiosInstance.defaults.timeout,
      hasAuthToken: Boolean(this.authToken),
    };
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
