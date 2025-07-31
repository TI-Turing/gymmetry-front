import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos para los listeners
type StorageListener = (
  newValue: string | null,
  oldValue: string | null,
  key: string
) => void;

interface StorageObserver {
  key: string;
  listeners: Set<StorageListener>;
  currentValue: string | null;
}

class AsyncStorageObserver {
  private static instance: AsyncStorageObserver;
  private observers: Map<string, StorageObserver> = new Map();
  private pollingInterval: ReturnType<typeof setInterval> | null = null;
  private pollingIntervalMs = 1000; // Verificar cada segundo

  static getInstance(): AsyncStorageObserver {
    if (!AsyncStorageObserver.instance) {
      AsyncStorageObserver.instance = new AsyncStorageObserver();
    }
    return AsyncStorageObserver.instance;
  }

  // Agregar un listener para una key específica
  addListener(key: string, listener: StorageListener): () => void {
    if (!this.observers.has(key)) {
      this.observers.set(key, {
        key,
        listeners: new Set(),
        currentValue: null,
      });

      // Inicializar el valor actual
      this.initializeValue(key);
    }

    const observer = this.observers.get(key)!;
    observer.listeners.add(listener);

    // Iniciar polling si es el primer listener
    this.startPolling();

    // Retornar función para remover el listener
    return () => {
      observer.listeners.delete(listener);

      // Si no hay más listeners para esta key, remover el observer
      if (observer.listeners.size === 0) {
        this.observers.delete(key);
      }

      // Si no hay más observers, parar el polling
      if (this.observers.size === 0) {
        this.stopPolling();
      }
    };
  }

  // Inicializar el valor actual para una key
  private async initializeValue(key: string): Promise<void> {
    try {
      const value = await AsyncStorage.getItem(key);
      const observer = this.observers.get(key);
      if (observer) {
        observer.currentValue = value;
      }
    } catch (error) {
      console.error(`Error inicializando valor para key ${key}:`, error);
    }
  }

  // Iniciar el polling para verificar cambios
  private startPolling(): void {
    if (this.pollingInterval) return;

    this.pollingInterval = setInterval(async () => {
      await this.checkForChanges();
    }, this.pollingIntervalMs);
  }

  // Parar el polling
  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Verificar cambios en todas las keys observadas
  private async checkForChanges(): Promise<void> {
    const promises = Array.from(this.observers.entries()).map(
      async ([key, observer]) => {
        try {
          const newValue = await AsyncStorage.getItem(key);

          // Verificar si el valor cambió
          if (newValue !== observer.currentValue) {
            const oldValue = observer.currentValue;
            observer.currentValue = newValue;

            // Notificar a todos los listeners
            observer.listeners.forEach(listener => {
              try {
                listener(newValue, oldValue, key);
              } catch (error) {
                console.error(`Error en listener para key ${key}:`, error);
              }
            });
          }
        } catch (error) {
          console.error(`Error verificando cambios para key ${key}:`, error);
        }
      }
    );

    await Promise.all(promises);
  }

  // Método para forzar una verificación inmediata
  async forceCheck(key?: string): Promise<void> {
    if (key && this.observers.has(key)) {
      const observer = this.observers.get(key)!;
      try {
        const newValue = await AsyncStorage.getItem(key);

        if (newValue !== observer.currentValue) {
          const oldValue = observer.currentValue;
          observer.currentValue = newValue;

          observer.listeners.forEach(listener => {
            try {
              listener(newValue, oldValue, key);
            } catch (error) {
              console.error(`Error en listener para key ${key}:`, error);
            }
          });
        }
      } catch (error) {
        console.error(`Error en verificación forzada para key ${key}:`, error);
      }
    } else {
      await this.checkForChanges();
    }
  }

  // Obtener el número de listeners activos
  getListenerCount(): number {
    return Array.from(this.observers.values()).reduce(
      (total, observer) => total + observer.listeners.size,
      0
    );
  }

  // Limpiar todos los observers
  cleanup(): void {
    this.stopPolling();
    this.observers.clear();
  }
}

export const asyncStorageObserver = AsyncStorageObserver.getInstance();
export type { StorageListener };
