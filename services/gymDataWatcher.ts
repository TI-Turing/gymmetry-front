import { asyncStorageObserver } from './asyncStorageObserver';
import { gymService } from './gymService';
import { logger } from '@/utils';

const GYM_DATA_KEY = '@gym_id';

class GymDataWatcher {
  private static instance: GymDataWatcher;
  private isWatching = false;
  private removeListener: (() => void) | null = null;

  static getInstance(): GymDataWatcher {
    if (!GymDataWatcher.instance) {
      GymDataWatcher.instance = new GymDataWatcher();
    }
    return GymDataWatcher.instance;
  }

  // Iniciar el observador global
  startWatching(): void {
    if (this.isWatching) {
      return;
    }

    this.removeListener = asyncStorageObserver.addListener(
      GYM_DATA_KEY,
      this.handleGymDataChange.bind(this)
    );

    this.isWatching = true;
  }

  // Parar el observador global
  stopWatching(): void {
    if (!this.isWatching) {
      return;
    }

    if (this.removeListener) {
      this.removeListener();
      this.removeListener = null;
    }

    this.isWatching = false;
  }

  // Manejar cambios en los datos del gym
  private async handleGymDataChange(
    newValue: string | null,
    oldValue: string | null,
    key: string
  ): Promise<void> {
    // Si no hay valor nuevo, no hacer nada
    if (!newValue) {
      logger.debug('[GymDataWatcher] No hay valor nuevo, no se hace nada.');
      return;
    }

    try {
      // Parsear los nuevos datos del gym
      logger.debug('[GymDataWatcher] Nuevo valor detectado:', newValue);
      const gymDataCache = JSON.parse(newValue);
      logger.debug('[GymDataWatcher] gymDataCache:', gymDataCache);

      // Verificar si es una estructura válida de CachedGymData
      if (gymDataCache && gymDataCache.gym && gymDataCache.gym.Id) {
        const gymId = gymDataCache.gym.Id;
        logger.debug('[GymDataWatcher] gymId detectado:', gymId);

        // Verificar si el gymId cambió comparando con el valor anterior
        let shouldRefetch = false;

        if (!oldValue) {
          // Si no había valor anterior, definitivamente debemos consultar
          logger.info(
            '[GymDataWatcher] No hay valor anterior, se consultará el gym.'
          );
          shouldRefetch = true;
        } else {
          try {
            logger.debug('[GymDataWatcher] Valor anterior:', oldValue);
            const oldGymDataCache = JSON.parse(oldValue);
            logger.debug('[GymDataWatcher] oldGymDataCache:', oldGymDataCache);
            const oldGymId = oldGymDataCache?.gym?.Id;
            logger.debug('[GymDataWatcher] oldGymId:', oldGymId);

            // Si el ID del gym cambió, debemos consultar
            if (oldGymId !== gymId) {
              logger.info(
                '[GymDataWatcher] El gymId ha cambiado, se consultará el gym.'
              );
              shouldRefetch = true;
            }
          } catch (err) {
            logger.warn(
              '[GymDataWatcher] Error parseando valor anterior, se consultará por seguridad.',
              err
            );
            // Si hay error parseando el valor anterior, consultar por seguridad
            shouldRefetch = true;
          }
        }

        // Solo consultar si realmente cambió el gym
        if (shouldRefetch) {
          logger.info(
            '[GymDataWatcher] Ejecutando refetchGymData para gymId:',
            gymId
          );
          await this.refetchGymData(gymId);
        } else {
          logger.debug(
            '[GymDataWatcher] No es necesario consultar el gym, el ID no cambió.'
          );
        }
      } else {
        logger.warn(
          '[GymDataWatcher] gymDataCache no es válido o no tiene gym.Id'
        );
      }
    } catch (_error) {
      logger.warn(
        '[GymDataWatcher] Error parseando newValue, intentando con el gymId actual del cache.',
        _error
      );
      }
  }

  // Consultar datos actualizados del gym
  private async refetchGymData(gymId: string): Promise<void> {
    try {
      // Usar el método del gymService que maneja el caching
      logger.info('[GymDataWatcher] Refetching gym data for gymId:', gymId);
      await gymService.updateCacheFromObserver(gymId);

      // Opcional: Notificar a otros componentes que los datos se actualizaron
      // Esto se puede usar para mostrar notificaciones o actualizar UI específica
      logger.info(
        '[GymDataWatcher] Notificando actualización de datos del gym:',
        gymId
      );
      this.notifyGymDataUpdated(gymId);
    } catch (_error) {
      // Manejo silencioso de errores para no interrumpir la aplicación
      logger.error('[GymDataWatcher] Error en refetchGymData:', _error);
    }
  }

  // Método para notificar que los datos del gym se actualizaron
  private notifyGymDataUpdated(gymId: string): void {
    // Aquí puedes agregar lógica adicional para notificar a componentes
    // Por ejemplo, emitir eventos customizados, actualizar stores globales, etc.

    // Ejemplo: Crear un evento personalizado (opcional)
    if (typeof window !== 'undefined') {
      logger.debug(
        '[GymDataWatcher] Dispatching gymDataUpdated event para gymId:',
        gymId
      );
      const event = new CustomEvent('gymDataUpdated', {
        detail: { gymId, timestamp: new Date().toISOString() },
      });
      window.dispatchEvent(event);
    }
  }

  // Método para forzar una verificación inmediata
  async forceCheck(): Promise<void> {
    await asyncStorageObserver.forceCheck(GYM_DATA_KEY);
  }

  // Verificar si está observando
  isCurrentlyWatching(): boolean {
    return this.isWatching;
  }
}

export const gymDataWatcher = GymDataWatcher.getInstance();

// Auto-inicializar el watcher cuando se importe el módulo
// Esto asegura que siempre esté funcionando en toda la aplicación
gymDataWatcher.startWatching();
