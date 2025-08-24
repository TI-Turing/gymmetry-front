import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymOptionCardStyles } from './styles/optionCard';

interface QRScannerOptionProps {
  onPress: () => void;
}

export default function QRScannerOption({ onPress }: QRScannerOptionProps) {
  const { styles, colors } = useThemedStyles(makeGymOptionCardStyles);
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIcon}>
        <FontAwesome name="qrcode" size={32} color={colors.tint} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>Escanear Código QR</Text>
        <Text style={styles.optionSubtitle}>
          Escanea el código QR disponible en tu gimnasio
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.chevron} />
    </TouchableOpacity>
  );
}
