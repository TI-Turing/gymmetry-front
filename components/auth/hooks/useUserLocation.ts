import { useState, useEffect, useCallback } from 'react';

interface UserLocationData {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  source: 'locale' | 'ip' | 'unknown';
}

export function useUserLocation() {
  const [locationData, setLocationData] = useState<UserLocationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mapeo básico de códigos a nombres de países
  const getCountryNameFromCode = (code: string): string => {
    const countryMap: Record<string, string> = {
      CO: 'Colombia',
      US: 'Estados Unidos',
      MX: 'México',
      AR: 'Argentina',
      BR: 'Brasil',
      CL: 'Chile',
      PE: 'Perú',
      EC: 'Ecuador',
      VE: 'Venezuela',
      ES: 'España',
    };
    return countryMap[code] || code;
  };

  const getCountryFromTimezone = useCallback((): Omit<
    UserLocationData,
    'source'
  > | null => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || 'es-ES';

      const timezoneToCountry: Record<string, { code: string; name: string }> =
        {
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
        return {
          country: countryInfo.name,
          countryCode: countryInfo.code,
        };
      }

      const localeCountry = locale.split('-')[1];
      if (localeCountry) {
        return {
          countryCode: localeCountry,
          country: getCountryNameFromCode(localeCountry),
        };
      }
    } catch (error) {
      // Fallback silencioso en caso de error
    }
    return null;
  }, []);

  const getCountryFromIP = useCallback(async (): Promise<
    Omit<UserLocationData, 'source'>
  > => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      return {
        country: data.country_name,
        countryCode: data.country_code,
        city: data.city,
        region: data.region,
      };
    } catch (error) {
      // Fallback silencioso en caso de error
    }
    return { country: undefined, countryCode: undefined } as Omit<
      UserLocationData,
      'source'
    >;
  }, []);

  const detectUserLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Intentar usar timezone del navegador
      const timezoneResult = getCountryFromTimezone();
      if (timezoneResult) {
        setLocationData({ ...timezoneResult, source: 'locale' });
        setLoading(false);
        return;
      }

      // 2. Detección por IP como fallback
      const ipResult = await getCountryFromIP();
      if (ipResult) {
        setLocationData({ ...ipResult, source: 'ip' });
        setLoading(false);
        return;
      }

      setLocationData({ source: 'unknown' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [getCountryFromTimezone, getCountryFromIP]);

  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  return {
    locationData,
    loading,
    error,
    refetch: detectUserLocation,
  };
}
