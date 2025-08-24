import { isWithinQuietHours } from '@/utils/quietHours';
import type { AppSettings } from '@/contexts/AppSettingsContext';

type NotificationContent = {
  title?: string;
  body?: string;
  data?: unknown;
  sound?: boolean | null;
};

type NotificationTrigger = unknown; // dejamos flexible para no depender de tipos de expo-notifications

type ExpoNotificationsLike = {
  scheduleNotificationAsync?: (params: unknown) => Promise<string>;
  cancelScheduledNotificationAsync?: (id: string) => Promise<void>;
  cancelAllScheduledNotificationsAsync?: () => Promise<void>;
  requestPermissionsAsync?: () => Promise<
    { status?: string; granted?: boolean } | undefined
  >;
  addNotificationReceivedListener?: (cb: (e: unknown) => void) => {
    remove: () => void;
  };
  addNotificationResponseReceivedListener?: (cb: (r: unknown) => void) => {
    remove: () => void;
  };
};

async function getExpoNotifications(): Promise<unknown | null> {
  try {
    const importer = Function('return import')() as unknown;
    const dynamicImport = importer as <T = unknown>(
      specifier: string
    ) => Promise<T>;
    const mod = await dynamicImport('expo-notifications');
    return ((mod as unknown as { default?: unknown }).default ??
      mod) as unknown;
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
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
  if (!Notifications?.scheduleNotificationAsync) return null;
  try {
    const id: string = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    return id || null;
  } catch {
    return null;
  }
}

export async function cancelScheduledNotificationAsync(
  identifier: string
): Promise<boolean> {
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
  if (!Notifications?.cancelScheduledNotificationAsync) return false;
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    return true;
  } catch {
    return false;
  }
}

export async function cancelAllScheduledNotificationsAsync(): Promise<boolean> {
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
  if (!Notifications?.cancelAllScheduledNotificationsAsync) return false;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch {
    return false;
  }
}

export async function requestNotificationPermissionsAsync(): Promise<boolean> {
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
  if (!Notifications?.requestPermissionsAsync) return false;
  try {
    const res = await Notifications.requestPermissionsAsync();
    const granted = res?.status === 'granted' || res?.granted === true;
    return granted;
  } catch {
    return false;
  }
}

/**
 * Registra un listener para notificaciones recibidas.
 * Devuelve un objeto con remove() o null si no está disponible en la plataforma.
 */
export async function addNotificationReceivedListener(
  callback: (event: unknown) => void
): Promise<{ remove: () => void } | null> {
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
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
  callback: (response: unknown) => void
): Promise<{ remove: () => void } | null> {
  const Notifications =
    (await getExpoNotifications()) as ExpoNotificationsLike | null;
  if (!Notifications?.addNotificationResponseReceivedListener) return null;
  try {
    const sub = Notifications.addNotificationResponseReceivedListener(callback);
    return sub || null;
  } catch {
    return null;
  }
}
