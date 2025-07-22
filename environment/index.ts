// Configuration using environment variables
// Make sure to load the appropriate .env file before importing this

// Tipos de entorno permitidos
type EnvironmentType = 'local' | 'development' | 'production';

// Leer el entorno desde variable de entorno o usar default
const getEnvironmentFromProcess = (): EnvironmentType => {
  const envVar = process.env.EXPO_PUBLIC_ENV || process.env.NODE_ENV;
  
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
  return {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:7160/api',
    CATALOGS_API_BASE_URL: process.env.CATALOGS_API_BASE_URL || 'https://your-catalogs-api-url.com/api',
    ENVIRONMENT: process.env.ENVIRONMENT || 'local',
    DEBUG: process.env.DEBUG === 'true',
    API_FUNCTIONS_KEY: process.env.API_FUNCTIONS_KEY || '',
    API_MAIN_FUNCTIONS_KEY: process.env.API_MAIN_FUNCTIONS_KEY || '',
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
