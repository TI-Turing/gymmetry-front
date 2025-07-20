import { config as localConfig } from './local';
import { config as devConfig } from './dev';
import { config as prodConfig } from './prod';

// Tipos de entorno permitidos
type EnvironmentType = 'local' | 'development' | 'production';

// Cambia este valor para seleccionar el entorno
const CURRENT_ENV: EnvironmentType = 'local' as EnvironmentType;

const getConfig = () => {
  switch (CURRENT_ENV) {
    case 'local':
      return localConfig;
    case 'development':
      return devConfig;
    case 'production':
      return prodConfig;
    default:
      return localConfig;
  }
};

export const Environment = getConfig();

// Tipo para las configuraciones
export interface Config {
  API_BASE_URL: string;
  ENVIRONMENT: string;
  DEBUG: boolean;
}
