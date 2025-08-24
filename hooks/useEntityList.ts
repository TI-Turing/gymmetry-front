import { useCallback, useEffect } from 'react';
import { useAsyncState } from './useAsyncState';

/**
 * Hook reutilizable para manejo de listas de entidades con operaciones CRUD básicas
 */
type UseEntityListOptions = {
  autoLoad?: boolean;
  dependencies?: readonly unknown[];
};

export function useEntityList<T>(
  loadFunction: () => Promise<T[]>,
  options?: UseEntityListOptions
) {
  const { autoLoad = true, dependencies = [] } = options || {};

  const {
    data: items,
    loading,
    error,
    execute: loadItems,
    reset,
  } = useAsyncState<T[]>([]);

  const handleLoad = useCallback(async () => {
    return await loadItems(loadFunction);
  }, [loadItems, loadFunction]);

  const handleRefresh = useCallback(async () => {
    reset();
    return await handleLoad();
  }, [handleLoad, reset]);

  useEffect(() => {
    if (autoLoad) {
      handleLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, handleLoad, ...dependencies]);

  return {
    items,
    loading,
    error,
    loadItems: handleLoad,
    refreshItems: handleRefresh,
    resetItems: reset,
  };
}
