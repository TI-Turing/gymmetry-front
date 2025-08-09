import axios, { AxiosInstance } from 'axios';
import { Environment } from '@/environment';
import { userSessionService } from './userSessionService';
import {
  Gender,
  Country,
  Region,
  City,
  EPS,
  DocumentType,
} from '../dto/common';

class CatalogService {
  private catalogsAPI: AxiosInstance;
  // Caché en memoria por clave (endpoint+parámetros)
  private cache = new Map<string, { timestamp: number; data: any }>();
  private inFlight = new Map<string, Promise<any>>();
  private readonly TTL_MS = 10 * 60 * 1000; // 10 minutos

  constructor() {
    this.catalogsAPI = axios.create({
      baseURL: Environment.CATALOGS_API_BASE_URL,
      headers: {
        'x-functions-key': Environment.API_FUNCTIONS_KEY,
        'Content-Type': 'application/json',
      },
    });

    this.catalogsAPI.interceptors.request.use(
      config => {
        if (!config.headers) {
          config.headers = {} as any;
        }

        if (!config.headers['x-functions-key']) {
          config.headers['x-functions-key'] = Environment.API_FUNCTIONS_KEY;
        }

        if (Environment.DEBUG) {
          const fullUrl = `${config.baseURL}${config.url}`;
          const curlCommand = this.generateCurlCommand(
            config.method?.toUpperCase() || 'GET',
            fullUrl,
            config.headers,
            config.data
          );
        }

        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    this.catalogsAPI.interceptors.response.use(
      response => response,
      error => {
        // Error logging para depuración en desarrollo
        if (__DEV__) {
          // En producción usaríamos un servicio de logging como Sentry
          // logError('CATALOG API ERROR', error);
        }
        return Promise.reject(error);
      }
    );
  }

  private getFromCache<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.TTL_MS) {
      return entry.data as T;
    }
    // Expirado
    if (entry) this.cache.delete(key);
    return undefined;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { timestamp: Date.now(), data });
  }

  private async getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.getFromCache<T>(key);
    if (cached !== undefined) return cached;

    const ongoing = this.inFlight.get(key) as Promise<T> | undefined;
    if (ongoing) return ongoing;

    const promise = (async () => {
      try {
        const data = await fetcher();
        this.setCache(key, data);
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  private generateCurlCommand(
    method: string,
    url: string,
    headers: any = {},
    data?: any
  ): string {
    let curlCommand = `curl -X ${method}`;

    Object.keys(headers || {}).forEach(key => {
      if (headers[key] && key !== 'common') {
        const headerValue = String(headers[key]).replace(/"/g, '\\"');
        curlCommand += ` ^
  -H "${key}: ${headerValue}"`;
      }
    });

    if (data) {
      const jsonData = JSON.stringify(data).replace(/"/g, '\\"');
      curlCommand += ` ^
  -d "${jsonData}"`;
    }

    curlCommand += ` ^
  "${url}"`;

    return curlCommand;
  }

  private sortByName<T extends { Nombre: string }>(items: T[]): T[] {
    return items.sort((a, b) =>
      a.Nombre.localeCompare(b.Nombre, 'es', { sensitivity: 'base' })
    );
  }

  async getGenders(): Promise<Gender[]> {
    const key = 'genders';
    return this.getOrFetch<Gender[]>(key, async () => {
      try {
        const response = await this.catalogsAPI.get<Gender[]>('/generos');
        const genders = response.data || [];
        return this.sortByName(genders);
      } catch (error) {
        throw error;
      }
    });
  }

  async getCountries(): Promise<Country[]> {
    const key = 'countries';
    return this.getOrFetch<Country[]>(key, async () => {
      try {
        const response = await this.catalogsAPI.get<Country[]>('/paises');
        const countries = response.data || [];
        return this.sortByName(countries);
      } catch (error) {
        throw error;
      }
    });
  }

  async getRegionsByCountry(countryId: string): Promise<Region[]> {
    const key = `regions:${countryId}`;
    return this.getOrFetch<Region[]>(key, async () => {
      try {
        const response = await this.catalogsAPI.get<Region[]>(
          `/regiones?paisId=${countryId}`
        );
        const regions = response.data || [];
        return this.sortByName(regions);
      } catch (error) {
        throw error;
      }
    });
  }

  async getCitiesByRegion(regionId: string): Promise<City[]> {
    const key = `cities:${regionId}`;
    return this.getOrFetch<City[]>(key, async () => {
      try {
        const response = await this.catalogsAPI.get<City[]>(
          `/ciudades?regionId=${regionId}`
        );
        const cities = response.data || [];
        return this.sortByName(cities);
      } catch (error) {
        throw error;
      }
    });
  }

  async getEPS(): Promise<EPS[]> {
    const key = 'eps';
    return this.getOrFetch<EPS[]>(key, async () => {
      try {
        const response = await this.catalogsAPI.get<EPS[]>('/eps');
        const epsOptions = response.data || [];
        return this.sortByName(epsOptions);
      } catch (error) {
        throw error;
      }
    });
  }

  async getDocumentTypes(countryId?: string): Promise<DocumentType[]> {
    // Si no se proporciona countryId, usar el país del usuario de la sesión
    const finalCountryId = countryId || userSessionService.getUserCountryId();
    const key = `documentTypes:${finalCountryId ?? 'all'}`;
    return this.getOrFetch<DocumentType[]>(key, async () => {
      try {
        const url = finalCountryId
          ? `/tiposdocumento?paisId=${finalCountryId}`
          : '/tiposdocumento';
        const response = await this.catalogsAPI.get<DocumentType[]>(url);
        const documentTypes = response.data || [];
        return this.sortByName(documentTypes);
      } catch (error) {
        throw error;
      }
    });
  }

  async getDocumentTypesByCountry(countryId?: string): Promise<DocumentType[]> {
    return this.getDocumentTypes(countryId);
  }

  // Métodos placeholder para servicios específicos
  async getAllDiets(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllEmployeeRegisterDaily(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllEmployeeTypes(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllEmployeeUsers(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllEquipment(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllExercises(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllFeeds(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllGymImages(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }

  async getAllPaymentMethods(): Promise<any[]> {
    // Placeholder - implementar cuando el endpoint esté disponible
    return [];
  }
}

export const catalogService = new CatalogService();
