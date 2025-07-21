import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import { userAPI } from '@/services/apiExamples';

// Imports locales
import { Step4Data } from './types';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';
import { FITNESS_GOALS, HEALTH_CONDITIONS } from './data/fitness';

interface Step4Props {
  userId: string;
  onNext: (data: Step4Data) => void;
  initialData?: Step4Data;
}

export default function Step4({ userId, onNext, initialData }: Step4Props) {
  const [fitnessGoal, setFitnessGoal] = useState(initialData?.fitnessGoal || '');
  const [healthRestrictions, setHealthRestrictions] = useState(initialData?.healthRestrictions || '');
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || '');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    setIsLoading(true);
    
    const stepData: Step4Data = {
      fitnessGoal: fitnessGoal || undefined,
      healthRestrictions: healthRestrictions || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
    };
    
    try {
      const updateData = {
        ...(stepData.fitnessGoal && { fitnessGoal: stepData.fitnessGoal }),
        ...(stepData.healthRestrictions && { physicalExceptions: stepData.healthRestrictions }),
        ...(stepData.additionalInfo && { additionalInfo: stepData.additionalInfo }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 4] Error:', errorMessage);
      // Continuar aunque falle la API para no bloquear el flujo
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme].text }]}>
          Objetivos de fitness
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
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

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Información adicional
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                minHeight: 100,
                textAlignVertical: 'top',
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholder="Cuéntanos cualquier cosa que consideres importante..."
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            { backgroundColor: Colors[colorScheme].tint },
            isLoading && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Finalizando...' : 'Finalizar registro'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
