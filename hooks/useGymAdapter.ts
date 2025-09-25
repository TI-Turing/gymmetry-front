import { useMemo } from 'react';
import { useAppState, useGymState } from '@/contexts/AppStateContext';
import type { Gym } from '@/models/Gym';

export interface GymAdapterState {
  gymData: Gym | null;
  isConnectedToGym: boolean;
  gymId: string | null;
  isLoading: boolean;
  error: string | null;
  refreshGymData: () => Promise<void>;
}

/**
 * Hook adaptador que transforma los datos del contexto AppState
 * al formato esperado por el componente GymScreen existente
 */
export const useGymAdapter = (): GymAdapterState => {
  const { isBootstrapping, bootstrapError, refreshAll } = useAppState();
  const gymStateData = useGymState();

  const adaptedData = useMemo((): GymAdapterState => {
    if (!gymStateData) {
      return {
        gymData: null,
        isConnectedToGym: false,
        gymId: null,
        isLoading: isBootstrapping,
        error: bootstrapError,
        refreshGymData: refreshAll,
      };
    }

    return {
      gymData: gymStateData.GymData,
      isConnectedToGym: gymStateData.IsConnectedToGym,
      gymId: gymStateData.GymId || null,
      isLoading: isBootstrapping,
      error: bootstrapError,
      refreshGymData: refreshAll,
    };
  }, [gymStateData, isBootstrapping, bootstrapError, refreshAll]);

  return adaptedData;
};
