import { useCallback, useState } from 'react';

/**
 * Estado de una operación asíncrona
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado para manejar estados asíncronos de forma consistente
 */
export function useAsyncState<T = any>(initialData: T | null = null) {
  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      loading,
      error: loading ? null : prev.error,
    }));
  }, []);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const execute = useCallback(
    async (asyncFn: () => Promise<T>) => {
      try {
        setLoading(true);
        const result = await asyncFn();
        setData(result);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
        throw error;
      }
    },
    [setLoading, setData, setError]
  );

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
    execute,
  };
}

/**
 * Hook para manejar listas con operaciones CRUD
 */
export function useAsyncList<T extends { id?: string | number }>(
  initialData: T[] = []
) {
  const asyncState = useAsyncState<T[]>(initialData);

  const addItem = useCallback(
    (item: T) => {
      asyncState.setData([...(asyncState.data || []), item]);
    },
    [asyncState]
  );

  const updateItem = useCallback(
    (id: string | number, updates: Partial<T>) => {
      const currentData = asyncState.data || [];
      const updatedData = currentData.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      asyncState.setData(updatedData);
    },
    [asyncState]
  );

  const removeItem = useCallback(
    (id: string | number) => {
      const currentData = asyncState.data || [];
      const filteredData = currentData.filter(item => item.id !== id);
      asyncState.setData(filteredData);
    },
    [asyncState]
  );

  const findItem = useCallback(
    (id: string | number) => {
      return (asyncState.data || []).find(item => item.id === id);
    },
    [asyncState.data]
  );

  return {
    ...asyncState,
    addItem,
    updateItem,
    removeItem,
    findItem,
    items: asyncState.data || [],
  };
}
