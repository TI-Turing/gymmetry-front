import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';

interface QRScannerOptionProps {
  onPress: () => void;
}

export default function QRScannerOption({ onPress }: QRScannerOptionProps) {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIcon}>
        <FontAwesome name='qrcode' size={32} color='#FF6B35' />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>Escanear Código QR</Text>
        <Text style={styles.optionSubtitle}>
          Escanea el código QR disponible en tu gimnasio
        </Text>
      </View>
      <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
});
