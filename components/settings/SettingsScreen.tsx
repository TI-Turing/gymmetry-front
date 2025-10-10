import React, { useEffect, useState } from 'react';
import {
  Platform,
  Switch,
  View as RNView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import {
  scheduleLocalNotificationAsync,
  requestNotificationPermissionsAsync,
} from '@/utils/localNotifications';
import { useI18n } from '@/i18n';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeSettingsStyles } from './styles';
import { useAdConfigManager } from '@/hooks';
import { CustomAlert } from '@/components/common/CustomAlert';
import { useAuth } from '@/contexts/AuthContext';

const SOUND_KEY = '@sound_cues_enabled';
const PREP_KEY = '@prep_seconds';

// Admin users whitelist
const ADMIN_USERS = ['jlap11'];

export default function SettingsScreen() {
  const { settings, setSettings } = useAppSettings();
  const { user: authUser } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prepSeconds, setPrepSeconds] = useState<number>(10);
  const styles = useThemedStyles(makeSettingsStyles);

  // Ad Configuration
  const {
    config: adConfig,
    loading: adConfigLoading,
    error: adConfigError,
    updateConfig: updateAdConfig,
  } = useAdConfigManager();
  const [postsPerAd, setPostsPerAd] = useState<number>(5);
  const [admobPercentage, setAdmobPercentage] = useState<number>(60);
  const [isSavingAdConfig, setIsSavingAdConfig] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Check if current user is admin
  const isAdmin = authUser?.userName
    ? ADMIN_USERS.includes(authUser.userName.toLowerCase())
    : false;

  // Sincronizar valores de ad config cuando cambia
  useEffect(() => {
    if (adConfig) {
      setPostsPerAd(adConfig.PostsPerAd);
      setAdmobPercentage(adConfig.AdMobPercentage);
    }
  }, [adConfig]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Sonido
        const rawSound =
          Platform.OS === 'web' &&
          typeof window !== 'undefined' &&
          'localStorage' in window
            ? window.localStorage.getItem(SOUND_KEY)
            : await AsyncStorage.getItem(SOUND_KEY);
        const enabled = rawSound == null ? true : rawSound === '1';
        if (!cancelled) setSoundEnabled(enabled);
        // Prep
        const rawPrep =
          Platform.OS === 'web' &&
          typeof window !== 'undefined' &&
          'localStorage' in window
            ? window.localStorage.getItem(PREP_KEY)
            : await AsyncStorage.getItem(PREP_KEY);
        const prep =
          rawPrep == null ? 10 : Math.max(0, parseInt(rawPrep, 10) || 0);
        if (!cancelled) setPrepSeconds(prep);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistSound = async (val: boolean) => {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'localStorage' in window
    ) {
      window.localStorage.setItem(SOUND_KEY, val ? '1' : '0');
    } else {
      await AsyncStorage.setItem(SOUND_KEY, val ? '1' : '0');
    }
  };

  const toggleSound = async (val: boolean) => {
    setSoundEnabled(val);
    try {
      await persistSound(val);
    } catch {}
  };

  const persistPrep = async (val: number) => {
    const s = String(Math.max(0, Math.floor(val)));
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'localStorage' in window
    ) {
      window.localStorage.setItem(PREP_KEY, s);
    } else {
      await AsyncStorage.setItem(PREP_KEY, s);
    }
  };

  const changePrep = async (val: number) => {
    setPrepSeconds(val);
    try {
      await persistPrep(val);
    } catch {}
  };

  const testHydration = async () => {
    if (!settings.notificationsEnabled) return;
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) return;
    await scheduleLocalNotificationAsync(
      {
        title: 'Hidrátate (prueba)',
        body: 'Notificación de prueba en 5s',
        data: { type: 'wellness:hydration' },
      },
      { seconds: 5 },
      { settings }
    );
  };

  const testActiveBreak = async () => {
    if (!settings.notificationsEnabled) return;
    const granted = await requestNotificationPermissionsAsync();
    if (!granted) return;
    await scheduleLocalNotificationAsync(
      {
        title: 'Pausa activa (prueba)',
        body: 'Notificación de prueba en 5s',
        data: { type: 'wellness:activeBreak' },
      },
      { seconds: 5 },
      { settings }
    );
  };

  const handleSaveAdConfig = async () => {
    // Validaciones
    if (postsPerAd < 3 || postsPerAd > 10) {
      setAlertMessage(t('ad_config_validation_error'));
      setShowErrorAlert(true);
      return;
    }
    if (admobPercentage < 0 || admobPercentage > 100) {
      setAlertMessage(t('ad_config_validation_error'));
      setShowErrorAlert(true);
      return;
    }

    setIsSavingAdConfig(true);
    try {
      const success = await updateAdConfig({
        PostsPerAd: postsPerAd,
        AdMobPercentage: admobPercentage,
      });

      if (success) {
        setAlertMessage(t('ad_config_saved'));
        setShowSuccessAlert(true);
      } else {
        setAlertMessage(adConfigError || t('ad_config_error'));
        setShowErrorAlert(true);
      }
    } catch (err) {
      setAlertMessage(t('ad_config_error'));
      setShowErrorAlert(true);
    } finally {
      setIsSavingAdConfig(false);
    }
  };

  return (
    <ScreenWrapper
      headerTitle={t('settings_title')}
      showBackButton
      onPressBack={() => router.back()}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Apariencia */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('appearance')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('theme')}</Text>
              <Text style={styles.rowSub}>
                Usar tema del sistema o forzar claro/oscuro.
              </Text>
            </View>
            <RNView style={styles.chipRow}>
              {(['system', 'light', 'dark'] as const).map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => setSettings({ theme: val })}
                    style={[
                      styles.chip,
                      settings.theme === val
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>
                      {val === 'system'
                        ? t('system')
                        : val === 'light'
                          ? t('light')
                          : t('dark')}
                    </Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('reduce_motion')}</Text>
              <Text style={styles.rowSub}>
                Reduce efectos visuales en toda la app.
              </Text>
            </View>
            <Switch
              value={settings.reduceMotion}
              onValueChange={(v) => setSettings({ reduceMotion: v })}
            />
          </RNView>
        </View>

        {/* Preferencias */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('language')}</Text>
              <Text style={styles.rowSub}>Auto o selección manual.</Text>
            </View>
            <RNView style={styles.chipRow}>
              {(['auto', 'es', 'en'] as const).map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => setSettings({ language: val })}
                    style={[
                      styles.chip,
                      settings.language === val
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>
                      {val === 'auto' ? 'Auto' : val.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('data_saver')}</Text>
              <Text style={styles.rowSub}>
                Limita descargas y prefetch en redes móviles.
              </Text>
            </View>
            <Switch
              value={settings.dataSaver}
              onValueChange={(v) => setSettings({ dataSaver: v })}
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('image_quality')}</Text>
              <Text style={styles.rowSub}>
                Controla el tamaño/calidad de imágenes.
              </Text>
            </View>
            <RNView style={styles.chipRow}>
              {(['auto', 'high', 'medium', 'low'] as const).map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => setSettings({ imageQuality: val })}
                    style={[
                      styles.chip,
                      settings.imageQuality === val
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>
                      {val === 'auto' ? 'Auto' : val}
                    </Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </View>

        {/* Notificaciones */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('notifications')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('enable_notifications')}</Text>
              <Text style={styles.rowSub}>
                Activa o desactiva todas las notificaciones de la app.
              </Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(v) => setSettings({ notificationsEnabled: v })}
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('training_notifications')}</Text>
              <Text style={styles.rowSub}>
                Avisos locales al completar ciclos/intervalos.
              </Text>
            </View>
            <Switch
              value={settings.trainingNotificationsEnabled}
              onValueChange={(v) =>
                setSettings({ trainingNotificationsEnabled: v })
              }
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('quiet_hours')}</Text>
              <Text style={styles.rowSub}>
                Silencia notificaciones en el horario elegido.
              </Text>
            </View>
            <Switch
              value={settings.quietHours.enabled}
              onValueChange={(v) =>
                setSettings({
                  quietHours: { ...settings.quietHours, enabled: v },
                })
              }
            />
          </RNView>
        </View>

        {/* Bienestar */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('wellness')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('hydration_reminders')}</Text>
              <Text style={styles.rowSub}>
                Recibe un aviso para tomar agua periódicamente.
              </Text>
            </View>
            <Switch
              value={settings.hydrationRemindersEnabled}
              onValueChange={(v) =>
                setSettings({ hydrationRemindersEnabled: v })
              }
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('hydration_interval')}</Text>
              <Text style={styles.rowSub}>
                Cada cuánto tiempo deseas el recordatorio.
              </Text>
            </View>
            <RNView style={styles.chipRow}>
              {[30, 45, 60, 90].map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() =>
                      setSettings({ hydrationIntervalMinutes: val })
                    }
                    style={[
                      styles.chip,
                      settings.hydrationIntervalMinutes === val
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>{val}m</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>

          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('active_breaks')}</Text>
              <Text style={styles.rowSub}>
                Recordatorios para moverte y estirar.
              </Text>
            </View>
            <Switch
              value={settings.activeBreaksEnabled}
              onValueChange={(v) => setSettings({ activeBreaksEnabled: v })}
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('breaks_interval')}</Text>
              <Text style={styles.rowSub}>
                Frecuencia de los recordatorios.
              </Text>
            </View>
            <RNView style={styles.chipRow}>
              {[60, 90, 120].map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() =>
                      setSettings({ activeBreaksIntervalMinutes: val })
                    }
                    style={[
                      styles.chip,
                      settings.activeBreaksIntervalMinutes === val
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>{val}m</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
          {/* Botones de prueba */}
          <RNView style={styles.testRow}>
            <TouchableOpacity
              onPress={testHydration}
              style={styles.testButtonBlue}
            >
              <Text style={styles.testButtonText}>{t('test_hydration')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={testActiveBreak}
              style={styles.testButtonGreen}
            >
              <Text style={styles.testButtonText}>{t('test_break')}</Text>
            </TouchableOpacity>
          </RNView>
        </View>

        {/* CONFIGURACIONES DE ADMINISTRADOR */}
        {isAdmin && (
          <>
            {/* Separador visual */}
            <View style={styles.adminDivider}>
              <Text style={styles.adminDividerText}>
                🔧 {t('admin_settings')}
              </Text>
            </View>

            {/* Publicidad */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('advertising')}</Text>

              {adConfigLoading ? (
            <RNView style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
              <Text style={styles.rowSub}>{t('ad_config_loading')}</Text>
            </RNView>
          ) : (
            <>
              {/* Frecuencia de anuncios */}
              <RNView style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowTitle}>{t('ad_frequency')}</Text>
                  <Text style={styles.rowSub}>
                    {t('ad_frequency_description')}
                  </Text>
                </View>
                <RNView style={styles.chipRow}>
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                    <RNView key={val}>
                      <TouchableOpacity
                        onPress={() => setPostsPerAd(val)}
                        style={[
                          styles.chip,
                          val === postsPerAd
                            ? styles.chipSelected
                            : styles.chipUnselected,
                        ]}
                      >
                        <Text style={styles.chipText}>{val}</Text>
                      </TouchableOpacity>
                    </RNView>
                  ))}
                </RNView>
              </RNView>

              {/* Distribución AdMob vs Propios */}
              <RNView style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowTitle}>{t('ad_ratio')}</Text>
                  <Text style={styles.rowSub}>
                    {t('ad_ratio_description')}
                  </Text>
                  <Text style={styles.adRatioInfo}>
                    {t('admob_percentage')}: {admobPercentage}% |{' '}
                    {t('own_ads_percentage')}: {100 - admobPercentage}%
                  </Text>
                </View>
              </RNView>

              {/* Slider de porcentaje AdMob */}
              <RNView style={styles.sliderRow}>
                {[0, 20, 40, 60, 80, 100].map((val) => (
                  <RNView key={val}>
                    <TouchableOpacity
                      onPress={() => setAdmobPercentage(val)}
                      style={[
                        styles.chip,
                        val === admobPercentage
                          ? styles.chipSelected
                          : styles.chipUnselected,
                      ]}
                    >
                      <Text style={styles.chipText}>{val}%</Text>
                    </TouchableOpacity>
                  </RNView>
                ))}
              </RNView>

              {/* Botón guardar */}
              <RNView style={styles.saveButtonContainer}>
                <TouchableOpacity
                  onPress={handleSaveAdConfig}
                  disabled={isSavingAdConfig}
                  style={[
                    styles.saveButton,
                    isSavingAdConfig && styles.saveButtonDisabled,
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {isSavingAdConfig ? t('saving') : t('save_ad_config')}
                  </Text>
                </TouchableOpacity>
              </RNView>
            </>
          )}
            </View>

            {/* Diagnóstico y caché (Solo Admin) */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>{t('diagnostics_cache')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('analytics')}</Text>
              <Text style={styles.rowSub}>
                Permite recolectar métricas de uso (opt‑in/out).
              </Text>
            </View>
            <Switch
              value={settings.analyticsEnabled}
              onValueChange={(v) => setSettings({ analyticsEnabled: v })}
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('log_level')}</Text>
              <Text style={styles.rowSub}>Controla el detalle en consola.</Text>
            </View>
            <RNView style={styles.chipRow}>
              {(['off', 'error', 'warn', 'info', 'debug'] as const).map(
                (val) => (
                  <RNView key={val}>
                    <TouchableOpacity
                      onPress={() => setSettings({ logLevel: val })}
                      style={[
                        styles.chip,
                        settings.logLevel === val
                          ? styles.chipSelected
                          : styles.chipUnselected,
                      ]}
                    >
                      <Text style={styles.chipText}>{val.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </RNView>
                )
              )}
            </RNView>
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('offline_cache')}</Text>
              <Text style={styles.rowSub}>
                Habilita almacenamiento para modo sin conexión.
              </Text>
            </View>
            <Switch
              value={settings.enableOfflineCache}
              onValueChange={(v) => setSettings({ enableOfflineCache: v })}
            />
          </RNView>
            </View>
          </>
        )}
        {/* FIN CONFIGURACIONES DE ADMINISTRADOR */}

        {/* Sección: Entrenamiento */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('training')}</Text>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('sound_cues')}</Text>
              <Text style={styles.rowSub}>
                Activa avisos al cambiar de fase del temporizador y al
                finalizar. Se guarda en este dispositivo.
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              disabled={loading}
            />
          </RNView>
          <RNView style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowTitle}>{t('prep_time')}</Text>
              <Text style={styles.rowSub}>
                Pausa breve antes de iniciar el siguiente ciclo (0 para
                desactivar).
              </Text>
            </View>
            <RNView style={styles.chipRow}>
              {[0, 5, 10, 15].map((val) => (
                <RNView key={val}>
                  <TouchableOpacity
                    onPress={() => changePrep(val)}
                    disabled={loading}
                    style={[
                      styles.chip,
                      val === prepSeconds
                        ? styles.chipSelected
                        : styles.chipUnselected,
                    ]}
                  >
                    <Text style={styles.chipText}>{val}s</Text>
                  </TouchableOpacity>
                </RNView>
              ))}
            </RNView>
          </RNView>
        </View>

        {/* Más opciones futuras */}
        <Text style={styles.footerText}>
          Más opciones de configuración estarán disponibles próximamente.
        </Text>
      </ScrollView>

      {/* Alerts */}
      <CustomAlert
        visible={showSuccessAlert}
        type="success"
        title="✅"
        message={alertMessage}
        onClose={() => setShowSuccessAlert(false)}
      />
      <CustomAlert
        visible={showErrorAlert}
        type="error"
        title="❌"
        message={alertMessage}
        onClose={() => setShowErrorAlert(false)}
      />
    </ScreenWrapper>
  );
}
