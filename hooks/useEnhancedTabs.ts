import { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseTabStatePersistenceProps {
  storageKey: string;
  defaultTab: string;
  enabled?: boolean;
}

export const useTabStatePersistence = ({
  storageKey,
  defaultTab,
  enabled = true,
}: UseTabStatePersistenceProps) => {
  const [currentTab, setCurrentTab] = useState<string>(defaultTab);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar estado inicial desde AsyncStorage
  useEffect(() => {
    if (!enabled) {
      setIsLoaded(true);
      return;
    }

    const loadPersistedTab = async () => {
      try {
        const savedTab = await AsyncStorage.getItem(storageKey);
        if (savedTab) {
          setCurrentTab(savedTab);
        }
      } catch {
        // Error loading persisted tab state
      } finally {
        setIsLoaded(true);
      }
    };

    loadPersistedTab();
  }, [storageKey, enabled]);

  // Persistir cambios de tab
  const updateTab = async (newTab: string) => {
    setCurrentTab(newTab);

    if (enabled) {
      try {
        await AsyncStorage.setItem(storageKey, newTab);
      } catch {
        // Error persisting tab state
      }
    }
  };

  // Limpiar estado persistido
  const clearPersistedState = async () => {
    if (enabled) {
      try {
        await AsyncStorage.removeItem(storageKey);
        setCurrentTab(defaultTab);
      } catch {
        // Error clearing persisted tab state
      }
    }
  };

  return {
    currentTab,
    setTab: updateTab,
    clearPersistedState,
    isLoaded,
  };
};

// Hook para animaciones de tab mejoradas
export const useTabAnimations = (selectedIndex: number, tabsLength: number) => {
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [scaleAnimations] = useState(
    Array(tabsLength)
      .fill(0)
      .map(() => new Animated.Value(1))
  );

  useEffect(() => {
    // Animar posición del indicador
    Animated.spring(indicatorPosition, {
      toValue: selectedIndex,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();

    // Animar escala de tabs
    scaleAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === selectedIndex ? 1.1 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });
  }, [selectedIndex, indicatorPosition, scaleAnimations]);

  return {
    indicatorPosition,
    scaleAnimations,
  };
};

// Hook para manejar badges dinámicos
export const useTabBadges = (tabs: { id: string; badgeCount?: number }[]) => {
  const [totalNotifications, setTotalNotifications] = useState(0);

  useEffect(() => {
    const total = tabs.reduce((sum, tab) => sum + (tab.badgeCount || 0), 0);
    setTotalNotifications(total);
  }, [tabs]);

  const updateBadge = (_tabId: string, _count: number) => {
    // Esta función podría ser extendida para manejar actualizaciones
    // individuales de badges desde el componente padre
  };

  return {
    totalNotifications,
    updateBadge,
  };
};
