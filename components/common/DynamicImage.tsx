import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Dimensions, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SmartImage from './SmartImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DynamicImageProps {
  uri: string;
  deferOnDataSaver?: boolean;
  label?: string;
  maxHeight?: number;
  style?: object;
  mediaType?: string;
}

/**
 * Componente que maneja el aspect ratio dinámicamente tipo Facebook
 * - Imágenes cuadradas: se muestran cuadradas
 * - Imágenes verticales: se muestran con más height pero con límite
 * - Imágenes horizontales: se muestran con aspect ratio original
 * - Videos: muestra thumbnail con icono de play (requiere expo-av para reproducción)
 */
export const DynamicImage: React.FC<DynamicImageProps> = ({
  uri,
  deferOnDataSaver,
  label,
  maxHeight = 400,
  style,
  mediaType,
}) => {
  const isVideo =
    mediaType?.toLowerCase().includes('video') ||
    uri?.toLowerCase().includes('.mp4') ||
    uri?.toLowerCase().includes('.mov') ||
    uri?.toLowerCase().includes('.avi');
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!uri || typeof uri !== 'string') return;

    // Para videos, mostrar placeholder sin intentar obtener tamaño
    if (isVideo) {
      setImageSize({ width: SCREEN_WIDTH, height: 300 });
      return;
    }

    Image.getSize(
      uri,
      (width, height) => {
        setImageSize({ width, height });
      },
      () => {
        // Error obteniendo tamaño, usar tamaño por defecto
        setImageSize({ width: SCREEN_WIDTH, height: 200 });
      }
    );
  }, [uri, isVideo]);

  if (!imageSize) {
    // Mientras se obtiene el tamaño, mostrar placeholder
    return (
      <View
        style={[styles.placeholder, { width: '100%', height: 200 }, style]}
      />
    );
  }

  // Si es video, mostrar placeholder con icono de play
  if (isVideo) {
    const containerWidth = SCREEN_WIDTH - 32;
    const videoHeight = Math.min(300, maxHeight);

    return (
      <View style={[{ width: '100%', alignItems: 'center' }, style]}>
        <View
          style={[
            styles.videoPlaceholder,
            {
              width: containerWidth,
              height: videoHeight,
            },
          ]}
        >
          <View style={styles.playIconContainer}>
            <FontAwesome
              name="play-circle"
              size={64}
              color="rgba(255,255,255,0.9)"
            />
          </View>
          <Text style={styles.videoText}>Video</Text>
        </View>
      </View>
    );
  }

  // Calcular aspect ratio
  const aspectRatio = imageSize.width / imageSize.height;

  // Calcular dimensiones finales (usar ancho del contenedor)
  const containerWidth = SCREEN_WIDTH - 32; // Margen de 16px a cada lado
  let finalHeight = containerWidth / aspectRatio;

  // Limitar height máximo
  if (finalHeight > maxHeight) {
    finalHeight = maxHeight;
  }

  // Si la imagen es casi cuadrada (aspect ratio entre 0.9 y 1.1), forzar cuadrada
  const isSquarish = aspectRatio >= 0.9 && aspectRatio <= 1.1;
  if (isSquarish) {
    finalHeight = containerWidth;
  }

  return (
    <View style={[{ width: '100%', alignItems: 'center' }, style]}>
      <SmartImage
        uri={uri}
        style={{
          width: containerWidth,
          height: finalHeight,
          borderRadius: 12,
          marginBottom: 12,
          backgroundColor: '#f0f0f0',
        }}
        resizeMode={isSquarish ? 'cover' : 'contain'}
        deferOnDataSaver={deferOnDataSaver}
        label={label}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 12,
  },
  videoPlaceholder: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playIconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default DynamicImage;
