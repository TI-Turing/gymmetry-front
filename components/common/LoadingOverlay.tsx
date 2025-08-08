import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES } from '@/constants/Theme';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  style?: ViewStyle;
}

/**
 * Componente de overlay de carga reutilizable
 */
export function LoadingOverlay({
  visible,
  message,
  style,
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.overlay, style]}>
      <View style={styles.container}>
        <ActivityIndicator size='large' color={Colors.tint} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.background,
    padding: SPACING.lg,
    borderRadius: SPACING.md,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    color: Colors.text,
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
