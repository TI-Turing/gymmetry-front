import { useState, useCallback, useRef, useEffect } from 'react';

export interface InfiniteScrollOptions<T> {
  initialItems?: T[];
  pageSize?: number;
  loadMoreItems: (page: number, pageSize: number) => Promise<T[]>;
  keyExtractor: (item: T) => string;
  threshold?: number;
  enablePreload?: boolean;
  maxItems?: number;
}

export interface InfiniteScrollState<T> {
  items: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  refreshing: boolean;
}

export const useInfiniteScroll = <T>({
  initialItems = [],
  pageSize = 10,
  loadMoreItems,
  keyExtractor,
  threshold = 0.7,
  enablePreload = true,
  maxItems = 1000,
}: InfiniteScrollOptions<T>) => {
  const [state, setState] = useState<InfiniteScrollState<T>>({
    items: initialItems,
    loading: false,
    loadingMore: false,
    hasMore: true,
    error: null,
    page: 1,
    refreshing: false,
  });

  const loadingRef = useRef(false);
  const preloadTriggered = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Cargar más items
  const loadMore = useCallback(async () => {
    if (
      loadingRef.current ||
      !state.hasMore ||
      state.items.length >= maxItems
    ) {
      return;
    }

    loadingRef.current = true;
    setState((prev) => ({ ...prev, loadingMore: true, error: null }));

    try {
      const newItems = await loadMoreItems(state.page, pageSize);

      setState((prev) => {
        // Filtrar duplicados basado en keyExtractor
        const existingKeys = new Set(prev.items.map(keyExtractor));
        const uniqueNewItems = newItems.filter(
          (item) => !existingKeys.has(keyExtractor(item))
        );

        return {
          ...prev,
          items: [...prev.items, ...uniqueNewItems],
          page: prev.page + 1,
          hasMore: newItems.length === pageSize,
          loadingMore: false,
        };
      });

      retryCount.current = 0;
    } catch (error) {
      retryCount.current += 1;
      setState((prev) => ({
        ...prev,
        loadingMore: false,
        error:
          retryCount.current >= maxRetries
            ? 'Error cargando contenido. Intenta refrescar.'
            : 'Error cargando más contenido',
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [
    state.page,
    state.hasMore,
    state.items.length,
    loadMoreItems,
    pageSize,
    keyExtractor,
    maxItems,
  ]);

  // Refresh completo
  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, refreshing: true, error: null }));
    loadingRef.current = true;
    preloadTriggered.current = false;
    retryCount.current = 0;

    try {
      const newItems = await loadMoreItems(1, pageSize);

      setState({
        items: newItems,
        loading: false,
        loadingMore: false,
        hasMore: newItems.length === pageSize,
        error: null,
        page: 2,
        refreshing: false,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        refreshing: false,
        error: 'Error al actualizar. Intenta de nuevo.',
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [loadMoreItems, pageSize]);

  // Preload inteligente basado en velocidad de scroll
  const handlePreload = useCallback(
    (distanceFromEnd: number, contentLength: number) => {
      const preloadThreshold = contentLength * (1 - threshold);

      if (
        enablePreload &&
        distanceFromEnd <= preloadThreshold &&
        !preloadTriggered.current &&
        state.hasMore &&
        !state.loadingMore
      ) {
        preloadTriggered.current = true;
        loadMore();
      }

      // Reset preload trigger cuando se aleja del threshold
      if (distanceFromEnd > preloadThreshold * 1.2) {
        preloadTriggered.current = false;
      }
    },
    [enablePreload, threshold, state.hasMore, state.loadingMore, loadMore]
  );

  // Manejar scroll end reached
  const onEndReached = useCallback(() => {
    if (!preloadTriggered.current) {
      loadMore();
    }
  }, [loadMore]);

  // Retry después de error
  const retry = useCallback(() => {
    if (state.error && retryCount.current < maxRetries) {
      loadMore();
    } else if (retryCount.current >= maxRetries) {
      refresh();
    }
  }, [state.error, loadMore, refresh]);

  // Cargar inicial si no hay items
  useEffect(() => {
    if (state.items.length === 0 && !state.loading && !loadingRef.current) {
      refresh();
    }
  }, [state.items.length, state.loading, refresh]);

  return {
    // Estado
    ...state,

    // Acciones
    loadMore,
    refresh,
    retry,
    handlePreload,
    onEndReached,

    // Configuración
    pageSize,
    threshold,
    canLoadMore: state.hasMore && !state.loadingMore && !loadingRef.current,
  };
};
