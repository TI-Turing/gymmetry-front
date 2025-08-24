import { isWithinQuietHours } from '@/utils/quietHours';
import type { AppSettings } from '@/contexts/AppSettingsContext';

type NotificationContent = {
  title?: string;
  body?: string;
  data?: any;
  sound?: boolean | null;
};

type NotificationTrigger = any; // dejamos flexible para no depender de tipos de expo-notifications

async function getExpoNotifications(): Promise<any | null> {
  try {
    const dynamicImport: any = (Function('return import')() as any);
    const mod = await dynamicImport('expo-notifications');
    return mod?.default || mod;
  } catch {
    return null;
  }
}

/**
 * Programa una notificación local respetando ajustes de la app (silencio y horas).
 * Devuelve el id de la notificación o null si fue suprimida/no disponible.
 */
export async function scheduleLocalNotificationAsync(
  content: NotificationContent,
  trigger?: NotificationTrigger,
  opts?: { settings?: Pick<AppSettings, 'notificationsEnabled' | 'quietHours'> }
): Promise<string | null> {
  const st = opts?.settings;
  if (st) {
    if (!st.notificationsEnabled) return null;
    if (isWithinQuietHours(new Date(), st.quietHours)) return null;
  }
  const Notifications = await getExpoNotifications();
  if (!Notifications?.scheduleNotificationAsync) return null;
  try {
    const id: string = await Notifications.scheduleNotificationAsync({ content, trigger });
    return id || null;
  } catch {
    return null;
  }
}

export async function cancelScheduledNotificationAsync(identifier: string): Promise<boolean> {
  const Notifications = await getExpoNotifications();
  if (!Notifications?.cancelScheduledNotificationAsync) return false;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    return true;
  } catch {
    return false;
  }
}

export async function cancelAllScheduledNotificationsAsync(): Promise<boolean> {
  const Notifications = await getExpoNotifications();
  if (!Notifications?.cancelAllScheduledNotificationsAsync) return false;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch {
    return false;
  }
}

export async function requestNotificationPermissionsAsync(): Promise<boolean> {
  const Notifications = await getExpoNotifications();
  if (!Notifications?.requestPermissionsAsync) return false;
  try {
    const res = await Notifications.requestPermissionsAsync();
    const status = res?.status || res?.granted ? 'granted' : 'denied';
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Registra un listener para notificaciones recibidas.
 * Devuelve un objeto con remove() o null si no está disponible en la plataforma.
 */
export async function addNotificationReceivedListener(
  callback: (event: any) => void
): Promise<{ remove: () => void } | null> {
  const Notifications = await getExpoNotifications();
  if (!Notifications?.addNotificationReceivedListener) return null;
  try {
    const sub = Notifications.addNotificationReceivedListener(callback);
    return sub || null;
  } catch {
    return null;
  }
}

/**
 * Registra un listener para respuestas de notificaciones (tap).
 * Útil para re-agendar cuando la app estaba en background.
 */
export async function addNotificationResponseReceivedListener(
  callback: (response: any) => void
): Promise<{ remove: () => void } | null> {
  const Notifications = await getExpoNotifications();
  if (!Notifications?.addNotificationResponseReceivedListener) return null;
  try {
    const sub = Notifications.addNotificationResponseReceivedListener(callback);
    return sub || null;
  } catch {
    return null;
  }
}
