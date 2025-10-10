import React, { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import Constants from 'expo-constants';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { Text } from '@/components/Themed';
import { createAdMobBannerStyles } from './styles/AdMobBannerStyles';

// Importación condicional de AdMob (solo si está disponible Y no es web)
let BannerAd: any;
let BannerAdSize: any;
let TestIds: any;

// NO cargar AdMob en web ni en Expo Go
if (Platform.OS !== 'web') {
  try {
    const admob = require('react-native-google-mobile-ads');
    BannerAd = admob.BannerAd;
    BannerAdSize = admob.BannerAdSize;
    TestIds = admob.TestIds;
  } catch (error) {
    // AdMob no disponible (Expo Go) - componente no renderizará nada
  }
}

/**
 * Props para el componente AdMobBanner
 */
interface AdMobBannerProps {
  /**
   * Callback cuando el anuncio se carga exitosamente
   */
  onAdLoaded?: () => void;

  /**
   * Callback cuando el anuncio falla al cargar
   */
  onAdFailedToLoad?: (error: Error) => void;

  /**
   * Callback cuando el usuario abre el anuncio
   */
  onAdOpened?: () => void;

  /**
   * Callback cuando el anuncio se cierra
   */
  onAdClosed?: () => void;

  /**
   * Tamaño del banner (por defecto: ADAPTIVE_BANNER)
   */
  size?: (typeof BannerAdSize)[keyof typeof BannerAdSize];
}

/**
 * Obtiene el Ad Unit ID correcto según plataforma y entorno
 */
const getAdUnitId = (): string => {
  // Si TestIds no está disponible, usar IDs de env o fallback
  if (!TestIds) {
    return Platform.OS === 'android'
      ? Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID || ''
      : Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID || '';
  }

  const useTestIds =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_USE_TEST_IDS === 'true';

  if (useTestIds) {
    // Usar Test IDs en desarrollo
    return Platform.OS === 'android' ? TestIds.BANNER : TestIds.BANNER;
  }

  // Usar IDs reales en producción
  if (Platform.OS === 'android') {
    return (
      Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_ID ||
      (TestIds ? TestIds.BANNER : '')
    );
  } else {
    return (
      Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_IOS_BANNER_ID ||
      (TestIds ? TestIds.BANNER : '')
    );
  }
};

/**
 * Componente que renderiza un banner de AdMob
 *
 * Características:
 * - Usa Test IDs en desarrollo, Real IDs en producción
 * - Banner responsive (adaptive)
 * - Manejo robusto de errores
 * - Callbacks para todos los eventos
 * - Estilos temáticos (dark/light)
 * - Badge identificador
 *
 * IMPORTANTE: Requiere desarrollo build (no funciona en Expo Go)
 */
export const AdMobBanner: React.FC<AdMobBannerProps> = ({
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdClosed,
  size,
}) => {
  const styles = useThemedStyles(createAdMobBannerStyles);
  const [adError, setAdError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const adUnitId = getAdUnitId();
  const useTestIds =
    Constants.expoConfig?.extra?.EXPO_PUBLIC_ADMOB_USE_TEST_IDS === 'true';

  // Usar BANNER por defecto si no se especifica size
  const bannerSize = size || BannerAdSize?.BANNER;

  useEffect(() => {
    // Reset states cuando cambia el adUnitId
    setAdError(null);
    setIsLoaded(false);
  }, [adUnitId]);

  /**
   * Handler cuando el anuncio se carga exitosamente
   */
  const handleAdLoaded = () => {
    setIsLoaded(true);
    setAdError(null);
    onAdLoaded?.();
  };

  /**
   * Handler cuando el anuncio falla al cargar
   */
  const handleAdFailedToLoad = (error: Error) => {
    console.log('❌ [AdMobBanner] Error al cargar:', error.message);
    setIsLoaded(false);
    setAdError(error.message);
    onAdFailedToLoad?.(error);
  };

  /**
   * Handler cuando el usuario abre el anuncio
   */
  const handleAdOpened = () => {
    onAdOpened?.();
  };

  /**
   * Handler cuando el anuncio se cierra
   */
  const handleAdClosed = () => {
    onAdClosed?.();
  };

  // Si AdMob no está disponible (Expo Go), mostrar placeholder
  if (!BannerAd || !BannerAdSize || !TestIds) {
    console.log('⚠️ [AdMobBanner] Módulos no disponibles (Expo Go), mostrando placeholder');
    return (
      <View style={styles.container}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ANUNCIO (PLACEHOLDER)</Text>
          </View>
        </View>
        <View style={[styles.bannerContainer, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', height: 50 }]}>
          <Text style={{ color: '#999', fontSize: 12 }}>
            📱 AdMob Banner (requiere development build o APK)
          </Text>
        </View>
      </View>
    );
  }

  console.log('🎯 [AdMobBanner] Renderizando banner:', {
    adUnitId,
    useTestIds,
    bannerSize,
    isLoaded,
    adError,
  });

  return (
    <View style={styles.container}>
      {/* Badge de identificación */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {useTestIds ? 'ANUNCIO (TEST)' : 'ANUNCIO'}
          </Text>
        </View>
      </View>

      {/* Banner de AdMob */}
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={adUnitId}
          size={bannerSize}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          onAdOpened={handleAdOpened}
          onAdClosed={handleAdClosed}
        />
      </View>

      {/* Mensaje de error (si existe) */}
      {adError && !isLoaded && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el anuncio</Text>
          {__DEV__ && <Text style={styles.errorDetails}>{adError}</Text>}
        </View>
      )}

      {/* Indicador de carga (mientras se carga el primer anuncio) */}
      {!isLoaded && !adError && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando anuncio...</Text>
        </View>
      )}
    </View>
  );
};
