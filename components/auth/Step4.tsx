import React, { memo } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import { Step4Data } from './types';
import { commonStyles } from './styles/common';
import { FITNESS_GOALS, HEALTH_CONDITIONS } from './data/fitness';
import { rhTypes } from './data/formData';
import { AdditionalInfoInput } from './AdditionalInfoInput';
import { useStep4Form } from './hooks/useStep4Form';

interface Step4Props {
  userId: string;
  onNext: (data: Step4Data) => void;
  initialData?: Step4Data;
}

const Step4 = memo<Step4Props>(({ userId, onNext, initialData }) => {
  const colorScheme = useColorScheme();
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
  } = useStep4Form({ userId, onNext, initialData });

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Objetivos de fitness
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
          Personaliza tu experiencia (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <Dropdown
          label="Objetivo principal"
          placeholder="¿Cuál es tu objetivo?"
          options={FITNESS_GOALS}
          value={fitnessGoal}
          onSelect={setFitnessGoal}
        />

        <Dropdown
          label="Condiciones de salud"
          placeholder="¿Tienes alguna restricción?"
          options={HEALTH_CONDITIONS}
          value={healthRestrictions}
          onSelect={setHealthRestrictions}
        />

        <Dropdown
          label="Tipo de sangre (RH)"
          placeholder="Selecciona tu tipo de sangre"
          options={rhTypes}
          value={rh}
          onSelect={setRh}
        />

        <AdditionalInfoInput
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />

        <TouchableOpacity
          style={[
            commonStyles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
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
    </ScrollView>
  );
});

Step4.displayName = 'Step4';

export default Step4;
