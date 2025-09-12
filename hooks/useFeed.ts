import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { feedService } from '@/services';
import type { ApiResponse } from '@/dto/common/ApiResponse';
import { queryCache } from '@/utils/queryCache';
import { normalizeCollection } from '@/utils/objectUtils';

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
  const key = useMemo(() => `feed_paged_${page}_${size}`, [page, size]);
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
    if (!enabled) return;
    let mounted = true;
    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    const exec = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const resp: ApiResponse<unknown> = await feedService.getFeedsPaged(
          page,
          size
        );
        if (!mounted) return;
        if (resp?.Success) {
          const raw = (resp.Data ?? {}) as Record<string, unknown>;
          const items = normalizeCollection(
            (raw['items'] as unknown) ?? (raw as unknown)
          );
          const paged: Paged<unknown> = {
            items,
            page,
            size,
            total:
              typeof raw['total'] === 'number'
                ? (raw['total'] as number)
                : undefined,
          };
          queryCache.set(key, paged, opts?.cacheTtlMs ?? 30_000);
          setData(paged);
        } else {
          setError(resp?.Message || 'No se pudo cargar el feed');
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
  const key = useMemo(() => `feed_trending_${hours}_${take}`, [hours, take]);
  const [items, setItems] = useState<unknown[]>(
    () => queryCache.get<unknown[]>(key) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const unsub = queryCache.subscribe(key, () => {
      const cached = queryCache.get<unknown[]>(key);
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
        const resp: ApiResponse<unknown> = await feedService.getTrending(
          hours,
          take
        );
        if (!mounted) return;
        if (resp?.Success) {
          const normalized = normalizeCollection(resp.Data);
          queryCache.set(key, normalized, opts?.cacheTtlMs ?? 30_000);
          setItems(normalized);
        } else {
          setError(resp?.Message || 'No se pudo cargar trending');
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
  }, [key, enabled, hours, take, opts?.cacheTtlMs]);

  const refetch = useCallback(() => queryCache.invalidate(key), [key]);

  return { items, loading, error, refetch };
}

export function useFeedInteractions(feedId: string) {
  const likesKey = useMemo(() => `feed_likes_${feedId}`, [feedId]);
  const commentsKey = useMemo(() => `feed_comments_${feedId}`, [feedId]);

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
    }
    return resp;
  }, [feedId, likesKey]);

  const unlike = useCallback(async () => {
    const prev = queryCache.get<number>(likesKey) ?? 0;
    queryCache.set(likesKey, Math.max(0, prev - 1));
    const resp = await feedService.unlike(feedId);
    if (!resp?.Success) {
      queryCache.set(likesKey, prev);
    }
    return resp;
  }, [feedId, likesKey]);

  const addComment = useCallback(
    async (content: string, isAnonymous?: boolean) => {
      const trimmed = (content || '').trim();
      if (!trimmed) throw new Error('El comentario no puede estar vacío');
      const prev = queryCache.get<number>(commentsKey) ?? 0;
      queryCache.set(commentsKey, prev + 1);
      const resp = await feedService.addComment(feedId, {
        content: trimmed,
        isAnonymous: !!isAnonymous,
      });
      if (!resp?.Success) {
        queryCache.set(commentsKey, prev);
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
      }
      return resp;
    },
    [commentsKey]
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
