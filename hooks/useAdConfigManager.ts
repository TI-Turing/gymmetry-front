import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { advertisementService } from '@/services';
import type { AdConfigRequestDto } from '@/dto/Advertisement/Request/AdConfigRequestDto';
import type { AdConfigResponseDto } from '@/dto/Advertisement/Response/AdConfigResponseDto';

const AD_CONFIG_STORAGE_KEY = '@ad_config';

// Configuración por defecto
const DEFAULT_CONFIG: AdConfigResponseDto = {
  PostsPerAd: 5,
  AdMobPercentage: 60,
};

/**
 * Hook para gestionar configuración de anuncios con persistencia local
 *
 * Características:
 * - Carga inicial desde AsyncStorage (offline-first)
 * - Fetch desde backend al montar
 * - Actualización con sincronización backend + local
 * - Fallback a valores por defecto si falla todo
 *
 * @returns config, loading, error, updateConfig, refreshConfig
 *
 * @example
 * ```typescript
 * function SettingsScreen() {
 *   const { config, loading, updateConfig } = useAdConfigManager();
 *
 *   const handleSave = async () => {
 *     const newConfig = {
 *       PostsPerAd: 7,
 *       AdMobPercentage: 70,
 *     };
 *     const success = await updateConfig(newConfig);
 *     if (success) {
 *       alert('Configuración guardada');
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Text>Posts por anuncio: {config.PostsPerAd}</Text>
 *       <Text>AdMob: {config.AdMobPercentage}%</Text>
 *       <Button title="Guardar" onPress={handleSave} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useAdConfigManager() {
  const [config, setConfig] = useState<AdConfigResponseDto>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga configuración desde AsyncStorage
   */
  const loadFromStorage = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(AD_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AdConfigResponseDto;
        setConfig(parsed);
        return parsed;
      }
    } catch (err) {
      // Si falla la carga local, continuar con default
      void err;
    }
    return null;
  }, []);

  /**
   * Guarda configuración en AsyncStorage
   */
  const saveToStorage = useCallback(
    async (newConfig: AdConfigResponseDto) => {
      try {
        await AsyncStorage.setItem(
          AD_CONFIG_STORAGE_KEY,
          JSON.stringify(newConfig)
        );
      } catch (err) {
        void err;
      }
    },
    []
  );

  /**
   * Obtiene configuración desde el backend
   */
  const fetchFromBackend = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await advertisementService.getConfig();

      if (resp?.Success && resp.Data) {
        setConfig(resp.Data);
        await saveToStorage(resp.Data);
      } else {
        setError(resp?.Message || 'Error al cargar configuración');
      }
    } catch (err) {
      setError('Error de red al cargar configuración');
    } finally {
      setLoading(false);
    }
  }, [saveToStorage]);

  /**
   * Actualiza configuración (backend + local)
   *
   * @param newConfig Nueva configuración
   * @returns true si se actualizó correctamente
   */
  const updateConfig = useCallback(
    async (newConfig: AdConfigRequestDto): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const resp = await advertisementService.updateConfig(newConfig);

        if (resp?.Success && resp.Data) {
          setConfig(resp.Data);
          await saveToStorage(resp.Data);
          return true;
        } else {
          setError(resp?.Message || 'Error al actualizar configuración');
          return false;
        }
      } catch (err) {
        setError('Error de red al actualizar configuración');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [saveToStorage]
  );

  /**
   * Refresca configuración desde el backend
   */
  const refreshConfig = useCallback(async () => {
    await fetchFromBackend();
  }, [fetchFromBackend]);

  // Carga inicial: storage primero, luego backend
  useEffect(() => {
    const init = async () => {
      // Cargar desde storage inmediatamente
      await loadFromStorage();

      // Luego actualizar desde backend (puede sobrescribir)
      await fetchFromBackend();
    };

    void init();
  }, [loadFromStorage, fetchFromBackend]);

  return {
    config,
    loading,
    error,
    updateConfig,
    refreshConfig,
  };
}
