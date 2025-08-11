import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { authService } from '@/services/authService';
import { Gym } from '../dto/gym/Gym';
import { useAuth } from './AuthContext';
// import { useGymDataObserver } from '@/hooks/useAsyncStorageObserver';

interface PreloadContextType {
  gymData: Gym | null;
  inicioData: any | null;
  isPreloading: boolean;
  preloadError: string | null;
  refreshGymData: () => Promise<void>;
  precargarDatos: () => Promise<void>;
}

const PreloadContext = createContext<PreloadContextType | undefined>(undefined);

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (context === undefined) {
    throw new Error('usePreload must be used within a PreloadProvider');
  }
  return context;
};

interface PreloadProviderProps {
  children: React.ReactNode;
}

export const PreloadProvider: React.FC<PreloadProviderProps> = ({
  children,
}) => {
  const [gymData, setGymData] = useState<Gym | null>(null);
  const [inicioData, setInicioData] = useState<any | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshGymData = useCallback(async () => {
    try {
      const { GymService } = await import('@/services/gymService');
      const cachedGym = await GymService.getCachedGym();
      if (cachedGym) {
        setGymData(cachedGym);
        return;
      }
      // Si no hay datos en caché, intentar recargar
      const gymId = authService.getGymId();
      if (gymId) {
        const gym = await GymService.generateCachedGym(gymId);
        setGymData(gym ?? null);
      }
    } catch {
      setPreloadError('Error al cargar datos del gimnasio');
    }
  }, []);

  const precargarDatosInicio = async () => {
    try {
      // Aquí puedes agregar consultas para datos de inicio
      // Por ahora retornamos datos simulados
      const mockInicioData = {
        welcomeMessage: 'Bienvenido a Gymmetry',
        stats: {
          workouts: 0,
          progress: 0,
        },
      };
      setInicioData(mockInicioData);
    } catch {
      setPreloadError('Error al cargar datos de inicio');
    }
  };

  const precargarDatos = useCallback(async () => {
    setIsPreloading(true);
    setPreloadError(null);

    try {
      await Promise.all([refreshGymData(), precargarDatosInicio()]);
    } catch {
      setPreloadError('Error al precargar datos');
    } finally {
      setIsPreloading(false);
    }
  }, [refreshGymData]);

  useEffect(() => {
    // Precargar datos cuando hay sesión activa; si no, limpiar estado
    if (isAuthenticated) {
      precargarDatos();
    } else {
      setGymData(null);
      setInicioData(null);
      setIsPreloading(false);
      setPreloadError(null);
      // También limpiar cache en memoria del servicio, si estuviera presente
      import('@/services/gymService')
        .then(({ GymService }) => GymService.clearCache?.())
        .catch(() => {});
    }
  }, [isAuthenticated, precargarDatos]);

  const value: PreloadContextType = {
    gymData,
    inicioData,
    isPreloading,
    preloadError,
    refreshGymData,
    precargarDatos,
  };

  return (
    <PreloadContext.Provider value={value}>{children}</PreloadContext.Provider>
  );
};
