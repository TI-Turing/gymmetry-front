import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Claves estandarizadas
export const keyExerciseProgress = (routineDayId: string) => `exercise_${routineDayId}_progress`;
export const keyExerciseReps = (routineDayId: string) => `exercise_${routineDayId}_reps`;
export const keyDailyStart = (templateId: string, dayNumber: number) => `@daily_start_${templateId}_${dayNumber}`;

// Storage helpers con soporte web/localStorage
export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  } catch {
    // silencioso
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  } catch {
    // silencioso
  }
}

// JSON helpers
export async function getJSON<T = any>(key: string): Promise<T | null> {
  const raw = await getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function setJSON(key: string, value: any): Promise<void> {
  try { await setItem(key, JSON.stringify(value)); } catch { /* silencioso */ }
}
