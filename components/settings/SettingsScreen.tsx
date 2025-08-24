import React, { useEffect, useState } from 'react';
import { Platform, Switch, View as RNView, TouchableOpacity, ScrollView } from 'react-native';
import { View, Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { scheduleLocalNotificationAsync, requestNotificationPermissionsAsync } from '@/utils/localNotifications';
import { useI18n } from '@/i18n';

const SOUND_KEY = '@sound_cues_enabled';
const PREP_KEY = '@prep_seconds';

export default function SettingsScreen() {
  const { settings, setSettings } = useAppSettings();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prepSeconds, setPrepSeconds] = useState<number>(10);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Sonido
        const rawSound = Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window
          ? window.localStorage.getItem(SOUND_KEY)
          : await AsyncStorage.getItem(SOUND_KEY);
        const enabled = rawSound == null ? true : rawSound === '1';
        if (!cancelled) setSoundEnabled(enabled);
        // Prep
        const rawPrep = Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window
          ? window.localStorage.getItem(PREP_KEY)
          : await AsyncStorage.getItem(PREP_KEY);
        const prep = rawPrep == null ? 10 : Math.max(0, parseInt(rawPrep, 10) || 0);
        if (!cancelled) setPrepSeconds(prep);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const persistSound = async (val: boolean) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(SOUND_KEY, val ? '1' : '0');
    } else {
      await AsyncStorage.setItem(SOUND_KEY, val ? '1' : '0');
    }
  };

  const toggleSound = async (val: boolean) => {
    setSoundEnabled(val);
    try { await persistSound(val); } catch {}
  };

  const persistPrep = async (val: number) => {
    const s = String(Math.max(0, Math.floor(val)));
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(PREP_KEY, s);
    } else {
      await AsyncStorage.setItem(PREP_KEY, s);
    }
  };

  const changePrep = async (val: number) => {
    setPrepSeconds(val);
    try { await persistPrep(val); } catch {}
  };

  const testHydration = async () => {
    if (!settings.notificationsEnabled) return;
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) return;
    await scheduleLocalNotificationAsync(
      { title: 'Hidrátate (prueba)', body: 'Notificación de prueba en 5s', data: { type: 'wellness:hydration' } },
      { seconds: 5 },
      { settings }
    );
  };

  const testActiveBreak = async () => {
    if (!settings.notificationsEnabled) return;
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) return;
    await scheduleLocalNotificationAsync(
      { title: 'Pausa activa (prueba)', body: 'Notificación de prueba en 5s', data: { type: 'wellness:activeBreak' } },
      { seconds: 5 },
      { settings }
    );
  };

  return (
  <ScreenWrapper
    headerTitle={t('settings_title')}
      showBackButton
      onPressBack={() => router.back()}
    >
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Apariencia */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('appearance')}</Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('theme')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Usar tema del sistema o forzar claro/oscuro.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {(['system','light','dark'] as const).map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ theme: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.theme === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.theme === val ? '#2A2A2A' : 'transparent', minWidth: 70, alignItems: 'center' }}>
          <Text style={{ color: '#FFF', fontWeight: '600' }}>{val === 'system' ? t('system') : val === 'light' ? t('light') : t('dark')}</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('reduce_motion')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Reduce efectos visuales en toda la app.</Text>
            </View>
            <Switch value={settings.reduceMotion} onValueChange={v => setSettings({ reduceMotion: v })} />
          </RNView>
        </View>

        {/* Preferencias */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('preferences')}</Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('language')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Auto o selección manual.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {(['auto','es','en'] as const).map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ language: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.language === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.language === val ? '#2A2A2A' : 'transparent', minWidth: 70, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val === 'auto' ? 'Auto' : val.toUpperCase()}</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('data_saver')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Limita descargas y prefetch en redes móviles.</Text>
            </View>
            <Switch value={settings.dataSaver} onValueChange={v => setSettings({ dataSaver: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('image_quality')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Controla el tamaño/calidad de imágenes.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {(['auto','high','medium','low'] as const).map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ imageQuality: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.imageQuality === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.imageQuality === val ? '#2A2A2A' : 'transparent', minWidth: 70, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val === 'auto' ? 'Auto' : val}</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </View>

  {/* Notificaciones */}
  <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('notifications')}</Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('enable_notifications')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Activa o desactiva todas las notificaciones de la app.</Text>
            </View>
            <Switch value={settings.notificationsEnabled} onValueChange={v => setSettings({ notificationsEnabled: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('training_notifications')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Avisos locales al completar ciclos/intervalos.</Text>
            </View>
            <Switch value={settings.trainingNotificationsEnabled} onValueChange={v => setSettings({ trainingNotificationsEnabled: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('quiet_hours')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Silencia notificaciones en el horario elegido.</Text>
            </View>
            <Switch value={settings.quietHours.enabled} onValueChange={v => setSettings({ quietHours: { ...settings.quietHours, enabled: v } })} />
          </RNView>
        </View>

        {/* Bienestar */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('wellness')}</Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('hydration_reminders')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Recibe un aviso para tomar agua periódicamente.</Text>
            </View>
            <Switch value={settings.hydrationRemindersEnabled} onValueChange={v => setSettings({ hydrationRemindersEnabled: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('hydration_interval')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Cada cuánto tiempo deseas el recordatorio.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {[30,45,60,90].map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ hydrationIntervalMinutes: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.hydrationIntervalMinutes === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.hydrationIntervalMinutes === val ? '#2A2A2A' : 'transparent', minWidth: 56, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val}m</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>

          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('active_breaks')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Recordatorios para moverte y estirar.</Text>
            </View>
            <Switch value={settings.activeBreaksEnabled} onValueChange={v => setSettings({ activeBreaksEnabled: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('breaks_interval')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Frecuencia de los recordatorios.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {[60,90,120].map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ activeBreaksIntervalMinutes: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.activeBreaksIntervalMinutes === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.activeBreaksIntervalMinutes === val ? '#2A2A2A' : 'transparent', minWidth: 56, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val}m</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          {/* Botones de prueba */}
          <RNView style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TouchableOpacity onPress={testHydration} style={{ backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
        <Text style={{ color: '#FFF', fontWeight: '600' }}>{t('test_hydration')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={testActiveBreak} style={{ backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
        <Text style={{ color: '#FFF', fontWeight: '600' }}>{t('test_break')}</Text>
            </TouchableOpacity>
          </RNView>
        </View>

        {/* Diagnóstico y caché */}
        <View style={{ backgroundColor: '#1A1A1A', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A2A' }}>
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('diagnostics_cache')}</Text>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('analytics')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Permite recolectar métricas de uso (opt‑in/out).</Text>
            </View>
            <Switch value={settings.analyticsEnabled} onValueChange={v => setSettings({ analyticsEnabled: v })} />
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('log_level')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Controla el detalle en consola.</Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {(['off','error','warn','info','debug'] as const).map(val => (
                <RNView key={val}>
                  <TouchableOpacity onPress={() => setSettings({ logLevel: val })} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: settings.logLevel === val ? '#FF6B35' : '#3A3A3A', backgroundColor: settings.logLevel === val ? '#2A2A2A' : 'transparent', minWidth: 70, alignItems: 'center' }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val.toUpperCase()}</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('offline_cache')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>Habilita almacenamiento para modo sin conexión.</Text>
            </View>
            <Switch value={settings.enableOfflineCache} onValueChange={v => setSettings({ enableOfflineCache: v })} />
          </RNView>
        </View>
        {/* Sección: Entrenamiento */}
        <View
          style={{
            backgroundColor: '#1A1A1A',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2A2A2A',
          }}
        >
      <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 12 }}>{t('training')}</Text>
          <RNView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('sound_cues')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>
                Activa avisos al cambiar de fase del temporizador y al finalizar. Se guarda en este dispositivo.
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              disabled={loading}
            />
          </RNView>

          <RNView
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
              marginTop: 8,
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '600' }}>{t('prep_time')}</Text>
              <Text style={{ opacity: 0.8, marginTop: 2, fontSize: 12 }}>
                Pausa breve antes de iniciar el siguiente ciclo (0 para desactivar).
              </Text>
            </View>
            <RNView style={{ flexDirection: 'row', gap: 8 }}>
              {[0,5,10,15].map(val => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => changePrep(val)}
                    disabled={loading}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: val === prepSeconds ? '#FF6B35' : '#3A3A3A',
                      backgroundColor: val === prepSeconds ? '#2A2A2A' : 'transparent',
                      minWidth: 48,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>{val}s</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </View>

        {/* Más opciones futuras */}
        <Text style={{ opacity: 0.7, fontSize: 12 }}>
          Más opciones de configuración estarán disponibles próximamente.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
}
