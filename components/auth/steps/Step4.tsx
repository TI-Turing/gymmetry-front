import React, { memo, forwardRef, useImperativeHandle } from 'react';
import { TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../Themed';
import { useColorScheme } from '../../useColorScheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStep4Styles } from '../styles/step4';
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

const Step4Inner = forwardRef<
  { snapshot: () => Partial<Step4Data> },
  Step4Props
>(({ userId, onNext, onBack, initialData }, ref) => {
  const colorScheme = useColorScheme();
  const styles = useThemedStyles(makeStep4Styles);
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
        <Text style={[commonStyles.title, { color: styles.colors.text }]}>
          Objetivos de fitness
        </Text>
        <Text style={[commonStyles.subtitle, { color: styles.colors.text }]}>
          Personaliza tu experiencia (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <Dropdown
          label="Objetivo principal"
          options={FITNESS_GOALS}
          value={fitnessGoal}
          onSelect={setFitnessGoal}
        />

        <Dropdown
          label="Condiciones de salud"
          options={HEALTH_CONDITIONS}
          value={healthRestrictions}
          onSelect={setHealthRestrictions}
        />

        <Dropdown
          label="Tipo de sangre (RH)"
          options={rhTypes}
          value={rh}
          onSelect={setRh}
        />

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: styles.colors.text }]}>
            Información adicional
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              styles.input,
              { height: 100, textAlignVertical: 'top' },
            ]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholderTextColor={styles.colors.placeholder}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            styles.button,
            isLoading && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading}
          accessibilityLabel="Continuar al siguiente paso"
          accessibilityRole="button"
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
});

Step4Inner.displayName = 'Step4';

export default memo(Step4Inner);
