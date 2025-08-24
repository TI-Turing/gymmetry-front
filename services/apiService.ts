import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment } from '../environment';
import { logger } from '@/utils';
import type { ApiResponse as BackendApiResponse } from '@/dto/common/ApiResponse';

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class ApiService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Environment.API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'User-Agent': 'ExpoApp/1.0.0',
  // Azure Functions (API principal)
  'x-functions-key': Environment.API_MAIN_FUNCTIONS_KEY,
      },
    });

    this.axiosInstance.interceptors.request.use(
      async config => {
        if (config.headers) {
          // No enviar Authorization en login/refresh para evitar rechazos por token expirado
          const isAuthEndpoint =
            (config.url || '').includes('/auth/refresh-token') ||
            (config.url || '').includes('/auth/login');
          if (isAuthEndpoint) {
            delete (config.headers as any)['Authorization'];
            delete (config.headers as any)['authorization'];
          }
          // Extraer host dinámicamente de la URL base
          const baseUrl = config.baseURL || Environment.API_BASE_URL;
          try {
            const url = new URL(baseUrl);
            config.headers['Host'] = url.host;
          } catch {
            // Fallback si la URL no es válida
            config.headers['Host'] = 'localhost:7160';
          }
          config.headers['Cache-Control'] = 'no-cache';
          // Asegurar la clave de funciones para el API principal
          if (!config.headers['x-functions-key']) {
            config.headers['x-functions-key'] = Environment.API_MAIN_FUNCTIONS_KEY;
          }

          // Inyectar Authorization si no viene en el request y hay token guardado
          const hasAuthHeader =
            !!config.headers['Authorization'] || !!config.headers['authorization'];
          if (!hasAuthHeader && !isAuthEndpoint) {
            try {
              let token = await AsyncStorage.getItem('authToken');
              if (!token) {
                token = await AsyncStorage.getItem('@auth_token');
              }
              if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
              }
            } catch {
              // Ignorar errores de lectura de storage
            }
          }
        }

        const fullUrl = `${config.baseURL}${config.url}`;

        if (Environment.DEBUG) {
          const curlCommand = generateCurlCommand(
            (config.method?.toUpperCase() as HttpMethod) || 'GET',
            fullUrl,
            config.headers,
            config.data
          );
          logger.debug('📋 CURL del request:', curlCommand);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    function generateCurlCommand(
      method: HttpMethod,
      url: string,
      headers: any = {},
      data?: any
    ): string {
      let curlCommand = `curl -X ${method}`;
      Object.keys(headers || {}).forEach(key => {
        if (headers[key] && key !== 'common') {
          const isAuth = key.toLowerCase() === 'authorization';
          const headerValue = isAuth
            ? 'Bearer ****'
            : String(headers[key]).replace(/"/g, '\\"');
          curlCommand += ` ^
  -H "${key}: ${headerValue}"`;
        }
      });
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
        const escapedData = jsonData.replace(/"/g, '\\"');
        curlCommand += ` ^
  -d "${escapedData}"`;
        if (!headers['Content-Type'] && !headers['content-type']) {
          curlCommand += ` ^
  -H "Content-Type: application/json"`;
        }
      }
      // Agregar URL al final
      curlCommand += ` ^
  "${url}"`;
      return curlCommand;
    }

    // Interceptor de response para manejo automático de refresh token
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Si es un error 401 y no es el endpoint de refresh token ni login
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/refresh-token') &&
          !originalRequest.url?.includes('/auth/login')
        ) {
          if (this.isRefreshing) {
            // Si ya estamos refrescando, agregar a la cola
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.axiosInstance(originalRequest);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Intentar refrescar el token
            const { authService } = await import('./authService');
            const refreshed = await authService.refreshAuthToken();

            if (refreshed?.Success && refreshed.Data) {
              // Procesar cola de requests fallidos
              this.processQueue(null);
              // Leer y setear el nuevo token en defaults y en el request original
              try {
                const newToken = await AsyncStorage.getItem('authToken');
                if (newToken) {
                  this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                  if (!originalRequest.headers) originalRequest.headers = {};
                  // Evitar mezclar header previo; sobrescribir con el nuevo token
                  delete originalRequest.headers['authorization'];
                  delete originalRequest.headers['Authorization'];
                  originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                }
              } catch {
                // si falla la lectura, igual reintentamos
              }
              // Reintentar el request original
              return this.axiosInstance(originalRequest);
            } else {
              // Refresh falló, limpiar sesión y rechazar
              this.processQueue(new Error('Session expired'));
              await authService.logout();
              return Promise.reject(new Error('Session expired'));
            }
          } catch (refreshError) {
            // Error en el refresh, limpiar sesión
            this.processQueue(refreshError);
            const { authService } = await import('./authService');
            await authService.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return this.handleError(error);
      }
    );
  }

  // Helper: construir URL absoluta con baseURL + endpoint
  private buildFullUrl(endpoint: string): string {
    // Si ya es absoluta, regresar tal cual
    if (/^https?:\/\//i.test(endpoint)) return endpoint;
    const base = (this.axiosInstance.defaults.baseURL || '').replace(/\/+$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  // Helper: fusionar headers por defecto del axiosInstance con los pasados por options
  private mergeHeaders(extra?: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = {};
    const defaults: any = this.axiosInstance.defaults.headers as any;
    // headers comunes definidos en axios
    if (defaults && defaults.common) {
      for (const k of Object.keys(defaults.common)) {
        if (defaults.common[k] != null) merged[k] = String(defaults.common[k]);
      }
    }
    // Content-Type específico si existe en defaults
    if (defaults && defaults['Content-Type']) merged['Content-Type'] = String(defaults['Content-Type']);
    if (defaults && defaults['content-type']) merged['content-type'] = String(defaults['content-type']);
    // Asegurar algunos headers útiles
    merged['Accept'] = merged['Accept'] || '*/*';
    // Extra sobrescribe
    if (extra) {
      for (const k of Object.keys(extra)) {
        if (extra[k] != null) merged[k] = String(extra[k]);
      }
    }
    return merged;
  }

  // Nueva función pública: genera un comando curl para Windows (CMD) y lo retorna como string
  public generateWindowsCurl(
    method: HttpMethod,
    url: string,
    headers: Record<string, string> = {},
    data?: any
  ): string {
    let curlCommand = `curl -X ${method}`;
    Object.keys(headers || {}).forEach(key => {
      if (headers[key] && key !== 'common') {
        const headerValue = String(headers[key]).replace(/"/g, '\\"');
        curlCommand += ` ^\n  -H "${key}: ${headerValue}"`;
      }
    });
    if (data != null && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      const escapedData = jsonData.replace(/"/g, '\\"');
      curlCommand += ` ^\n  -d "${escapedData}"`;
      const hasContentType = Object.keys(headers).some(
        h => h.toLowerCase() === 'content-type'
      );
      if (!hasContentType) {
        curlCommand += ` ^\n  -H "Content-Type: application/json"`;
      }
    }
    curlCommand += ` ^\n  "${url}"`;
    return curlCommand;
  }

  // Método para procesar la cola de requests fallidos
  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  // Método privado para manejar errores
  private handleError(error: AxiosError): Promise<never> {
    if (Environment.DEBUG) {
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('La petición tardó demasiado tiempo');
    }

    if (!error.response) {
      throw new Error('Error de red: No se pudo conectar con el servidor');
    }

    const status = error.response.status;
    const data = error.response.data as any;

    // Si el servidor devuelve una respuesta con formato ApiResponse, preservarla
    if (
      data &&
      typeof data === 'object' &&
      typeof data.Success === 'boolean' &&
      typeof data.Message === 'string'
    ) {
      // Es una respuesta del servidor con formato ApiResponse, devolverla tal como está
      // En lugar de lanzar un error, rechazar con la respuesta completa
      return Promise.reject({
        isApiResponse: true,
        response: data,
      });
    }

    // Si el servidor devuelve un mensaje específico, usarlo (revisar diferentes formatos)
    if (data?.Message) {
      throw new Error(data.Message);
    }
    if (data?.message) {
      throw new Error(data.message);
    }
    if (data?.error) {
      throw new Error(data.error);
    }

    // Si hay errores de validación específicos
    if (data?.errors && typeof data.errors === 'object') {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError)) {
        throw new Error(firstError[0] as string);
      }
      throw new Error(firstError as string);
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
      case 422:
        throw new Error('Datos inválidos');
      case 500:
        throw new Error('Error interno del servidor');
      default:
        throw new Error(`Error del servidor: ${status}`);
    }
  }

  // Métodos públicos para cada tipo de petición HTTP
  async get<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
  // const __curl = this.generateWindowsCurl('GET', this.buildFullUrl(endpoint), this.mergeHeaders(options?.headers));
  // console.log(__curl);
      const response = await this.axiosInstance.get<BackendApiResponse<T>>(
        endpoint,
        {
          headers: options?.headers,
          timeout: options?.timeout,
        }
      );

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error: any) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      if (error?.isApiResponse) {
        return error.response;
      }
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
      //Show curl
      // const __curl = this.generateWindowsCurl('POST', this.buildFullUrl(endpoint), this.mergeHeaders(options?.headers), body);
      // console.log(__curl);
      const response = await this.axiosInstance.post<BackendApiResponse<T>>(
        endpoint,
        body,
        {
          headers: options?.headers,
          timeout: options?.timeout,
        }
      );

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error: any) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      if (error?.isApiResponse) {
        return error.response;
      }
      throw error;
    }
  }

  async put<T>(
    endpoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
  // const __curl = this.generateWindowsCurl('PUT', this.buildFullUrl(endpoint), this.mergeHeaders(options?.headers), body);
  // console.log(__curl);
      const response = await this.axiosInstance.put<BackendApiResponse<T>>(
        endpoint,
        body,
        {
          headers: options?.headers,
          timeout: options?.timeout,
        }
      );

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error: any) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      if (error?.isApiResponse) {
        return error.response;
      }
      throw error;
    }
  }

  async patch<T>(
    endpoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
  // const __curl = this.generateWindowsCurl('PATCH', this.buildFullUrl(endpoint), this.mergeHeaders(options?.headers), body);
  // console.log(__curl);
      const response = await this.axiosInstance.patch<BackendApiResponse<T>>(
        endpoint,
        body,
        {
          headers: options?.headers,
          timeout: options?.timeout,
        }
      );

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error: any) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      if (error?.isApiResponse) {
        return error.response;
      }
      throw error;
    }
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
  // const __curl = this.generateWindowsCurl('DELETE', this.buildFullUrl(endpoint), this.mergeHeaders(options?.headers));
  // console.log(__curl);
      const response = await this.axiosInstance.delete<BackendApiResponse<T>>(
        endpoint,
        {
          headers: options?.headers,
          timeout: options?.timeout,
        }
      );

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error: any) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      if (error?.isApiResponse) {
        return error.response;
      }
      throw error;
    }
  }

  // Método para agregar token de autenticación
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${token}`;
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

// Re-export del tipo para mantener compatibilidad con importaciones existentes en servicios
export type ApiResponse<T = any> = BackendApiResponse<T>;
