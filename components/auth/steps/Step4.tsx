import React, { memo, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../Themed';
import { useColorScheme } from '../../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from '../Dropdown';
import { Step4Data } from '../types';
import { commonStyles } from '../styles/common';
import { FITNESS_GOALS, HEALTH_CONDITIONS } from '../data/fitness';
import { rhTypes } from '../data/formData';
import { useStep4Form } from '../hooks/useStep4Form';
import { useCustomAlert } from '@/components/common/CustomAlert';

interface Step4Props {
  userId: string;
  onNext: (data: Step4Data) => void;
  onBack?: () => void;
  initialData?: Step4Data;
}

const Step4Inner = forwardRef<any, Step4Props>(
  ({ userId, onNext, onBack, initialData }, ref) => {
  const colorScheme = useColorScheme();
  const { showError, showSuccess, AlertComponent } = useCustomAlert();
  const {
    fitnessGoal,
    healthRestrictions,
    additionalInfo,
    rh,
    isLoading,
    setFitnessGoal,
    setHealthRestrictions,
    setAdditionalInfo,
    setRh,
    handleNext,
  } = useStep4Form({ userId, onNext, initialData, showError, showSuccess });

  useImperativeHandle(ref, () => ({
    snapshot: () => ({
      fitnessGoal,
      healthRestrictions,
      additionalInfo,
      rh,
    }),
  }));

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text
          style={[
            commonStyles.title,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
        >
          Objetivos de fitness
        </Text>
        <Text
          style={[
            commonStyles.subtitle,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
        >
          Personaliza tu experiencia (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <Dropdown
          label='Objetivo principal'
          options={FITNESS_GOALS}
          value={fitnessGoal}
          onSelect={setFitnessGoal}
        />

        <Dropdown
          label='Condiciones de salud'
          options={HEALTH_CONDITIONS}
          value={healthRestrictions}
          onSelect={setHealthRestrictions}
        />

        <Dropdown
          label='Tipo de sangre (RH)'
          options={rhTypes}
          value={rh}
          onSelect={setRh}
        />

        <View style={commonStyles.inputContainer}>
          <Text
            style={[
              commonStyles.label,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            Información adicional
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: '#666',
                height: 100,
                textAlignVertical: 'top',
              },
            ]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholderTextColor={`${Colors[colorScheme ?? 'light'].text}60`}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].tint,
            },
            isLoading && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading}
          accessibilityLabel='Continuar al siguiente paso'
          accessibilityRole='button'
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Cargando datos...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Componente de alertas personalizado */}
      <AlertComponent />
    </ScrollView>
  );
  }
);

Step4Inner.displayName = 'Step4';

export default memo(Step4Inner);
