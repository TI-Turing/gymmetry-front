import { useState, useCallback, useRef } from 'react';
import { Platform, Vibration } from 'react-native';

export interface UseEnhancedRefreshOptions {
  onRefresh: () => Promise<void> | void;
  minimumRefreshTime?: number;
  enableHapticFeedback?: boolean;
  refreshThreshold?: number;
}

export interface EnhancedRefreshState {
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

export const useEnhancedRefresh = ({
  onRefresh,
  minimumRefreshTime = 800,
  enableHapticFeedback = true,
  refreshThreshold = 80,
}: UseEnhancedRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const refreshStartTime = useRef<number>(0);
  const hasTriggeredHaptic = useRef(false);

  const triggerHapticFeedback = useCallback(
    (type: 'light' | 'medium' | 'heavy' = 'light') => {
      if (enableHapticFeedback && Platform.OS !== 'web') {
        try {
          switch (type) {
            case 'light':
              Vibration.vibrate(50);
              break;
            case 'medium':
              Vibration.vibrate(100);
              break;
            case 'heavy':
              Vibration.vibrate([100, 50, 100]);
              break;
          }
        } catch (error) {
          // Haptic feedback no disponible, continuar silenciosamente
        }
      }
    },
    [enableHapticFeedback]
  );

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    refreshStartTime.current = Date.now();
    hasTriggeredHaptic.current = false;

    // Haptic feedback al iniciar refresh
    triggerHapticFeedback('medium');

    try {
      await Promise.resolve(onRefresh());
    } catch {
      // Error during refresh - handled silently
    }

    // Asegurar tiempo mínimo de refresh para evitar flicker
    const elapsedTime = Date.now() - refreshStartTime.current;
    const remainingTime = Math.max(0, minimumRefreshTime - elapsedTime);

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    setIsRefreshing(false);
    setPullDistance(0);

    // Haptic feedback al completar refresh
    triggerHapticFeedback('light');
  }, [isRefreshing, onRefresh, minimumRefreshTime, triggerHapticFeedback]);

  const updatePullDistance = useCallback(
    (distance: number) => {
      setPullDistance(distance);

      // Haptic feedback cuando se alcanza el threshold
      if (
        distance >= refreshThreshold &&
        !hasTriggeredHaptic.current &&
        !isRefreshing
      ) {
        hasTriggeredHaptic.current = true;
        triggerHapticFeedback('heavy');
      }

      // Reset haptic flag cuando se reduce la distancia
      if (distance < refreshThreshold * 0.8) {
        hasTriggeredHaptic.current = false;
      }
    },
    [refreshThreshold, isRefreshing, triggerHapticFeedback]
  );

  const canRefresh = pullDistance >= refreshThreshold && !isRefreshing;

  return {
    // Estado
    isRefreshing,
    pullDistance,
    canRefresh,

    // Acciones
    handleRefresh,
    updatePullDistance,

    // Configuración
    refreshThreshold,
    minimumRefreshTime,
  };
};
