import { useMemo } from 'react';
import { useAppState, useFeedState } from '@/contexts/AppStateContext';
import type { Feed } from '@/models/Feed';

// Tipos compatibles con los hooks existentes
type Paged<T> = {
  items: T[];
  page: number;
  size: number;
  total?: number;
};

export interface FeedPagedState {
  data: Paged<Feed> | null;
  loading: boolean;
  error: string | undefined;
  refetch: () => Promise<void>;
}

export interface FeedTrendingState {
  items: Feed[];
  loading: boolean;
  error: string | undefined;
  refetch: () => Promise<void>;
}

/**
 * Hook adaptador que transforma los datos del contexto AppState
 * al formato esperado por useFeedPaged (formato paginado)
 */
export const useFeedPagedAdapter = (page = 1, size = 20): FeedPagedState => {
  const { isBootstrapping, bootstrapError, refreshAll } = useAppState();
  const feedStateData = useFeedState();

  const adaptedData = useMemo((): FeedPagedState => {
    if (!feedStateData) {
      return {
        data: null,
        loading: isBootstrapping,
        error: bootstrapError || undefined,
        refetch: refreshAll,
      };
    }

    // Simular paginación con los datos del contexto
    const allItems = feedStateData.RecentFeeds || [];
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    const pagedData: Paged<Feed> = {
      items: paginatedItems,
      page,
      size,
      total: feedStateData.TotalFeedCount,
    };

    return {
      data: pagedData,
      loading: isBootstrapping,
      error: bootstrapError || undefined,
      refetch: refreshAll,
    };
  }, [feedStateData, page, size, isBootstrapping, bootstrapError, refreshAll]);

  return adaptedData;
};

/**
 * Hook adaptador que transforma los datos del contexto AppState
 * al formato esperado por useFeedTrending
 */
export const useFeedTrendingAdapter = (
  _hours = 24,
  _take = 20
): FeedTrendingState => {
  const { isBootstrapping, bootstrapError, refreshAll } = useAppState();
  const feedStateData = useFeedState();

  const adaptedData = useMemo((): FeedTrendingState => {
    if (!feedStateData) {
      return {
        items: [],
        loading: isBootstrapping,
        error: bootstrapError || undefined,
        refetch: refreshAll,
      };
    }

    return {
      items: feedStateData.TrendingFeeds || [],
      loading: isBootstrapping,
      error: bootstrapError || undefined,
      refetch: refreshAll,
    };
  }, [feedStateData, isBootstrapping, bootstrapError, refreshAll]);

  return adaptedData;
};
