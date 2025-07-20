import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { Environment } from '../environment';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Tipos para las opciones de las peticiones
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

// Tipos para los métodos HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class ApiService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Environment.API_BASE_URL,
      timeout: 10000, // 10 segundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'User-Agent': 'ExpoApp/1.0.0',
      },
    });

    // Interceptor de request para logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Agregar headers adicionales para coincidir con Postman
        if (config.headers) {
          config.headers['Host'] = '192.168.0.16:7160';
          config.headers['Cache-Control'] = 'no-cache';
        }
        
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`🌐 [API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);
        console.log(`📦 [REQUEST DATA]`, config.data || 'No data');
        console.log(`📋 [REQUEST HEADERS]`, config.headers);
        
        // Verificar si el token está presente en los headers
        if (config.headers?.Authorization) {
          console.log(`🔑 [AUTH TOKEN] Token presente en la petición: ${config.headers.Authorization}`);
        } else {
          console.log(`⚠️ [AUTH TOKEN] No se encontró token en la petición`);
        }
        
        // Generar comando cURL equivalente
        const curlCommand = generateCurlCommand(config.method?.toUpperCase() || 'GET', fullUrl, config.headers, config.data);
        console.log(`🔧 [CURL COMMAND]`, curlCommand);
        
        if (Environment.DEBUG) {
          console.log(`${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        }
        return config;
      },
      (error) => {
        console.error('❌ [REQUEST ERROR]', error);
        if (Environment.DEBUG) {
          console.error('Request Error:', error);
        }
        return Promise.reject(error);
      }
    );

// Función helper para generar comando cURL
function generateCurlCommand(method: string, url: string, headers: any, data: any): string {
  let curl = `curl -X ${method}`;
  
  // Agregar headers
  if (headers) {
    Object.keys(headers).forEach(key => {
      if (headers[key]) {
        curl += ` -H "${key}: ${headers[key]}"`;
      }
    });
  }
  
  // Agregar data para POST/PUT/PATCH
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
    curl += ` -d '${jsonData}'`;
  }
  
  // Agregar URL
  curl += ` "${url}"`;
  
  return curl;
}

    // Interceptor de response para logging y manejo de errores
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ [API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
        console.log(`📥 [RESPONSE DATA]`, response.data);
        
        if (Environment.DEBUG) {
          console.log('API Response:', response.data);
        }
        return response;
      },
      (error: AxiosError) => {
        console.error(`❌ [API ERROR] ${error.response?.status || 'No Status'} ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`);
        console.error(`💥 [ERROR DATA]`, error.response?.data || error.message);
        return this.handleError(error);
      }
    );
  }

  // Método privado para manejar errores
  private handleError(error: AxiosError): Promise<never> {
    if (Environment.DEBUG) {
      console.error('API Error:', error);
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('La petición tardó demasiado tiempo');
    }

    if (!error.response) {
      throw new Error('Error de red: No se pudo conectar con el servidor');
    }

    const status = error.response.status;
    const data = error.response.data as any;
    
    // Si el servidor devuelve un mensaje específico, usarlo
    if (data?.message) {
      throw new Error(data.message);
    }

    // Mensajes por defecto según el código de estado
    switch (status) {
      case 400:
        throw new Error('Petición inválida');
      case 401:
        throw new Error('No autorizado');
      case 403:
        throw new Error('Acceso prohibido');
      case 404:
        throw new Error('Recurso no encontrado');
      case 500:
        throw new Error('Error interno del servidor');
      default:
        throw new Error(`Error del servidor: ${status}`);
    }
  }

  // Métodos públicos para cada tipo de petición HTTP
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint, {
        headers: options?.headers,
        timeout: options?.timeout,
      });
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, body, {
        headers: options?.headers,
        timeout: options?.timeout,
      });
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async put<T>(endpoint: string, body: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, body, {
        headers: options?.headers,
        timeout: options?.timeout,
      });
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(endpoint: string, body: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<T>(endpoint, body, {
        headers: options?.headers,
        timeout: options?.timeout,
      });
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, {
        headers: options?.headers,
        timeout: options?.timeout,
      });
      
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  // Método para agregar token de autenticación
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Método para remover token de autenticación
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  // Método para obtener la URL base actual
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }
}

// Exportar una instancia singleton del servicio
export const apiService = new ApiService();

// Exportar la clase para casos específicos donde se necesite múltiples instancias
export default ApiService;
