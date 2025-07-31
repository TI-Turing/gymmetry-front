import { useEffect, useState, useCallback } from 'react';
import {
  asyncStorageObserver,
  StorageListener,
} from '@/services/asyncStorageObserver';

// Hook para observar cambios en AsyncStorage
export function useAsyncStorageObserver(
  key: string,
  initialValue: string | null = null
): [string | null, (value: string | null) => void] {
  const [value, setValue] = useState<string | null>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función para actualizar el valor manualmente
  const updateValue = useCallback((newValue: string | null) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    // Listener que se ejecuta cuando cambia el valor en AsyncStorage
    const listener: StorageListener = (newValue, oldValue, storageKey) => {
      if (storageKey === key) {
        setValue(newValue);
      }
    };

    // Agregar el listener
    const removeListener = asyncStorageObserver.addListener(key, listener);

    // Obtener el valor inicial si no está inicializado
    if (!isInitialized) {
      import('@react-native-async-storage/async-storage').then(
        ({ default: AsyncStorage }) => {
          AsyncStorage.getItem(key)
            .then(storedValue => {
              setValue(storedValue);
              setIsInitialized(true);
            })
            .catch(() => {
              setIsInitialized(true);
            });
        }
      );
    }

    // Cleanup: remover el listener cuando el componente se desmonte
    return removeListener;
  }, [key, isInitialized]);

  return [value, updateValue];
}

// Hook específico para observar cambios en los datos del gym
export function useGymDataObserver() {
  const GYM_DATA_KEY = '@gym_data';
  const [gymDataString] = useAsyncStorageObserver(GYM_DATA_KEY);
  const [gymData, setGymData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gymDataString) {
      try {
        const parsedData = JSON.parse(gymDataString);
        setGymData(parsedData);
        setError(null);
      } catch (_parseError) {
        setError('Error parsing gym data');
        setGymData(null);
      }
    } else {
      setGymData(null);
      setError(null);
    }
  }, [gymDataString]);

  return {
    gymData,
    gymDataString,
    error,
    hasGymData: !!gymData,
  };
}
