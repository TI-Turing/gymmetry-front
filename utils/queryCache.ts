type CacheValue<T> = {
  value: T;
  expiresAt?: number;
};

type Subscriber = () => void;

class QueryCache {
  private store = new Map<string, CacheValue<unknown>>();
  private subs = new Map<string, Set<Subscriber>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
    this.store.set(key, { value, expiresAt });
    this.notify(key);
  }

  invalidate(key: string): void {
    this.store.delete(key);
    this.notify(key);
  }

  // Invalidar por patrón (ej: "feed_*" para invalidar todos los feeds)
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    const keysToInvalidate: string[] = [];

    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        keysToInvalidate.push(key);
      }
    }

    for (const key of keysToInvalidate) {
      this.invalidate(key);
    }
  }

  // Invalidar múltiples keys relacionadas
  invalidateRelated(keys: string[]): void {
    for (const key of keys) {
      this.invalidate(key);
    }
  }

  subscribe(key: string, cb: Subscriber): () => void {
    if (!this.subs.has(key)) this.subs.set(key, new Set());
    this.subs.get(key)!.add(cb);
    return () => {
      this.subs.get(key)?.delete(cb);
    };
  }

  private notify(key: string) {
    const set = this.subs.get(key);
    if (!set) return;
    for (const cb of set) {
      try {
        cb();
      } catch {
        // noop
      }
    }
  }
}

export const queryCache = new QueryCache();
