import { useCallback, useRef } from 'react';

/**
 * Hook para debounce de funciones
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<number | undefined>(undefined);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay) as any;
    },
    [callback, delay]
  );

  return debouncedCallback as T;
}

/**
 * Hook para throttle de funciones
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );

  return throttledCallback as T;
}

/**
 * Hook para memoizar valores complejos
 */
export function useMemoCompare<T>(
  next: T,
  compare: (previous: T | undefined, next: T) => boolean
): T {
  const previousRef = useRef<T | undefined>(undefined);
  const previous = previousRef.current;

  const isEqual = compare(previous, next);

  if (!isEqual) {
    previousRef.current = next;
  }

  return isEqual && previous !== undefined ? previous : next;
}
