import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Environment } from '../environment';
import { logger } from '@/utils';
import type { ApiResponse as BackendApiResponse } from '@/dto/common/ApiResponse';

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

class ApiService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error?: unknown) => void;
  }[] = [];

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: Environment.API_BASE_URL,
      timeout: 12000, // ✅ Aumentado de 10s a 12s para manejar cold starts de AWS Lambda
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'User-Agent': 'ExpoApp/1.0.0',
        // ✅ AWS Lambda usa solo JWT en Authorization header (no function keys)
      },
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        if (config.headers) {
          // No enviar Authorization en login/refresh para evitar rechazos por token expirado
          const isAuthEndpoint =
            (config.url || '').includes('/auth/refresh-token') ||
            (config.url || '').includes('/auth/login');
          if (isAuthEndpoint) {
            const h = config.headers as Record<string, unknown>;
            delete h['Authorization'];
            delete h['authorization'];
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
          
          // ✅ AWS Lambda no requiere x-functions-key (eliminado)
          // La autenticación se maneja únicamente con JWT en Authorization header

          // Inyectar Authorization si no viene en el request y hay token guardado
          const hasAuthHeader =
            !!config.headers['Authorization'] ||
            !!config.headers['authorization'];
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
            (config.headers as Record<string, unknown>) || {},
            config.data as unknown
          );
          logger.debug('📋 CURL del request:', curlCommand);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    function generateCurlCommand(
      method: HttpMethod,
      url: string,
      headers: Record<string, unknown> = {},
      data?: unknown
    ): string {
      let curlCommand = `curl -X ${method}`;
      Object.keys(headers || {}).forEach((key) => {
        const value = headers[key];
        if (value && key !== 'common') {
          const isAuth = key.toLowerCase() === 'authorization';
          const headerValue = isAuth
            ? 'Bearer ****'
            : String(value).replace(/"/g, '\\"');
          curlCommand += ` ^\n  -H "${key}: ${headerValue}"`;
        }
      });
      if (data != null && ['POST', 'PUT', 'PATCH'].includes(method)) {
        const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
        const escapedData = jsonData.replace(/"/g, '\\"');
        curlCommand += ` ^\n  -d "${escapedData}"`;
        if (!headers['Content-Type'] && !headers['content-type']) {
          curlCommand += ` ^\n  -H "Content-Type: application/json"`;
        }
      }
      curlCommand += ` ^\n  "${url}"`;
      return curlCommand;
    }

    // Interceptor de response para manejo automático de refresh token
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = (error.config || {}) as AxiosRequestConfig & {
          _retry?: boolean;
          url?: string;
          headers?: Record<string, unknown>;
        };

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
              .catch((err) => {
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
                  this.axiosInstance.defaults.headers.common['Authorization'] =
                    `Bearer ${newToken}`;
                  if (!originalRequest.headers) originalRequest.headers = {};
                  // Evitar mezclar header previo; sobrescribir con el nuevo token
                  delete originalRequest.headers['authorization'];
                  delete originalRequest.headers['Authorization'];
                  originalRequest.headers['Authorization'] =
                    `Bearer ${newToken}`;
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

  /**
   * ✅ Detecta si el error es por cold start de AWS Lambda
   * @param error Error de Axios
   * @returns true si es cold start
   */
  private isColdStartError(error: AxiosError): boolean {
    // Timeout o 503 pueden indicar cold start
    if (error.code === 'ECONNABORTED' || error.response?.status === 503) {
      return true;
    }

    // Lambda devuelve 502/504 durante cold start a veces
    if (error.response?.status === 502 || error.response?.status === 504) {
      return true;
    }

    return false;
  }

  /**
   * ✅ Ejecuta request con retry automático en caso de cold start
   * @param config Configuración de Axios
   * @param retryCount Intentos realizados
   * @returns Response de Axios
   */
  private async requestWithRetry(
    config: AxiosRequestConfig,
    retryCount = 0
  ): Promise<AxiosResponse> {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 segundo

    try {
      return await this.axiosInstance.request(config);
    } catch (error) {
      const axiosError = error as AxiosError;

      // Si es cold start y no hemos alcanzado el límite de reintentos
      if (this.isColdStartError(axiosError) && retryCount < MAX_RETRIES) {
        logger.warn(
          `⚠️ Cold start detected (attempt ${retryCount + 1}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY}ms...`
        );

        // Esperar antes de reintentar
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

        // Reintentar con timeout más largo
        const retryConfig: AxiosRequestConfig = {
          ...config,
          timeout: 15000, // 15 segundos para cold start
        };

        return this.requestWithRetry(retryConfig, retryCount + 1);
      }

      // Si no es cold start o ya reintentamos lo suficiente, lanzar error
      throw error;
    }
  }

  // Helper: construir URL absoluta con baseURL + endpoint
  private buildFullUrl(endpoint: string): string {
    // Si ya es absoluta, regresar tal cual
    if (/^https?:\/\//i.test(endpoint)) return endpoint;
    const base = (this.axiosInstance.defaults.baseURL || '').replace(
      /\/+$/,
      ''
    );
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  // ❌ DEPRECATED: AWS Lambda no usa function keys (eliminado)
  // private addCodeParam(endpoint: string): string {
  //   const key = Environment.API_MAIN_FUNCTIONS_KEY;
  //   if (!key) return endpoint;
  //   const separator = endpoint.includes('?') ? '&' : '?';
  //   return `${endpoint}${separator}code=${encodeURIComponent(key)}`;
  // }

  // Helper: fusionar headers por defecto del axiosInstance con los pasados por options
  private mergeHeaders(extra?: Record<string, string>): Record<string, string> {
    const merged: Record<string, string> = {};
    const defaultsUnknown = this.axiosInstance.defaults.headers as unknown;
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === 'object' && v !== null;

    // headers comunes definidos en axios
    if (isRecord(defaultsUnknown)) {
      const common = defaultsUnknown['common'];
      if (isRecord(common)) {
        for (const k of Object.keys(common)) {
          const val = common[k];
          if (val != null) merged[k] = String(val);
        }
      }
      const ct = defaultsUnknown['Content-Type'];
      if (typeof ct === 'string') merged['Content-Type'] = ct;
      const ct2 = defaultsUnknown['content-type'];
      if (typeof ct2 === 'string') merged['content-type'] = ct2;
    }
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
    data?: unknown
  ): string {
    let curlCommand = `curl -X ${method}`;
    Object.keys(headers || {}).forEach((key) => {
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
        (h) => h.toLowerCase() === 'content-type'
      );
      if (!hasContentType) {
        curlCommand += ` ^\n  -H "Content-Type: application/json"`;
      }
    }
    curlCommand += ` ^\n  "${url}"`;
    return curlCommand;
  }

  // Método para procesar la cola de requests fallidos
  private processQueue(error: unknown) {
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
      // espacio reservado para logs detallados si se requiere
    }

    if (error.code === 'ECONNABORTED') {
      throw new Error('La petición tardó demasiado tiempo');
    }

    if (!error.response) {
      throw new Error('Error de red: No se pudo conectar con el servidor');
    }

    const status = error.response.status;
    const data: unknown = error.response.data as unknown;

    // Si el servidor devuelve una respuesta con formato ApiResponse, preservarla
    const isRecord = (v: unknown): v is Record<string, unknown> =>
      typeof v === 'object' && v !== null;
    if (
      isRecord(data) &&
      typeof data['Success'] === 'boolean' &&
      typeof data['Message'] === 'string'
    ) {
      // Es una respuesta del servidor con formato ApiResponse, devolverla tal como está
      // En lugar de lanzar un error, rechazar con la respuesta completa
      return Promise.reject({
        isApiResponse: true,
        response: data as unknown as BackendApiResponse<unknown>,
      });
    }

    // Si el servidor devuelve un mensaje específico, usarlo (revisar diferentes formatos)
    if (isRecord(data)) {
      const m1 = data['Message'];
      if (typeof m1 === 'string') throw new Error(m1);
      const m2 = data['message'];
      if (typeof m2 === 'string') throw new Error(m2);
      const m3 = data['error'];
      if (typeof m3 === 'string') throw new Error(m3);
    }

    // Si hay errores de validación específicos
    if (isRecord(data) && isRecord(data['errors'])) {
      const errorsObj = data['errors'] as Record<string, unknown>;
      const firstError = Object.values(errorsObj)[0];
      if (Array.isArray(firstError)) {
        const first = firstError[0];
        if (typeof first === 'string') throw new Error(first);
      }
      if (typeof firstError === 'string') throw new Error(firstError);
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
      // ✅ AWS Lambda no requiere code param (eliminado addCodeParam)
      const response = await this.requestWithRetry({
        method: 'GET',
        url: endpoint,
        headers: options?.headers,
        timeout: options?.timeout,
        signal: options?.signal,
      }) as AxiosResponse<BackendApiResponse<T>>;

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      const err = error as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null;
      if (isRecord(err) && err['isApiResponse'] === true && 'response' in err) {
        const resp = err['response'] as BackendApiResponse<unknown>;
        return resp as BackendApiResponse<T>;
      }
      throw err;
    }
  }

  async post<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
      // ✅ AWS Lambda no requiere code param
      const response = await this.requestWithRetry({
        method: 'POST',
        url: endpoint,
        data: body,
        headers: options?.headers,
        timeout: options?.timeout,
        signal: options?.signal,
      }) as AxiosResponse<BackendApiResponse<T>>;

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      const err = error as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null;
      if (isRecord(err) && err['isApiResponse'] === true && 'response' in err) {
        const resp = err['response'] as BackendApiResponse<unknown>;
        return resp as BackendApiResponse<T>;
      }
      throw err;
    }
  }

  async put<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
      // ✅ AWS Lambda no requiere code param
      const response = await this.requestWithRetry({
        method: 'PUT',
        url: endpoint,
        data: body,
        headers: options?.headers,
        timeout: options?.timeout,
        signal: options?.signal,
      }) as AxiosResponse<BackendApiResponse<T>>;

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      const err = error as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null;
      if (isRecord(err) && err['isApiResponse'] === true && 'response' in err) {
        const resp = err['response'] as BackendApiResponse<unknown>;
        return resp as BackendApiResponse<T>;
      }
      throw err;
    }
  }

  async patch<T>(
    endpoint: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
      // ✅ AWS Lambda no requiere code param
      const response = await this.requestWithRetry({
        method: 'PATCH',
        url: endpoint,
        data: body,
        headers: options?.headers,
        timeout: options?.timeout,
        signal: options?.signal,
      }) as AxiosResponse<BackendApiResponse<T>>;

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      const err = error as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null;
      if (isRecord(err) && err['isApiResponse'] === true && 'response' in err) {
        const resp = err['response'] as BackendApiResponse<unknown>;
        return resp as BackendApiResponse<T>;
      }
      throw err;
    }
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<BackendApiResponse<T>> {
    try {
      // ✅ AWS Lambda no requiere code param
      const response = await this.requestWithRetry({
        method: 'DELETE',
        url: endpoint,
        headers: options?.headers,
        timeout: options?.timeout,
        signal: options?.signal,
      }) as AxiosResponse<BackendApiResponse<T>>;

      // El backend ya devuelve la estructura ApiResponse correcta
      return response.data;
    } catch (error) {
      // Si es una respuesta del servidor con formato ApiResponse, devolverla
      const err = error as unknown;
      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === 'object' && v !== null;
      if (isRecord(err) && err['isApiResponse'] === true && 'response' in err) {
        const resp = err['response'] as BackendApiResponse<unknown>;
        return resp as BackendApiResponse<T>;
      }
      throw err;
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

// Use ApiResponse de dto/common si se requiere en servicios específicos
