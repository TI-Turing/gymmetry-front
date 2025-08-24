const createConfig = () => {
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    'http://localhost:7160/api';
  const catalogsApiBaseUrl =
    process.env.EXPO_PUBLIC_CATALOGS_API_BASE_URL ||
    process.env.CATALOGS_API_BASE_URL ||
    'https://your-catalogs-api-url.com/api';
  const environment =
    process.env.EXPO_PUBLIC_ENVIRONMENT || process.env.ENVIRONMENT || 'local';
  const debug = (process.env.EXPO_PUBLIC_DEBUG || process.env.DEBUG) === 'true';
  const apiFunctionsKey =
    process.env.EXPO_PUBLIC_API_FUNCTIONS_KEY ||
    process.env.API_FUNCTIONS_KEY ||
    '';
  const apiMainFunctionsKey =
    process.env.EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY ||
    process.env.API_MAIN_FUNCTIONS_KEY ||
    '';
  const payCardInApp =
    (process.env.EXPO_PUBLIC_PAY_CARD_INAPP || 'true') === 'true';
  const mpPublicKey = process.env.EXPO_PUBLIC_MP_PUBLIC_KEY || '';

  return {
    API_BASE_URL: apiBaseUrl,
    CATALOGS_API_BASE_URL: catalogsApiBaseUrl,
    ENVIRONMENT: environment,
    DEBUG: debug,
    API_FUNCTIONS_KEY: apiFunctionsKey,
    API_MAIN_FUNCTIONS_KEY: apiMainFunctionsKey,
    PAY_CARD_INAPP: payCardInApp,
    MP_PUBLIC_KEY: mpPublicKey,
  };
};

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
  PAY_CARD_INAPP: boolean;
  MP_PUBLIC_KEY: string;
}
