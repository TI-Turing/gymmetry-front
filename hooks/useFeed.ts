import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { feedService } from '@/services';
import { queryCache } from '@/utils/queryCache';
import { normalizeCollection } from '@/utils/objectUtils';
import { feedCacheKeys } from '@/utils/feedCacheKeys';
import { mapFeedError, validateFeedParams } from '@/utils/feedErrorHandling';
import type { Feed } from '@/models/Feed';

type Paged<T> = {
  items: T[];
  page: number;
  size: number;
  total?: number;
};

export function useFeedPaged(
  page = 1,
  size = 20,
  opts?: { enabled?: boolean; cacheTtlMs?: number }
) {
  const enabled = opts?.enabled ?? true;
  const key = useMemo(() => feedCacheKeys.paged(page, size), [page, size]);
  const [data, setData] = useState<Paged<Feed>>(
    () => queryCache.get<Paged<Feed>>(key) || { items: [], page, size }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  // Validar parámetros
  useEffect(() => {
    try {
      validateFeedParams.pagination(page, size);
    } catch (validationError) {
      setError(mapFeedError(validationError));
      return;
    }
  }, [page, size]);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached = queryCache.get<Paged<Feed>>(key);
      if (cached) setData(cached);
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp = await feedService.getFeedsPaged(page, size);
        if (!mounted) return;
        if (resp?.Success) {
          const raw = resp.Data;
          let items: Feed[] = [];
          let total: number | undefined;

          if (Array.isArray(raw)) {
            // Si es un array directo, normalizar
            items = normalizeCollection(raw) as Feed[];
          } else if (raw && typeof raw === 'object') {
            // Si es un objeto con items/total
            const rawObj = raw as Record<string, unknown>;
            items = normalizeCollection(rawObj.items ?? rawObj) as Feed[];
            total = typeof rawObj.total === 'number' ? rawObj.total : undefined;
          }

          const paged: Paged<Feed> = {
            items,
            page,
            size,
            total,
          };
          queryCache.set(key, paged, opts?.cacheTtlMs ?? 30_000);
          setData(paged);
        } else {
          setError(resp?.Message || 'No se pudo cargar el feed');
        }
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setError(mapFeedError(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [key, enabled, page, size, opts?.cacheTtlMs]);

  const refetch = useCallback(() => queryCache.invalidate(key), [key]);

  return { data, loading, error, refetch };
}

export function useFeedTrending(
  hours = 24,
  take = 20,
  opts?: { enabled?: boolean; cacheTtlMs?: number }
) {
  const enabled = opts?.enabled ?? true;
  const key = useMemo(() => feedCacheKeys.trending(hours, take), [hours, take]);
  const [items, setItems] = useState<Feed[]>(
    () => queryCache.get<Feed[]>(key) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached = queryCache.get<Feed[]>(key);
      if (cached) setItems(cached);
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp = await feedService.getTrending(hours, take);
        if (!mounted) return;
        if (resp?.Success) {
          const normalized = normalizeCollection(resp.Data) as Feed[];
          queryCache.set(key, normalized, opts?.cacheTtlMs ?? 30_000);
          setItems(normalized);
        } else {
          setError(resp?.Message || 'No se pudo cargar trending');
        }
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setError(mapFeedError(e));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [key, enabled, hours, take, opts?.cacheTtlMs]);

  const refetch = useCallback(() => queryCache.invalidate(key), [key]);

  return { items, loading, error, refetch };
}

export function useFeedInteractions(feedId: string) {
  const likesKey = useMemo(() => feedCacheKeys.likesCount(feedId), [feedId]);
  const commentsKey = useMemo(
    () => feedCacheKeys.commentsCount(feedId),
    [feedId]
  );

  const [likesCount, setLikesCount] = useState<number | undefined>(() =>
    queryCache.get<number>(likesKey)
  );
  const [commentsCount, setCommentsCount] = useState<number | undefined>(() =>
    queryCache.get<number>(commentsKey)
  );

  useEffect(() => {
    const unsub1 = queryCache.subscribe(likesKey, () => {
      setLikesCount(queryCache.get<number>(likesKey));
    });
    const unsub2 = queryCache.subscribe(commentsKey, () => {
      setCommentsCount(queryCache.get<number>(commentsKey));
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [likesKey, commentsKey]);

  const refreshCounts = useCallback(async () => {
    const [likes, comments] = await Promise.all([
      feedService.getLikesCount(feedId),
      feedService.getCommentsCount(feedId),
    ]);
    if (likes?.Success) queryCache.set(likesKey, likes.Data ?? 0);
    if (comments?.Success) queryCache.set(commentsKey, comments.Data ?? 0);
  }, [feedId, likesKey, commentsKey]);

  const like = useCallback(async () => {
    // optimistic update
    const prev = queryCache.get<number>(likesKey) ?? 0;
    queryCache.set(likesKey, prev + 1);
    const resp = await feedService.like(feedId);
    if (!resp?.Success) {
      // revert
      queryCache.set(likesKey, prev);
    } else {
      // Invalidar caches relacionados para mostrar contadores actualizados
      const keysToInvalidate = feedCacheKeys.invalidation.onLikeChanged(feedId);
      keysToInvalidate.forEach((pattern) =>
        queryCache.invalidatePattern(pattern)
      );
    }
    return resp;
  }, [feedId, likesKey]);

  const unlike = useCallback(async () => {
    const prev = queryCache.get<number>(likesKey) ?? 0;
    queryCache.set(likesKey, Math.max(0, prev - 1));
    const resp = await feedService.unlike(feedId);
    if (!resp?.Success) {
      queryCache.set(likesKey, prev);
    } else {
      // Invalidar caches relacionados para mostrar contadores actualizados
      const keysToInvalidate = feedCacheKeys.invalidation.onLikeChanged(feedId);
      keysToInvalidate.forEach((pattern) =>
        queryCache.invalidatePattern(pattern)
      );
    }
    return resp;
  }, [feedId, likesKey]);

  const addComment = useCallback(
    async (content: string, isAnonymous?: boolean) => {
      try {
        validateFeedParams.comment(content);
        validateFeedParams.feedId(feedId);
      } catch (validationError) {
        throw mapFeedError(validationError);
      }

      const trimmed = content.trim();
      const prev = queryCache.get<number>(commentsKey) ?? 0;
      queryCache.set(commentsKey, prev + 1);
      const resp = await feedService.addComment(feedId, {
        content: trimmed,
        isAnonymous: !!isAnonymous,
      });
      if (!resp?.Success) {
        queryCache.set(commentsKey, prev);
      } else {
        // Invalidar caches relacionados para mostrar contadores actualizados
        const keysToInvalidate =
          feedCacheKeys.invalidation.onCommentChanged(feedId);
        keysToInvalidate.forEach((pattern) =>
          queryCache.invalidatePattern(pattern)
        );
      }
      return resp;
    },
    [feedId, commentsKey]
  );

  const removeComment = useCallback(
    async (commentId: string) => {
      const prev = queryCache.get<number>(commentsKey) ?? 0;
      queryCache.set(commentsKey, Math.max(0, prev - 1));
      const resp = await feedService.deleteComment(commentId);
      if (!resp?.Success) {
        queryCache.set(commentsKey, prev);
      } else {
        // Invalidar caches relacionados para mostrar contadores actualizados
        const keysToInvalidate =
          feedCacheKeys.invalidation.onCommentChanged(feedId);
        keysToInvalidate.forEach((pattern) =>
          queryCache.invalidatePattern(pattern)
        );
      }
      return resp;
    },
    [feedId, commentsKey]
  );

  return {
    likesCount,
    commentsCount,
    refreshCounts,
    like,
    unlike,
    addComment,
    removeComment,
  };
}

// Hook para comentarios paginados con normalización consistente
export function useFeedComments(
  feedId: string,
  page = 1,
  size = 50,
  opts?: { enabled?: boolean; cacheTtlMs?: number }
) {
  const enabled = opts?.enabled ?? true;
  const key = useMemo(
    () => feedCacheKeys.comments(feedId, page, size),
    [feedId, page, size]
  );
  const [data, setData] = useState<Paged<unknown>>(
    () => queryCache.get<Paged<unknown>>(key) || { items: [], page, size }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached = queryCache.get<Paged<unknown>>(key);
      if (cached) setData(cached);
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled || !feedId) return;
    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp = await feedService.getCommentsPaged(feedId, page, size);
        if (!mounted) return;
        if (resp?.Success) {
          const raw = resp.Data;
          let items: unknown[] = [];
          let total: number | undefined;

          if (Array.isArray(raw)) {
            items = normalizeCollection(raw);
          } else if (raw && typeof raw === 'object') {
            const rawObj = raw as Record<string, unknown>;
            items = normalizeCollection(rawObj.items ?? rawObj);
            total = typeof rawObj.total === 'number' ? rawObj.total : undefined;
          }

          const paged: Paged<unknown> = { items, page, size, total };
          queryCache.set(key, paged, opts?.cacheTtlMs ?? 30_000);
          setData(paged);
        } else {
          setError(resp?.Message || 'No se pudieron cargar los comentarios');
        }
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setError(err?.message || 'Error de red');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [key, enabled, feedId, page, size, opts?.cacheTtlMs]);

  const refetch = useCallback(() => queryCache.invalidate(key), [key]);

  return { data, loading, error, refetch };
}

// Hook para búsqueda de feeds con normalización consistente
export function useFeedSearch(
  searchParams: Record<string, unknown>,
  opts?: { enabled?: boolean; cacheTtlMs?: number }
) {
  const enabled = opts?.enabled ?? true;
  const key = useMemo(() => feedCacheKeys.search(searchParams), [searchParams]);
  const [items, setItems] = useState<Feed[]>(
    () => queryCache.get<Feed[]>(key) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached = queryCache.get<Feed[]>(key);
      if (cached) setItems(cached);
    });
    return () => unsub();
  }, [key]);

  useEffect(() => {
    if (!enabled || !searchParams || Object.keys(searchParams).length === 0)
      return;
    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp = await feedService.searchFeeds(searchParams);
        if (!mounted) return;
        if (resp?.Success) {
          const normalized = normalizeCollection(resp.Data) as Feed[];
          queryCache.set(key, normalized, opts?.cacheTtlMs ?? 30_000);
          setItems(normalized);
        } else {
          setError(resp?.Message || 'No se pudieron encontrar feeds');
        }
      } catch (e) {
        const err = e as { name?: string; message?: string };
        if (err?.name === 'CanceledError') return;
        setError(err?.message || 'Error de red');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    exec();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [key, enabled, searchParams, opts?.cacheTtlMs]);

  const refetch = useCallback(() => queryCache.invalidate(key), [key]);

  return { items, loading, error, refetch };
}
