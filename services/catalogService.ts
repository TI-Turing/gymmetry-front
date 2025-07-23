import axios, { AxiosInstance } from 'axios';
import { Environment } from '@/environment';
import { 
  Gender,
  Country,
  Region,
  City,
  EPS,
  DocumentType
} from '../dto/common';

class CatalogService {
  private catalogsAPI: AxiosInstance;
  
  constructor() {
    this.catalogsAPI = axios.create({
      baseURL: Environment.CATALOGS_API_BASE_URL,
      headers: {
        'x-functions-key': Environment.API_FUNCTIONS_KEY,
        'Content-Type': 'application/json',
      },
    });

    this.catalogsAPI.interceptors.request.use(
      (config) => {
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
      (error) => {
        console.error('❌ [CATALOG REQUEST ERROR]', error);
        return Promise.reject(error);
      }
    );

    this.catalogsAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error(`❌ [CATALOG API ERROR] ${error.response?.status || 'No Status'} ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`);
        console.error(`💥 [CATALOG ERROR DATA]`, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  private generateCurlCommand(method: string, url: string, headers: any = {}, data?: any): string {
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
    return items.sort((a, b) => a.Nombre.localeCompare(b.Nombre, 'es', { sensitivity: 'base' }));
  }
  
  async getGenders(): Promise<Gender[]> {
    try {
      const response = await this.catalogsAPI.get<Gender[]>('/generos');
      const genders = response.data || [];
      return this.sortByName(genders);
    } catch (error) {
      console.error('Error fetching genders:', error);
      throw error;
    }
  }

  async getCountries(): Promise<Country[]> {
    try {
      const response = await this.catalogsAPI.get<Country[]>('/paises');
      const countries = response.data || [];
      return this.sortByName(countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }

  async getRegionsByCountry(countryId: string): Promise<Region[]> {
    try {
      const response = await this.catalogsAPI.get<Region[]>(`/regiones/${countryId}`);
      const regions = response.data || [];
      return this.sortByName(regions);
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  }

  async getCitiesByRegion(regionId: string): Promise<City[]> {
    try {
      const response = await this.catalogsAPI.get<City[]>(`/ciudades/${regionId}`);
      const cities = response.data || [];
      return this.sortByName(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }
  }

  async getEPS(): Promise<EPS[]> {
    try {
      const response = await this.catalogsAPI.get<EPS[]>('/eps');
      const epsOptions = response.data || [];
      return this.sortByName(epsOptions);
    } catch (error) {
      console.error('Error fetching EPS:', error);
      throw error;
    }
  }

  async getDocumentTypes(countryId?: string): Promise<DocumentType[]> {
    try {
      const url = countryId ? `/tipos-documento/${countryId}` : '/tipos-documento';
      const response = await this.catalogsAPI.get<DocumentType[]>(url);
      const documentTypes = response.data || [];
      return this.sortByName(documentTypes);
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  }

  async getDocumentTypesByCountry(countryId: string): Promise<DocumentType[]> {
    return this.getDocumentTypes(countryId);
  }
}

export const catalogService = new CatalogService();
