import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { appStateService } from '@/services/appStateService';
import type { AppStateOverviewResponse } from '@/dto/appState/AppStateOverviewResponse';
import { useAuth } from './AuthContext';
import { logger } from '@/utils';

interface AppStateContextType {
  appStateData: AppStateOverviewResponse | null;
  isBootstrapping: boolean;
  bootstrapError: string | null;
  refreshAll: () => Promise<void>;
  clearCache: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Hooks específicos para cada sección
export const useHomeState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Home || null;
};

export const useGymState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Gym || null;
};

export const useProgressState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Progress || null;
};

export const useFeedState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Feed || null;
};

export const useProfileState = () => {
  const { appStateData } = useAppState();
  return appStateData?.Profile || null;
};

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const [appStateData, setAppStateData] =
    useState<AppStateOverviewResponse | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Función para bootstrap inicial - carga todas las secciones
  const bootstrapAppState = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsBootstrapping(true);
    setBootstrapError(null);

    try {
      logger.debug('Starting app state bootstrap...');
      const startTime = Date.now();

      const response = await appStateService.getOverview();

      if (response?.Success && response.Data) {
        setAppStateData(response.Data);
        const duration = Date.now() - startTime;
        logger.debug(`App state bootstrap completed in ${duration}ms`);
      } else {
        const errorMsg = response?.Message || 'Failed to load app state';
        setBootstrapError(errorMsg);
        logger.error('App state bootstrap failed:', errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setBootstrapError(errorMsg);
      logger.error('App state bootstrap error:', error);
    } finally {
      setIsBootstrapping(false);
    }
  }, [isAuthenticated]);

  // Función para refrescar todas las secciones
  const refreshAll = useCallback(async () => {
    await bootstrapAppState();
  }, [bootstrapAppState]);

  // Función para limpiar el cache
  const clearCache = useCallback(() => {
    setAppStateData(null);
    setBootstrapError(null);
    logger.debug('App state cache cleared');
  }, []);

  // Bootstrap inicial cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      bootstrapAppState();
    } else {
      // Limpiar estado cuando el usuario se desautentica
      clearCache();
    }
  }, [isAuthenticated, bootstrapAppState, clearCache]);

  const value: AppStateContextType = {
    appStateData,
    isBootstrapping,
    bootstrapError,
    refreshAll,
    clearCache,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// Mantener compatibilidad con el PreloadContext existente
export const usePreload = () => {
  const { appStateData, isBootstrapping, bootstrapError, refreshAll } =
    useAppState();
  return {
    gymData: appStateData?.Gym?.GymData || null,
    inicioData: null, // Deprecated - usar useHomeState
    isPreloading: isBootstrapping,
    preloadError: bootstrapError,
    refreshGymData: async () => {
      await refreshAll();
    },
    precargarDatos: async () => {
      await refreshAll();
    },
  };
};

// Exportar también como PreloadProvider para compatibilidad
export const PreloadProvider = AppStateProvider;
