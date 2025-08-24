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
  uri?: string | null;
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

  if (!uri) {
    return <View style={[styles.placeholder, style as any]} />;
  }

  if (!shouldLoad) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label || 'Cargar imagen'}
        onPress={() => setShouldLoad(true)}
        style={[styles.deferredButton, style as any]}
      >
        <Text style={styles.deferredText}>
          Tocar para cargar imagen (Ahorro de datos)
        </Text>
      </TouchableOpacity>
    );
  }

  return <Image source={{ uri }} style={style} resizeMode={resizeMode} />;
}

export default SmartImage;
