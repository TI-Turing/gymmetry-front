import { useRef, useEffect, useCallback } from 'react';
import { feedService } from '@/services';

/**
 * Hook para tracking de feeds vistos con batch processing
 *
 * Características:
 * - Acumula IDs de feeds vistos en memoria
 * - Envía batches al backend cada 5 segundos
 * - Divide automáticamente en grupos de 50 (límite backend)
 * - Limpia al desmontar componente
 * - Idempotente: no genera errores por duplicados
 *
 * @example
 * ```tsx
 * const { markFeedVisible, flushViewedFeeds } = useFeedViewTracking();
 *
 * // En onViewableItemsChanged:
 * viewableItems.forEach(item => {
 *   if (item.isViewable) markFeedVisible(item.item.id);
 * });
 * ```
 */
export function useFeedViewTracking() {
  const viewedFeedIds = useRef<Set<string>>(new Set());
  const markingInProgress = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Registra un feed como visible en el viewport
   * Los IDs se acumulan en memoria hasta el próximo flush
   */
  const markFeedVisible = useCallback((feedId: string) => {
    if (!feedId || typeof feedId !== 'string') return;
    viewedFeedIds.current.add(feedId);
  }, []);

  /**
   * Envía feeds vistos al backend en batches de 50
   * Previene concurrencia con flag markingInProgress
   */
  const flushViewedFeeds = useCallback(async () => {
    if (markingInProgress.current) return;
    if (viewedFeedIds.current.size === 0) return;

    markingInProgress.current = true;
    const feedIds = Array.from(viewedFeedIds.current);

    try {
      // Dividir en batches de 50 (límite backend)
      const BATCH_SIZE = 50;
      const batches: string[][] = [];

      for (let i = 0; i < feedIds.length; i += BATCH_SIZE) {
        batches.push(feedIds.slice(i, i + BATCH_SIZE));
      }

      // Enviar todos los batches en paralelo
      await Promise.all(
        batches.map(async (batch) => {
          try {
            const resp = await feedService.markFeedsAsViewed(batch);
            if (!resp?.Success) {
              console.warn(
                '⚠️ [useFeedViewTracking] Error al marcar batch:',
                resp?.Message
              );
            }
          } catch (batchError) {
            console.error(
              '❌ [useFeedViewTracking] Error en batch:',
              batchError
            );
          }
        })
      );

      // Solo limpiar si TODO fue exitoso
      viewedFeedIds.current.clear();
    } catch (error) {
      console.error('❌ [useFeedViewTracking] Error al enviar feeds:', error);
      // No limpiar el set en caso de error, se reintentará después
    } finally {
      markingInProgress.current = false;
    }
  }, []);

  // Configurar interval para flush automático cada 5 segundos
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      void flushViewedFeeds();
    }, 5000) as unknown as NodeJS.Timeout;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [flushViewedFeeds]);

  // Flush final al desmontar componente
  useEffect(() => {
    return () => {
      // Intentar flush síncrono al desmontar (best effort)
      if (viewedFeedIds.current.size > 0) {
        void flushViewedFeeds();
      }
    };
  }, [flushViewedFeeds]);

  return {
    markFeedVisible,
    flushViewedFeeds,
    getPendingCount: () => viewedFeedIds.current.size,
  };
}
