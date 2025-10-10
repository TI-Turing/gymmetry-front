import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { advertisementService } from '@/services';
import { useAdvertisements, useAdConfig } from '@/hooks/useAdvertisements';
import { AdCard } from '@/components/ad';
import { createDebugAdsScreenStyles } from './styles/debugAdsScreen';
import type { AdvertisementResponseDto } from '@/dto/Advertisement/Response/AdvertisementResponseDto';

/**
 * Pantalla de debug para testing del sistema de anuncios
 *
 * Funcionalidades:
 * - Ver todos los anuncios activos desde el backend
 * - Probar tracking de impresiones manual
 * - Probar tracking de clicks manual
 * - Ver configuración dinámica (postsPerAd, admobPercentage)
 * - Validar que los endpoints funcionan correctamente
 * - Testing visual del componente AdCard
 */
export default function DebugAdsScreen() {
  const styles = useThemedStyles(createDebugAdsScreenStyles) as ReturnType<
    typeof createDebugAdsScreenStyles
  >;

  // Hooks
  const { ads, loading, error, refetch } = useAdvertisements();
  const { postsPerAd, admobPercentage } = useAdConfig();

  // Estado local
  const [selectedAd, setSelectedAd] = useState<AdvertisementResponseDto | null>(
    null
  );
  const [trackingImpression, setTrackingImpression] = useState(false);
  const [trackingClick, setTrackingClick] = useState(false);
  const [trackingResults, setTrackingResults] = useState<string[]>([]);

  useEffect(() => {
    // Seleccionar primer ad por defecto
    if (ads.length > 0 && !selectedAd) {
      setSelectedAd(ads[0]);
    }
  }, [ads, selectedAd]);

  /**
   * Prueba manual de tracking de impresión
   */
  const handleTestImpression = async () => {
    if (!selectedAd) return;

    setTrackingImpression(true);
    try {
      const resp = await advertisementService.trackImpression({
        AdvertisementId: selectedAd.Id,
        ViewDurationMs: 2500, // Simular 2.5 segundos de visualización
      });

      if (resp?.Success) {
        const msg = `✅ Impresión registrada: Ad "${selectedAd.Title}" (2.5s)`;
        setTrackingResults((prev) => [msg, ...prev]);
      } else {
        const msg = `❌ Error impresión: ${resp?.Message || 'Unknown'}`;
        setTrackingResults((prev) => [msg, ...prev]);
      }
    } catch (err) {
      const msg = `❌ Exception: ${err}`;
      setTrackingResults((prev) => [msg, ...prev]);
    } finally {
      setTrackingImpression(false);
    }
  };

  /**
   * Prueba manual de tracking de click
   */
  const handleTestClick = async () => {
    if (!selectedAd) return;

    setTrackingClick(true);
    try {
      const resp = await advertisementService.trackClick({
        AdvertisementId: selectedAd.Id,
      });

      if (resp?.Success) {
        const msg = `✅ Click registrado: Ad "${selectedAd.Title}"`;
        setTrackingResults((prev) => [msg, ...prev]);
      } else {
        const msg = `❌ Error click: ${resp?.Message || 'Unknown'}`;
        setTrackingResults((prev) => [msg, ...prev]);
      }
    } catch (err) {
      const msg = `❌ Exception: ${err}`;
      setTrackingResults((prev) => [msg, ...prev]);
    } finally {
      setTrackingClick(false);
    }
  };

  /**
   * Limpia el log de resultados
   */
  const handleClearLog = () => {
    setTrackingResults([]);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧪 Debug - Sistema de Anuncios</Text>
        <Text style={styles.headerSubtitle}>Testing endpoints y tracking</Text>
      </View>

      {/* Configuración */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configuración Activa</Text>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Posts por Anuncio:</Text>
          <Text style={styles.configValue}>{postsPerAd}</Text>
        </View>
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>AdMob Percentage:</Text>
          <Text style={styles.configValue}>{admobPercentage}%</Text>
        </View>
      </View>

      {/* Lista de Anuncios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          📢 Anuncios Activos ({ads.length})
        </Text>

        {loading && ads.length === 0 ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : ads.length === 0 ? (
          <Text style={styles.emptyText}>No hay anuncios activos</Text>
        ) : (
          ads.map((ad) => (
            <TouchableOpacity
              key={ad.Id}
              style={[
                styles.adListItem,
                selectedAd?.Id === ad.Id && styles.adListItemSelected,
              ]}
              onPress={() => setSelectedAd(ad)}
            >
              <Text style={styles.adListTitle}>{ad.Title}</Text>
              <Text style={styles.adListPriority}>
                Priority: {ad.DisplayPriority}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Preview del Anuncio Seleccionado */}
      {selectedAd && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👁️ Preview</Text>
          <AdCard
            ad={selectedAd}
            onImpressionTracked={() => {
              const msg = `🔔 Callback: Impresión automática de "${selectedAd.Title}"`;
              setTrackingResults((prev) => [msg, ...prev]);
            }}
            onClickTracked={() => {
              const msg = `🔔 Callback: Click automático de "${selectedAd.Title}"`;
              setTrackingResults((prev) => [msg, ...prev]);
            }}
          />
        </View>
      )}

      {/* Controles de Testing */}
      {selectedAd && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Testing Manual</Text>
          <Text style={styles.testingNote}>
            Ad seleccionado: {selectedAd.Title}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.testButton,
                trackingImpression && styles.testButtonDisabled,
              ]}
              onPress={handleTestImpression}
              disabled={trackingImpression}
            >
              {trackingImpression ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.testButtonText}>
                  Track Impresión (2.5s)
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.testButton,
                trackingClick && styles.testButtonDisabled,
              ]}
              onPress={handleTestClick}
              disabled={trackingClick}
            >
              {trackingClick ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.testButtonText}>Track Click</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Log de Resultados */}
      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>📋 Log de Tracking</Text>
          {trackingResults.length > 0 && (
            <TouchableOpacity onPress={handleClearLog}>
              <Text style={styles.clearButton}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {trackingResults.length === 0 ? (
          <Text style={styles.emptyText}>
            Sin resultados aún. Prueba los botones de tracking arriba.
          </Text>
        ) : (
          trackingResults.map((result, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logText}>{result}</Text>
              <Text style={styles.logTimestamp}>
                {new Date().toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Footer con Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 Tip: El tracking automático ocurre cuando el AdCard se desmonta
          después de estar visible 1+ seg
        </Text>
      </View>
    </ScrollView>
  );
}
