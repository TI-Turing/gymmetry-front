import axios, { AxiosInstance } from 'axios';
import { Environment } from '@/environment';
import { apiService } from './apiService';
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
    // Crear una instancia específica para catálogos que use la misma base del apiService
    this.catalogsAPI = axios.create({
      baseURL: Environment.CATALOGS_API_BASE_URL,
      headers: {
        'x-functions-key': Environment.API_FUNCTIONS_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Agregar los mismos interceptors que el apiService para logging de cURL
    this.catalogsAPI.interceptors.request.use(
      (config) => {
        // Asegurarse de que el header x-functions-key esté presente
        if (!config.headers) {
          config.headers = {} as any;
        }
        
        // Forzar el header si no está presente
        if (!config.headers['x-functions-key']) {
          config.headers['x-functions-key'] = Environment.API_FUNCTIONS_KEY;
        }

        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`🌐 [CATALOG API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);
        console.log(`📦 [CATALOG REQUEST DATA]`, config.data || 'No data');
        console.log(`📋 [CATALOG REQUEST HEADERS]`, config.headers);
        
        // Verificar específicamente la x-functions-key
        if (config.headers && config.headers['x-functions-key']) {
          console.log(`🔑 [CATALOG API KEY] x-functions-key presente: ${config.headers['x-functions-key']}`);
        } else {
          console.log(`⚠️ [CATALOG API KEY] x-functions-key NO encontrada en headers`);
          console.log(`🔍 [CATALOG ENV DEBUG] Environment.API_FUNCTIONS_KEY:`, Environment.API_FUNCTIONS_KEY);
        }
        
        // Generar y mostrar comando cURL equivalente
        const curlCommand = this.generateCurlCommand(
          config.method?.toUpperCase() || 'GET',
          fullUrl,
          config.headers,
          config.data
        );
        console.log('================== CATALOG CURL REQUEST ==================');
        console.log(curlCommand);
        console.log('================ END CATALOG CURL REQUEST ================');
        
        return config;
      },
      (error) => {
        console.error('❌ [CATALOG REQUEST ERROR]', error);
        return Promise.reject(error);
      }
    );

    this.catalogsAPI.interceptors.response.use(
      (response) => {
        console.log(`✅ [CATALOG API RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`);
        console.log(`📥 [CATALOG RESPONSE DATA]`, response.data);
        return response;
      },
      (error) => {
        console.error(`❌ [CATALOG API ERROR] ${error.response?.status || 'No Status'} ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`);
        console.error(`💥 [CATALOG ERROR DATA]`, error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Genera un comando cURL para peticiones de catálogos (formato Windows)
   */
  private generateCurlCommand(method: string, url: string, headers: any = {}, data?: any): string {
    let curlCommand = `curl -X ${method}`;
    
    // Agregar headers (formato Windows con comillas dobles)
    Object.keys(headers || {}).forEach(key => {
      if (headers[key] && key !== 'common') {
        const headerValue = String(headers[key]).replace(/"/g, '\\"');
        curlCommand += ` ^
  -H "${key}: ${headerValue}"`;
      }
    });
    
    // Agregar datos si existen (para POST, PUT, PATCH)
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const jsonData = typeof data === 'string' ? data : JSON.stringify(data);
      const escapedData = jsonData.replace(/"/g, '\\"');
      curlCommand += ` ^
  -d "${escapedData}"`;
      
      // Agregar Content-Type si no está presente
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
  
  /**
   * Ordena un array de objetos por el campo Nombre alfabéticamente
   */
  private sortByName<T extends { Nombre: string }>(items: T[]): T[] {
    return items.sort((a, b) => a.Nombre.localeCompare(b.Nombre, 'es', { sensitivity: 'base' }));
  }
  
  /**
   * Obtiene la lista de géneros ordenada alfabéticamente
   */
  async getGenders(): Promise<Gender[]> {
    try {
      const response = await this.catalogsAPI.get<Gender[]>('/generos');
      const genders = response.data || [];
      return this.sortByName(genders);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo géneros:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de países ordenada alfabéticamente
   */
  async getCountries(): Promise<Country[]> {
    try {
      const response = await this.catalogsAPI.get<Country[]>('/paises');
      const countries = response.data || [];
      return this.sortByName(countries);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo países:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de tipos de documento para un país ordenada alfabéticamente
   */
  async getDocumentTypes(paisId: string): Promise<DocumentType[]> {
    try {
      const response = await this.catalogsAPI.get<DocumentType[]>(`/tiposdocumento?paisId=${paisId}`);
      const documentTypes = response.data || [];
      return this.sortByName(documentTypes);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo tipos de documento:', error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de EPS ordenada alfabéticamente
   */
  async getEPS(): Promise<EPS[]> {
    try {
      const response = await this.catalogsAPI.get<EPS[]>('/eps');
      const eps = response.data || [];
      return this.sortByName(eps);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo EPS:', error);
      throw error;
    }
  }

  /**
   * Obtiene las regiones filtradas por país ID ordenadas alfabéticamente
   */
  async getRegionsByCountry(paisId: string): Promise<Region[]> {
    try {
      const response = await this.catalogsAPI.get<Region[]>(`/regiones?paisId=${paisId}`);
      const regions = response.data || [];
      return this.sortByName(regions);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo regiones:', error);
      throw error;
    }
  }

  /**
   * Obtiene las ciudades filtradas por región ID ordenadas alfabéticamente
   */
  async getCitiesByRegion(regionId: string): Promise<City[]> {
    try {
      const response = await this.catalogsAPI.get<City[]>(`/ciudades?regionId=${regionId}`);
      const cities = response.data || [];
      return this.sortByName(cities);
    } catch (error) {
      console.error('❌ [CATALOG SERVICE] Error obteniendo ciudades:', error);
      throw error;
    }
  }

  /**
   * Obtiene el ID de Colombia para usar como país por defecto
   */
  getColombiaId(): string {
    return '01B4E9D1-A84E-41C9-8768-253209225A21';
  }
}

export const catalogService = new CatalogService();
export default catalogService;
