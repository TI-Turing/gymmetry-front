import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_COUNTRY_ID_KEY = '@user_country_id';
const USER_COUNTRY_DATA_KEY = '@user_country_data';

interface UserCountryData {
  id: string;
  name: string;
  code: string;
  detectedAt: number;
}

class UserSessionService {
  private static instance: UserSessionService;
  private userCountryId: string | null = null;
  private userCountryData: UserCountryData | null = null;

  static getInstance(): UserSessionService {
    if (!UserSessionService.instance) {
      UserSessionService.instance = new UserSessionService();
    }
    return UserSessionService.instance;
  }

  async initializeUserCountry(): Promise<void> {
    try {
      // Cargar país guardado de la sesión anterior
      const savedCountryData = await AsyncStorage.getItem(USER_COUNTRY_DATA_KEY);
      if (savedCountryData) {
        this.userCountryData = JSON.parse(savedCountryData);
        this.userCountryId = this.userCountryData?.id || null;
        
        // Verificar si la detección es reciente (menos de 24 horas)
        const isRecent = this.userCountryData && (Date.now() - this.userCountryData.detectedAt < 24 * 60 * 60 * 1000);
        if (isRecent && this.userCountryData) {
          console.log(`🌍 País cargado de sesión: ${this.userCountryData.name} (ID: ${this.userCountryId})`);
          return;
        }
      }

      // Si no hay datos guardados o son antiguos, detectar nuevamente
      await this.detectAndSaveUserCountry();
    } catch (error) {
      console.error('❌ Error inicializando país del usuario:', error);
    }
  }

  async detectAndSaveUserCountry(): Promise<void> {
    try {
      // Detectar país actual del usuario
      const detectedCountry = await this.detectUserCountry();
      if (!detectedCountry) {
        console.log('⚠️ No se pudo detectar el país del usuario');
        return;
      }

      // Obtener lista de países del catálogo
      const { catalogService } = await import('./catalogService');
      const countries = await catalogService.getCountries();

      // Buscar el país en la lista del catálogo
      const matchedCountry = this.findCountryInCatalog(detectedCountry, countries);
      if (!matchedCountry) {
        console.log(`⚠️ País detectado "${detectedCountry.name}" no encontrado en catálogo`);
        return;
      }

      // Guardar en memoria y AsyncStorage
      this.userCountryData = {
        id: matchedCountry.Id,
        name: matchedCountry.Nombre,
        code: detectedCountry.code || '',
        detectedAt: Date.now()
      };
      this.userCountryId = matchedCountry.Id;

      await AsyncStorage.setItem(USER_COUNTRY_DATA_KEY, JSON.stringify(this.userCountryData));
      if (this.userCountryId) {
        await AsyncStorage.setItem(USER_COUNTRY_ID_KEY, this.userCountryId);
      }

      console.log(`✅ País detectado y guardado: ${this.userCountryData.name} (ID: ${this.userCountryId})`);
    } catch (error) {
      console.error('❌ Error detectando y guardando país:', error);
    }
  }

  private async detectUserCountry(): Promise<{ name: string; code: string } | null> {
    try {
      // Método 1: Detección por timezone
      const timezoneCountry = this.getCountryFromTimezone();
      if (timezoneCountry) {
        return timezoneCountry;
      }

      // Método 2: Detección por IP como fallback
      const ipCountry = await this.getCountryFromIP();
      if (ipCountry) {
        return ipCountry;
      }

      return null;
    } catch (error) {
      console.error('Error en detección de país:', error);
      return null;
    }
  }

  private getCountryFromTimezone(): { name: string; code: string } | null {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = typeof navigator !== 'undefined' ? navigator.language : 'es-ES';
      
      const timezoneToCountry: Record<string, { code: string; name: string }> = {
        'America/Bogota': { code: 'CO', name: 'Colombia' },
        'America/Mexico_City': { code: 'MX', name: 'México' },
        'America/New_York': { code: 'US', name: 'Estados Unidos' },
        'America/Los_Angeles': { code: 'US', name: 'Estados Unidos' },
        'America/Argentina/Buenos_Aires': { code: 'AR', name: 'Argentina' },
        'America/Sao_Paulo': { code: 'BR', name: 'Brasil' },
        'America/Santiago': { code: 'CL', name: 'Chile' },
        'America/Lima': { code: 'PE', name: 'Perú' },
        'Europe/Madrid': { code: 'ES', name: 'España' },
      };

      const countryInfo = timezoneToCountry[timezone];
      if (countryInfo) {
        return countryInfo;
      }

      // Extraer del locale como fallback
      const localeCountry = locale.split('-')[1];
      if (localeCountry) {
        return {
          code: localeCountry,
          name: this.getCountryNameFromCode(localeCountry)
        };
      }
    } catch (error) {
      console.error('Error en detección por timezone:', error);
    }
    return null;
  }

  private async getCountryFromIP(): Promise<{ name: string; code: string } | null> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        name: data.country_name,
        code: data.country_code
      };
    } catch (error) {
      console.error('Error en detección por IP:', error);
      return null;
    }
  }

  private findCountryInCatalog(detectedCountry: { name: string; code: string }, catalogCountries: any[]) {
    // Buscar por código ISO primero
    if (detectedCountry.code) {
      const byCode = catalogCountries.find(country => 
        country.CodigoISO?.toUpperCase() === detectedCountry.code.toUpperCase()
      );
      if (byCode) return byCode;
    }

    // Buscar por nombre (coincidencia exacta)
    const byExactName = catalogCountries.find(country => 
      country.Nombre.toLowerCase() === detectedCountry.name.toLowerCase()
    );
    if (byExactName) return byExactName;

    // Buscar por nombre (coincidencia parcial)
    const byPartialName = catalogCountries.find(country => 
      country.Nombre.toLowerCase().includes(detectedCountry.name.toLowerCase()) ||
      detectedCountry.name.toLowerCase().includes(country.Nombre.toLowerCase())
    );
    
    return byPartialName;
  }

  private getCountryNameFromCode(code: string): string {
    const countryMap: Record<string, string> = {
      'CO': 'Colombia',
      'US': 'Estados Unidos',
      'MX': 'México',
      'AR': 'Argentina',
      'BR': 'Brasil',
      'CL': 'Chile',
      'PE': 'Perú',
      'EC': 'Ecuador',
      'VE': 'Venezuela',
      'ES': 'España',
    };
    return countryMap[code] || code;
  }

  // Métodos públicos para acceder al país del usuario
  getUserCountryId(): string | null {
    return this.userCountryId;
  }

  getUserCountryData(): UserCountryData | null {
    return this.userCountryData;
  }

  async clearUserCountry(): Promise<void> {
    this.userCountryId = null;
    this.userCountryData = null;
    await AsyncStorage.removeItem(USER_COUNTRY_ID_KEY);
    await AsyncStorage.removeItem(USER_COUNTRY_DATA_KEY);
  }

  // Método para forzar re-detección
  async refreshUserCountry(): Promise<void> {
    await this.clearUserCountry();
    await this.detectAndSaveUserCountry();
  }
}

export const userSessionService = UserSessionService.getInstance();
