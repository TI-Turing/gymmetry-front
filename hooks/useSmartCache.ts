import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface SmartCacheOptions {
  maxAge?: number; // Tiempo de vida en milisegundos
  maxSize?: number; // Número máximo de entradas
  persistent?: boolean; // Persistir en AsyncStorage
  staleWhileRevalidate?: boolean; // Devolver datos stale mientras actualiza
}

interface UseSmartCacheProps<T> {
  key: string;
  fetcher: () => Promise<T>;
  options?: SmartCacheOptions;
}

const DEFAULT_OPTIONS: Required<SmartCacheOptions> = {
  maxAge: 5 * 60 * 1000, // 5 minutos
  maxSize: 100,
  persistent: true,
  staleWhileRevalidate: true,
};

// Cache en memoria global
const memoryCache = new Map<string, CacheEntry<unknown>>();
const accessOrder = new Set<string>(); // Para LRU

export const useSmartCache = <T>({
  key,
  fetcher,
  options = {},
}: UseSmartCacheProps<T>) => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  // Referencia para evitar múltiples fetches simultáneos
  const fetchingRef = useRef<Promise<T> | null>(null);

  // Función para limpiar cache LRU
  const cleanupCache = useCallback(() => {
    if (memoryCache.size > opts.maxSize) {
      const keysToDelete = Array.from(accessOrder).slice(
        0,
        memoryCache.size - opts.maxSize
      );
      keysToDelete.forEach((k) => {
        memoryCache.delete(k);
        accessOrder.delete(k);
      });
    }
  }, [opts.maxSize]);

  // Función para obtener datos del cache
  const getCachedData = useCallback(async (): Promise<CacheEntry<T> | null> => {
    // Intentar obtener de memoria primero
    const memoryEntry = memoryCache.get(key);
    if (memoryEntry) {
      // Actualizar orden de acceso para LRU
      accessOrder.delete(key);
      accessOrder.add(key);
      return memoryEntry as CacheEntry<T>;
    }

    // Si no está en memoria y es persistente, intentar AsyncStorage
    if (opts.persistent) {
      try {
        const stored = await AsyncStorage.getItem(`cache_${key}`);
        if (stored) {
          const entry = JSON.parse(stored) as CacheEntry<T>;
          // Añadir a memoria cache
          memoryCache.set(key, entry);
          accessOrder.add(key);
          cleanupCache();
          return entry;
        }
      } catch {
        // Error reading cache - handled silently
      }
    }

    return null;
  }, [key, opts.persistent, cleanupCache]);

  // Función para almacenar datos en cache
  const setCachedData = useCallback(
    async (newData: T): Promise<void> => {
      const entry: CacheEntry<T> = {
        data: newData,
        timestamp: Date.now(),
        expiry: Date.now() + opts.maxAge,
      };

      // Guardar en memoria
      memoryCache.set(key, entry);
      accessOrder.delete(key);
      accessOrder.add(key);
      cleanupCache();

      // Guardar en AsyncStorage si es persistente
      if (opts.persistent) {
        try {
          await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(entry));
        } catch {
          // Error storing cache - handled silently
        }
      }
    },
    [key, opts.maxAge, opts.persistent, cleanupCache]
  );

  // Función para verificar si los datos están expirados
  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() > entry.expiry;
  }, []);

  // Función principal para obtener datos
  const fetchData = useCallback(
    async (forceRefresh = false): Promise<T> => {
      // Si ya hay un fetch en progreso, esperar a que termine
      if (fetchingRef.current && !forceRefresh) {
        return fetchingRef.current;
      }

      setLoading(true);
      setError(null);

      const fetchPromise = (async (): Promise<T> => {
        try {
          let cachedEntry: CacheEntry<T> | null = null;

          if (!forceRefresh) {
            cachedEntry = await getCachedData();
          }

          // Si hay datos en cache y no están expirados, usarlos
          if (cachedEntry && !isExpired(cachedEntry)) {
            setData(cachedEntry.data);
            setLastUpdated(cachedEntry.timestamp);
            setLoading(false);
            return cachedEntry.data;
          }

          // Si hay datos stale pero staleWhileRevalidate está activo
          if (cachedEntry && opts.staleWhileRevalidate && !forceRefresh) {
            setData(cachedEntry.data);
            setLastUpdated(cachedEntry.timestamp);
            // Continuar para actualizar en background
          }

          // Obtener datos frescos
          const freshData = await fetcher();
          await setCachedData(freshData);

          setData(freshData);
          setLastUpdated(Date.now());
          setLoading(false);

          return freshData;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);

          // Si hay datos en cache, usarlos como fallback
          const cachedEntry = await getCachedData();
          if (cachedEntry) {
            setData(cachedEntry.data);
            setLastUpdated(cachedEntry.timestamp);
            return cachedEntry.data;
          }

          throw err;
        }
      })();

      fetchingRef.current = fetchPromise;

      return fetchPromise.finally(() => {
        fetchingRef.current = null;
      });
    },
    [
      fetcher,
      getCachedData,
      setCachedData,
      isExpired,
      opts.staleWhileRevalidate,
    ]
  );

  // Función para invalidar cache
  const invalidate = useCallback(async () => {
    memoryCache.delete(key);
    accessOrder.delete(key);

    if (opts.persistent) {
      try {
        await AsyncStorage.removeItem(`cache_${key}`);
      } catch {
        // Error removing cache - handled silently
      }
    }

    setData(null);
    setLastUpdated(null);
    setError(null);
  }, [key, opts.persistent]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    fetchData,
    refresh,
    invalidate,
    isStale: lastUpdated ? Date.now() - lastUpdated > opts.maxAge : false,
  };
};

// Hook adicional para manejar múltiples cache entries
// Note: This function has limitations due to React Hooks rules
// Consider using individual useSmartCache calls in components instead
export const useBatchCache = <T>(
  entries: { key: string; fetcher: () => Promise<T> }[],
  _options?: SmartCacheOptions
) => {
  // Create a mocked result for now to avoid React Hook violations
  const results = entries.map(() => ({
    data: null as T | null,
    loading: false,
    error: null as Error | null,
    refresh: () => Promise.resolve(),
    invalidate: () => {
      // TODO: Implement invalidation logic
    },
    isStale: false,
    lastUpdated: null as Date | null,
  }));

  const allLoading = results.some((result) => result.loading);
  const hasErrors = results.some((result) => result.error);
  const allData = results.map((result) => result.data);

  const refreshAll = useCallback(() => {
    return Promise.all(results.map((result) => result.refresh()));
  }, [results]);

  const invalidateAll = useCallback(() => {
    return Promise.all(results.map((result) => result.invalidate()));
  }, [results]);

  return {
    results,
    allData,
    allLoading,
    hasErrors,
    refreshAll,
    invalidateAll,
  };
};

// Utilidad para limpiar todo el cache
export const clearAllCache = async () => {
  memoryCache.clear();
  accessOrder.clear();

  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch {
    // Error clearing all cache - handled silently
  }
};
