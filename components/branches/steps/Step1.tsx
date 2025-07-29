import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { FormInput } from '@/components/common';
import { AccessMethodDropdown } from '@/components/common/dropdowns';
import { GymAdminDropdown } from '@/components/gym';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface Step1Props {
  formData: {
    name: string;
    address: string;
    accessMethodId: string;
    adminUserId: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  errors?: { [key: string]: string };
}

export default function Step1({
  formData,
  onFormDataChange,
  errors,
}: Step1Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Paso 1: Información Básica</Text>
      <Text style={styles.stepDescription}>
        Completa la información básica de la nueva sede
      </Text>

      <FormInput
        label='Nombre de la sede'
        value={formData.name}
        onChangeText={text => onFormDataChange('name', text)}
        required
        error={errors?.name}
      />

      <FormInput
        label='Dirección'
        value={formData.address}
        onChangeText={text => onFormDataChange('address', text)}
        required
        error={errors?.address}
      />

      <AccessMethodDropdown
        label='Método de acceso'
        value={formData.accessMethodId}
        onValueChange={value => onFormDataChange('accessMethodId', value)}
        required
      />

      <GymAdminDropdown
        label='Administrador principal del gym'
        value={formData.adminUserId}
        onValueChange={value => onFormDataChange('adminUserId', value)}
        required
      />
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
    marginBottom: UI_CONSTANTS.SPACING.LG,
    lineHeight: 22,
  },
});
