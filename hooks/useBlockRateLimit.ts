// Hook para manejar rate limiting de bloqueos de usuarios
// Implementa lógica para mostrar límites diarios y cache local

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLOCK_LIMITS } from '@/services';

interface BlockRateLimit {
  remainingBlocks: number;
  isLimitReached: boolean;
  resetDate: Date;
}

interface UseBlockRateLimitReturn {
  rateLimit: BlockRateLimit;
  decrementBlockCount: () => void;
  resetRateLimit: () => void;
  isLoading: boolean;
}

export const useBlockRateLimit = (): UseBlockRateLimitReturn => {
  const [rateLimit, setRateLimit] = useState<BlockRateLimit>({
    remainingBlocks: BLOCK_LIMITS.DAILY_BLOCK_LIMIT,
    isLimitReached: false,
    resetDate: getNextResetDate(),
  });
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = '@block_rate_limit';

  // Get next reset date (tomorrow at midnight)
  function getNextResetDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  // Load rate limit data from storage
  const loadRateLimit = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored =
        Platform.OS === 'web'
          ? window.localStorage.getItem(STORAGE_KEY)
          : await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const data = JSON.parse(stored);
        const resetDate = new Date(data.resetDate);
        const now = new Date();

        // Check if we need to reset the limit (new day)
        if (now >= resetDate) {
          const newRateLimit = {
            remainingBlocks: BLOCK_LIMITS.DAILY_BLOCK_LIMIT,
            isLimitReached: false,
            resetDate: getNextResetDate(),
          };
          setRateLimit(newRateLimit);
          await saveRateLimit(newRateLimit);
        } else {
          setRateLimit({
            remainingBlocks: data.remainingBlocks,
            isLimitReached: data.remainingBlocks <= 0,
            resetDate,
          });
        }
      } else {
        // First time, set default
        const defaultRateLimit = {
          remainingBlocks: BLOCK_LIMITS.DAILY_BLOCK_LIMIT,
          isLimitReached: false,
          resetDate: getNextResetDate(),
        };
        setRateLimit(defaultRateLimit);
        await saveRateLimit(defaultRateLimit);
      }
    } catch (error) {
      console.warn('Error loading block rate limit:', error);
      // Fallback to default if storage fails
      setRateLimit({
        remainingBlocks: BLOCK_LIMITS.DAILY_BLOCK_LIMIT,
        isLimitReached: false,
        resetDate: getNextResetDate(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save rate limit data to storage
  const saveRateLimit = async (data: BlockRateLimit) => {
    try {
      const dataToStore = {
        remainingBlocks: data.remainingBlocks,
        resetDate: data.resetDate.toISOString(),
      };

      if (Platform.OS === 'web') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      }
    } catch (error) {
      console.warn('Error saving block rate limit:', error);
    }
  };

  // Decrement block count (called after successful block)
  const decrementBlockCount = useCallback(() => {
    setRateLimit((prev) => {
      const newCount = Math.max(0, prev.remainingBlocks - 1);
      const newRateLimit = {
        ...prev,
        remainingBlocks: newCount,
        isLimitReached: newCount <= 0,
      };

      // Save to storage asynchronously
      saveRateLimit(newRateLimit);

      return newRateLimit;
    });
  }, []);

  // Reset rate limit (for testing or manual reset)
  const resetRateLimit = useCallback(async () => {
    const newRateLimit = {
      remainingBlocks: BLOCK_LIMITS.DAILY_BLOCK_LIMIT,
      isLimitReached: false,
      resetDate: getNextResetDate(),
    };
    setRateLimit(newRateLimit);
    await saveRateLimit(newRateLimit);
  }, []);

  // Load initial data
  useEffect(() => {
    loadRateLimit();
  }, [loadRateLimit]);

  // Check for automatic reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now >= rateLimit.resetDate) {
        loadRateLimit(); // This will trigger the reset logic
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [rateLimit.resetDate, loadRateLimit]);

  return {
    rateLimit,
    decrementBlockCount,
    resetRateLimit,
    isLoading,
  };
};
