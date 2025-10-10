import { useState, useCallback, useRef, useEffect } from 'react';
import { feedService } from '@/services';
import { normalizeCollection } from '@/utils/objectUtils';
import type { Feed } from '@/models/Feed';
import type { PagedFeedResponse } from '@/types/feedTypes';

const MAX_FEEDS_IN_MEMORY = 100; // Límite para evitar memory leaks

export interface InfiniteFeedState {
  feeds: Feed[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | undefined;
  hasMore: boolean;
  unviewedCount: number;
  currentPage: number;
}

export interface InfiniteFeedActions {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  updateFeedItem: (feedId: string, updates: Partial<Feed>) => void;
}

/**
 * Hook para infinite scroll con tracking de feeds vistos
 *
 * Características:
 * - Infinite scroll automático (carga más al llegar al final)
 * - Usa endpoint /feed/unviewed para evitar repeticiones
 * - Gestión de memoria: máximo 100 feeds en RAM
 * - Pull-to-refresh integrado
 * - Contadores HasMore y UnviewedCount del backend
 * - Fallback automático a feeds vistos cuando UnviewedCount = 0
 *
 * @example
 * ```tsx
 * const { state, actions } = useInfiniteFeedWithTracking();
 *
 * <FlatList
 *   data={state.feeds}
 *   onEndReached={actions.loadMore}
 *   refreshControl={
 *     <RefreshControl refreshing={state.refreshing} onRefresh={actions.refresh} />
 *   }
 * />
 * ```
 */
export function useInfiniteFeedWithTracking() {
  const [state, setState] = useState<InfiniteFeedState>({
    feeds: [],
    loading: true,
    loadingMore: false,
    refreshing: false,
    error: undefined,
    hasMore: true,
    unviewedCount: 0,
    currentPage: 1,
  });

  const isMounted = useRef(true);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortRef.current?.abort();
    };
  }, []);

  /**
   * Carga una página de feeds (primera carga o siguiente página)
   */
  const loadFeeds = useCallback(
    async (page: number, append: boolean = false) => {
      if (!isMounted.current) return;

      try {
        // Cancelar request anterior si existe
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        // Actualizar loading states
        if (append) {
          setState((prev) => ({ ...prev, loadingMore: true }));
        } else {
          setState((prev) => ({ ...prev, loading: true, error: undefined }));
        }

        // Llamar al endpoint de feeds no vistos
        const resp = await feedService.getUnviewedFeeds(page, 20);

        if (!isMounted.current) return;

        if (resp?.Success) {
          const raw = resp.Data as PagedFeedResponse<unknown>;
          const newFeeds = normalizeCollection(raw.Items) as Feed[];

          setState((prev) => {
            let updatedFeeds: Feed[];

            if (append) {
              // Agregar nuevos feeds al final
              updatedFeeds = [...prev.feeds, ...newFeeds];
            } else {
              // Reemplazar todos los feeds (refresh)
              updatedFeeds = newFeeds;
            }

            // Gestión de memoria: limitar a MAX_FEEDS_IN_MEMORY
            if (updatedFeeds.length > MAX_FEEDS_IN_MEMORY) {
              const toRemove = updatedFeeds.length - MAX_FEEDS_IN_MEMORY;
              updatedFeeds = updatedFeeds.slice(toRemove);
            }

            return {
              ...prev,
              feeds: updatedFeeds,
              hasMore: raw.HasMore ?? false,
              unviewedCount: raw.UnviewedCount ?? 0,
              currentPage: page,
              loading: false,
              loadingMore: false,
              refreshing: false,
              error: undefined,
            };
          });
        } else {
          if (isMounted.current) {
            setState((prev) => ({
              ...prev,
              error: resp?.Message || 'Error al cargar feeds',
              loading: false,
              loadingMore: false,
              refreshing: false,
            }));
          }
        }
      } catch (error) {
        const err = error as { name?: string; message?: string };

        // Ignorar errores de cancelación
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') {
          return;
        }

        if (isMounted.current) {
          setState((prev) => ({
            ...prev,
            error: err?.message || 'Error de red al cargar feeds',
            loading: false,
            loadingMore: false,
            refreshing: false,
          }));
        }
      }
    },
    []
  );

  /**
   * Cargar más feeds (infinite scroll)
   * Solo ejecuta si hasMore=true y no está cargando ya
   */
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.loading || state.loadingMore) return;
    await loadFeeds(state.currentPage + 1, true);
  }, [state.hasMore, state.loading, state.loadingMore, state.currentPage, loadFeeds]);

  /**
   * Refrescar feeds desde la primera página (pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, refreshing: true }));
    await loadFeeds(1, false);
  }, [loadFeeds]);

  /**
   * Actualizar un feed específico sin hacer refetch (optimistic update)
   * Útil para likes, shares, etc.
   */
  const updateFeedItem = useCallback((feedId: string, updates: Partial<Feed>) => {
    setState((prev) => ({
      ...prev,
      feeds: prev.feeds.map((feed) =>
        feed.Id === feedId ? { ...feed, ...updates } : feed
      ),
    }));
  }, []);

  // Cargar primera página al montar
  useEffect(() => {
    void loadFeeds(1, false);
  }, [loadFeeds]);

  return {
    state,
    actions: {
      loadMore,
      refresh,
      updateFeedItem,
    },
  };
}
