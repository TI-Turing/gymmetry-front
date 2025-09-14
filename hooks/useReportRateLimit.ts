// Hook para manejar rate limiting de reportes de contenido
// Implementa lógica para prevenir spam de reportes

import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReportRateLimit {
  remainingReports: number;
  isLimitReached: boolean;
  resetDate: Date;
}

interface UseReportRateLimitReturn {
  rateLimit: ReportRateLimit;
  decrementReportCount: () => void;
  resetRateLimit: () => void;
  isLoading: boolean;
}

// Constantes de límite de reportes
const REPORT_LIMITS = {
  DAILY_REPORT_LIMIT: 10, // 10 reportes por día por usuario
  HOURLY_REPORT_LIMIT: 3, // 3 reportes por hora
} as const;

export const useReportRateLimit = (): UseReportRateLimitReturn => {
  const [rateLimit, setRateLimit] = useState<ReportRateLimit>({
    remainingReports: REPORT_LIMITS.DAILY_REPORT_LIMIT,
    isLimitReached: false,
    resetDate: getNextResetDate(),
  });
  const [isLoading, setIsLoading] = useState(true);

  const STORAGE_KEY = '@report_rate_limit';

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
        const storedDate = new Date(data.resetDate);
        const now = new Date();

        // Check if we need to reset (new day)
        if (now >= storedDate) {
          // Reset to new day
          const newRateLimit: ReportRateLimit = {
            remainingReports: REPORT_LIMITS.DAILY_REPORT_LIMIT,
            isLimitReached: false,
            resetDate: getNextResetDate(),
          };
          setRateLimit(newRateLimit);
          await saveRateLimit(newRateLimit);
        } else {
          // Use stored data
          const restoredRateLimit: ReportRateLimit = {
            remainingReports: data.remainingReports || 0,
            isLimitReached: data.remainingReports <= 0,
            resetDate: storedDate,
          };
          setRateLimit(restoredRateLimit);
        }
      } else {
        // Initialize for first time
        const initialRateLimit: ReportRateLimit = {
          remainingReports: REPORT_LIMITS.DAILY_REPORT_LIMIT,
          isLimitReached: false,
          resetDate: getNextResetDate(),
        };
        setRateLimit(initialRateLimit);
        await saveRateLimit(initialRateLimit);
      }
    } catch (error) {
      // Error loading report rate limit, fallback to default state
      setRateLimit({
        remainingReports: REPORT_LIMITS.DAILY_REPORT_LIMIT,
        isLimitReached: false,
        resetDate: getNextResetDate(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save rate limit data to storage
  const saveRateLimit = async (rateLimitData: ReportRateLimit) => {
    try {
      const dataToStore = {
        remainingReports: rateLimitData.remainingReports,
        resetDate: rateLimitData.resetDate.toISOString(),
      };

      if (Platform.OS === 'web') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      }
    } catch (error) {
      // Error saving report rate limit, silently fail
    }
  };

  // Decrement report count after successful report
  const decrementReportCount = useCallback(() => {
    setRateLimit((prev) => {
      const newRemaining = Math.max(0, prev.remainingReports - 1);
      const newRateLimit: ReportRateLimit = {
        ...prev,
        remainingReports: newRemaining,
        isLimitReached: newRemaining <= 0,
      };

      // Save asynchronously
      saveRateLimit(newRateLimit);

      return newRateLimit;
    });
  }, []);

  // Reset rate limit (for testing or admin purposes)
  const resetRateLimit = useCallback(async () => {
    const resetRateLimit: ReportRateLimit = {
      remainingReports: REPORT_LIMITS.DAILY_REPORT_LIMIT,
      isLimitReached: false,
      resetDate: getNextResetDate(),
    };
    setRateLimit(resetRateLimit);
    await saveRateLimit(resetRateLimit);
  }, []);

  // Load on mount
  useEffect(() => {
    loadRateLimit();
  }, [loadRateLimit]);

  return {
    rateLimit,
    decrementReportCount,
    resetRateLimit,
    isLoading,
  };
};
