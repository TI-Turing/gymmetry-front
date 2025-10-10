import React, { useState } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeSmartImageStyles } from './styles/smartImage';

type Props = {
  uri?: string | number | null; // Acepta string (URL remota) o number (require local)
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center' | 'repeat';
  deferOnDataSaver?: boolean; // si true, con ahorro de datos no carga hasta que el usuario toque
  label?: string; // etiqueta opcional para el botón de carga
};

export function SmartImage({
  uri,
  style,
  resizeMode = 'cover',
  deferOnDataSaver = false,
  label,
}: Props) {
  const { settings } = useAppSettings();
  const styles = useThemedStyles(makeSmartImageStyles);
  const [shouldLoad, setShouldLoad] = useState(
    !settings.dataSaver || !deferOnDataSaver
  );
  const [hasError, setHasError] = useState(false);

  // Determinar si es recurso local (number) o remoto (string)
  const isLocalResource = typeof uri === 'number';

  if (!uri) {
    return <View style={[styles.placeholder, style as ImageStyle]} />;
  }

  // Mostrar mensaje de error elegante si la imagen falló
  if (hasError) {
    return (
      <View style={[styles.errorContainer, style as ImageStyle]}>
        <Text style={styles.errorText}>Imagen no disponible</Text>
      </View>
    );
  }

  // Recursos locales siempre se cargan (no aplica data saver)
  if (!shouldLoad && !isLocalResource) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label || 'Cargar imagen'}
        onPress={() => setShouldLoad(true)}
        style={[styles.deferredButton, style as ImageStyle]}
      >
        <Text style={styles.deferredText}>
          Tocar para cargar imagen (Ahorro de datos)
        </Text>
      </TouchableOpacity>
    );
  }

  // Para recursos locales: usar directamente el número
  // Para URLs remotas: usar { uri: string }
  const imageSource = isLocalResource ? uri : { uri: uri as string };

  return (
    <Image
      source={imageSource}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        // Silenciar error completamente y mostrar fallback visual
        setHasError(true);
      }}
    />
  );
}

export default SmartImage;
