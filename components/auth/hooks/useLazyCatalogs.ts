import { useState, useEffect, useCallback } from 'react';
import { catalogService } from '@/services/catalogService';
import { userSessionService } from '@/services/userSessionService';
import { Gender, Country, Region, City, EPS, DocumentType } from '@/dto/common';

// Hook para géneros (solo cuando se necesite)
export function useGenders(autoLoad: boolean = false) {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGenders = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.getGenders();
      setGenders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando géneros');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (autoLoad) {
      loadGenders();
    }
  }, [autoLoad, loadGenders]);

  return {
    genders,
    loading,
    error,
    loadGenders,
    refetch: loadGenders,
  };
}

// Hook para países (solo cuando se necesite)
export function useCountries(autoLoad: boolean = false) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCountries = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.getCountries();
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando países');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (autoLoad) {
      loadCountries();
    }
  }, [autoLoad, loadCountries]);

  return {
    countries,
    loading,
    error,
    loadCountries,
    refetch: loadCountries,
  };
}

// Hook para regiones por país
export function useRegionsByCountry(countryId?: string) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRegions = useCallback(
    async (targetCountryId?: string) => {
      const finalCountryId = targetCountryId || countryId;
      if (!finalCountryId || loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await catalogService.getRegionsByCountry(finalCountryId);
        setRegions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error cargando regiones'
        );
      } finally {
        setLoading(false);
      }
    },
    [countryId, loading]
  );

  useEffect(() => {
    if (countryId) {
      loadRegions(countryId);
    } else {
      setRegions([]);
    }
  }, [countryId, loadRegions]);

  return {
    regions,
    loading,
    error,
    loadRegions,
    clearRegions: () => setRegions([]),
  };
}

// Hook para ciudades por región
export function useCitiesByRegion(regionId?: string) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCities = useCallback(
    async (targetRegionId?: string) => {
      const finalRegionId = targetRegionId || regionId;
      if (!finalRegionId || loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await catalogService.getCitiesByRegion(finalRegionId);
        setCities(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error cargando ciudades'
        );
      } finally {
        setLoading(false);
      }
    },
    [regionId, loading]
  );

  useEffect(() => {
    if (regionId) {
      loadCities(regionId);
    } else {
      setCities([]);
    }
  }, [regionId, loadCities]);

  return {
    cities,
    loading,
    error,
    loadCities,
    clearCities: () => setCities([]),
  };
}

// Hook para EPS
export function useEPS(autoLoad: boolean = false) {
  const [eps, setEps] = useState<EPS[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEPS = useCallback(async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await catalogService.getEPS();
      setEps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando EPS');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (autoLoad) {
      loadEPS();
    }
  }, [autoLoad, loadEPS]);

  return {
    eps,
    loading,
    error,
    loadEPS,
    refetch: loadEPS,
  };
}

// Hook para tipos de documento (usa país de sesión automáticamente)
export function useDocumentTypes(
  countryId?: string,
  autoLoad: boolean = false
) {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocumentTypes = useCallback(
    async (targetCountryId?: string) => {
      if (loading) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Si no se proporciona countryId, el servicio usará automáticamente el país de sesión
        const data = await catalogService.getDocumentTypes(
          targetCountryId || countryId
        );
        setDocumentTypes(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error cargando tipos de documento'
        );
      } finally {
        setLoading(false);
      }
    },
    [countryId, loading]
  );

  useEffect(() => {
    if (autoLoad) {
      loadDocumentTypes();
    }
  }, [autoLoad, loadDocumentTypes]);

  useEffect(() => {
    if (countryId) {
      loadDocumentTypes(countryId);
    }
  }, [countryId, loadDocumentTypes]);

  return {
    documentTypes,
    loading,
    error,
    loadDocumentTypes,
    refetch: () => loadDocumentTypes(),
  };
}

// Hook para datos del país del usuario desde sesión
export function useUserCountrySession() {
  const [userCountryData, setUserCountryData] = useState(
    userSessionService.getUserCountryData()
  );
  const [userCountryId, setUserCountryId] = useState(
    userSessionService.getUserCountryId()
  );

  useEffect(() => {
    // Verificar periódicamente si hay nuevos datos de país
    const interval = setInterval(() => {
      const currentData = userSessionService.getUserCountryData();
      const currentId = userSessionService.getUserCountryId();

      if (currentData !== userCountryData) {
        setUserCountryData(currentData);
      }
      if (currentId !== userCountryId) {
        setUserCountryId(currentId);
      }
    }, 1000); // Verificar cada segundo

    return () => clearInterval(interval);
  }, [userCountryData, userCountryId]);

  const refreshUserCountry = async () => {
    await userSessionService.refreshUserCountry();
    setUserCountryData(userSessionService.getUserCountryData());
    setUserCountryId(userSessionService.getUserCountryId());
  };

  return {
    userCountryData,
    userCountryId,
    refreshUserCountry,
    hasUserCountry: !!userCountryId,
  };
}
