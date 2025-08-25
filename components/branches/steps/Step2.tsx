import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface Step2Props {
  branchId: string;
  formData?: unknown; // no se usa internamente aún
  onFormDataChange?: (field: string, value: unknown) => void; // hook in futuro
}

export default function Step2({ branchId }: Step2Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Paso 2: Información Adicional</Text>
      <Text style={styles.stepDescription}>
        Sede creada exitosamente con ID: {branchId}
      </Text>
      <Text style={styles.stepDescription}>
        Aquí puedes agregar información adicional y configuraciones de la sede.
      </Text>

      {/* Placeholder para futuras funcionalidades */}
      <View style={styles.placeholderContainer}>
        <FontAwesome name="info-circle" size={32} color={Colors.dark.tint} />
        <Text style={styles.placeholderTitle}>Configuraciones Adicionales</Text>
        <Text style={styles.placeholderText}>• Horarios de funcionamiento</Text>
        <Text style={styles.placeholderText}>• Capacidad máxima</Text>
        <Text style={styles.placeholderText}>• Servicios disponibles</Text>
        <Text style={styles.placeholderText}>• Equipamiento</Text>
        <Text style={styles.placeholderNote}>
          Estas funcionalidades se implementarán próximamente
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: UI_CONSTANTS.SPACING.LG,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  stepDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: UI_CONSTANTS.SPACING.MD,
    lineHeight: 22,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: UI_CONSTANTS.SPACING.XL,
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    marginTop: UI_CONSTANTS.SPACING.LG,
  },
  placeholderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: UI_CONSTANTS.SPACING.MD,
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  placeholderText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: UI_CONSTANTS.SPACING.SM,
    textAlign: 'center',
  },
  placeholderNote: {
    color: '#888888',
    fontSize: 14,
    marginTop: UI_CONSTANTS.SPACING.MD,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
