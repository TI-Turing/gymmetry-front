// Configuration using environment variables
// Make sure to load the appropriate .env file before importing this

// Tipos de entorno permitidos
type EnvironmentType = 'local' | 'development' | 'production';

// Leer el entorno desde variable de entorno o usar default
const getEnvironmentFromProcess = (): EnvironmentType => {
  const envVar = process.env.EXPO_PUBLIC_ENV || process.env.NODE_ENV;
  console.log('Current Environment:', envVar);
  switch (envVar) {
    case 'local':
    case 'development':
    case 'production':
      return envVar as EnvironmentType;
    default:
      return 'local'; // Default environment
  }
};

// Configuration object using environment variables
const createConfig = () => {
  // En Expo, las variables deben tener prefijo EXPO_PUBLIC_ para estar disponibles en el cliente
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:7160/api';
  const catalogsApiBaseUrl = process.env.EXPO_PUBLIC_CATALOGS_API_BASE_URL || process.env.CATALOGS_API_BASE_URL || 'https://your-catalogs-api-url.com/api';
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || process.env.ENVIRONMENT || 'local';
  const debug = (process.env.EXPO_PUBLIC_DEBUG || process.env.DEBUG) === 'true';
  const apiFunctionsKey = process.env.EXPO_PUBLIC_API_FUNCTIONS_KEY || process.env.API_FUNCTIONS_KEY || '';
  const apiMainFunctionsKey = process.env.EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY || process.env.API_MAIN_FUNCTIONS_KEY || '';
  
  console.log('Environment Variables Debug:');
  console.log('- EXPO_PUBLIC_API_BASE_URL:', process.env.EXPO_PUBLIC_API_BASE_URL);
  console.log('- API_BASE_URL:', process.env.API_BASE_URL);
  console.log('- Final API Base URL:', apiBaseUrl);
  console.log('- EXPO_PUBLIC_API_FUNCTIONS_KEY:', process.env.EXPO_PUBLIC_API_FUNCTIONS_KEY);
  console.log('- API_FUNCTIONS_KEY:', process.env.API_FUNCTIONS_KEY);
  console.log('- Final API Functions Key:', apiFunctionsKey);
  
  return {
    API_BASE_URL: apiBaseUrl,
    CATALOGS_API_BASE_URL: catalogsApiBaseUrl,
    ENVIRONMENT: environment,
    DEBUG: debug,
    API_FUNCTIONS_KEY: apiFunctionsKey,
    API_MAIN_FUNCTIONS_KEY: apiMainFunctionsKey,
  };
};

// Seleccionar el entorno actual
const CURRENT_ENV: EnvironmentType = getEnvironmentFromProcess();

// Create and export the configuration
const config = createConfig();

export const Environment = config;

// Tipo para las configuraciones
export interface Config {
  API_BASE_URL: string;
  CATALOGS_API_BASE_URL: string;
  ENVIRONMENT: string;
  DEBUG: boolean;
  API_FUNCTIONS_KEY: string;
  API_MAIN_FUNCTIONS_KEY: string;
}
