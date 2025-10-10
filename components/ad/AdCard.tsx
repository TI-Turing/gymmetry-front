import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Linking, Alert } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { DynamicImage } from '@/components/common/DynamicImage';
import { advertisementService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { createAdCardStyles } from './styles/adCard';
import type { AdvertisementResponseDto } from '@/dto/Advertisement/Response/AdvertisementResponseDto';

interface AdCardProps {
  /**
   * Datos del anuncio a mostrar
   */
  ad: AdvertisementResponseDto;

  /**
   * Indica si el anuncio está actualmente visible en el viewport
   * Controlado por FlatList onViewableItemsChanged
   */
  isCurrentlyVisible?: boolean;

  /**
   * Callback cuando se registra una impresión
   */
  onImpressionTracked?: () => void;

  /**
   * Callback cuando se registra un click
   */
  onClickTracked?: () => void;
}

/**
 * Componente para mostrar anuncios propios en el feed
 *
 * Características:
 * - Tracking automático de impresiones (cuando visible >= 1 segundo)
 * - Tracking automático de clicks
 * - Badge "Anuncio" visible
 * - Botón CTA con texto personalizado
 * - Apertura de URL externa en navegador
 * - Manejo de errores graceful
 * - Soporte para modo claro/oscuro
 *
 * @example
 * ```typescript
 * <AdCard
 *   ad={advertisement}
 *   onImpressionTracked={() => console.log('Impresión registrada')}
 *   onClickTracked={() => console.log('Click registrado')}
 * />
 * ```
 */
export const AdCard: React.FC<AdCardProps> = ({
  ad,
  isCurrentlyVisible = false,
  onImpressionTracked,
  onClickTracked,
}) => {
  const styles = useThemedStyles(createAdCardStyles) as ReturnType<
    typeof createAdCardStyles
  >;
  const viewStartTime = useRef<number | null>(null);
  const impressionTracked = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track impresión cuando isCurrentlyVisible cambia a true
  useEffect(() => {
    // Solo trackear si está visible Y no se ha trackeado antes
    if (!isCurrentlyVisible || impressionTracked.current) {
      // Si ya no es visible, cancelar timer si existe
      if (!isCurrentlyVisible && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        viewStartTime.current = null;
      }
      return;
    }

    // Iniciar timer cuando se vuelve visible
    viewStartTime.current = Date.now();

    timerRef.current = setTimeout(() => {
      if (!impressionTracked.current && isCurrentlyVisible) {
        const viewDuration = Date.now() - (viewStartTime.current || Date.now());

        advertisementService
          .trackImpression({
            AdvertisementId: ad.Id,
            ViewDurationMs: viewDuration,
          })
          .then((resp) => {
            if (resp?.Success) {
              impressionTracked.current = true;
              onImpressionTracked?.();
            }
          })
          .catch(() => {
            // Silenciar errores de tracking para no interrumpir UX
          });
      }
    }, 2000); // Track después de 2 segundos de visibilidad confirmada

    // Cleanup: cancelar timer si se desmonta o cambia visibilidad
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isCurrentlyVisible, ad.Id, onImpressionTracked]);

  /**
   * Maneja el click en el anuncio
   */
  const handlePress = async () => {
    try {
      // 1. Registrar click en backend
      const resp = await advertisementService.trackClick({
        AdvertisementId: ad.Id,
      });

      if (resp?.Success) {
        onClickTracked?.();
      }

      // 2. Intentar abrir URL externa
      const canOpen = await Linking.canOpenURL(ad.TargetUrl);

      if (canOpen) {
        await Linking.openURL(ad.TargetUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace en tu dispositivo');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al abrir el enlace');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.92}
      accessibilityRole="button"
      accessibilityLabel={`Anuncio: ${ad.Title}`}
      accessibilityHint="Toca para ver más información"
    >
      {/* Badge de "Anuncio" */}
      <View style={styles.adBadge}>
        <FontAwesome
          name="bullhorn"
          size={12}
          color={styles.adBadgeText.color}
        />
        <Text style={styles.adBadgeText}>Anuncio</Text>
      </View>

      {/* Imagen del anuncio */}
      {ad.ImageUrl ? (
        <DynamicImage uri={ad.ImageUrl} style={styles.image} maxHeight={200} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <FontAwesome name="image" size={48} color="#999" />
          <Text style={styles.placeholderText}>Imagen no disponible</Text>
        </View>
      )}

      {/* Contenido del anuncio */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title} numberOfLines={2}>
          {ad.Title}
        </Text>

        {/* Descripción */}
        <Text style={styles.description} numberOfLines={3}>
          {ad.Description}
        </Text>

        {/* Botón CTA */}
        <View style={styles.ctaButton}>
          <Text style={styles.ctaText}>{ad.CtaText}</Text>
          <FontAwesome
            name="external-link"
            size={14}
            color={styles.ctaText.color}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
