import React, { memo, useState, useCallback } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { FormInput } from '../common/FormInput';
import { Button } from '../common/Button';
import { useCustomAlert } from './CustomAlert';
import { commonStyles } from './styles/common';
import { Step4Data } from './types';
import { handleApiError } from './utils/api';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import { FITNESS_GOALS, HEALTH_CONDITIONS } from './data/fitness';
import { rhTypes } from './data/formData';

interface Step4Props {
  userId?: string;
  onNext: (data: Step4Data) => void;
  onBack?: () => void;
  initialData?: Step4Data;
  showError?: (message: string) => void;
  showSuccess?: (message: string) => void;
}

const Step4 = memo<Step4Props>(
  ({
    onNext,
    onBack,
    initialData,
    showError: externalShowError,
    showSuccess: externalShowSuccess,
  }) => {
    const colorScheme = useColorScheme();
    const {
      showError: internalShowError,
      showSuccess: internalShowSuccess,
      AlertComponent,
    } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;
    const showSuccess = externalShowSuccess || internalShowSuccess;

    // Estados del formulario
    const [fitnessGoal, setFitnessGoal] = useState(
      initialData?.fitnessGoal || ''
    );
    const [healthRestrictions, setHealthRestrictions] = useState(
      initialData?.healthRestrictions || ''
    );
    const [additionalInfo, setAdditionalInfo] = useState(
      initialData?.additionalInfo || ''
    );
    const [rh, setRh] = useState(initialData?.rh || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleNext = useCallback(async () => {
      setIsLoading(true);

      const stepData: Step4Data = {
        ...(fitnessGoal && { fitnessGoal }),
        ...(healthRestrictions && { healthRestrictions }),
        ...(rh && { rh }),
        ...(additionalInfo.trim() && { additionalInfo: additionalInfo.trim() }),
      };

      try {
        // Aquí iría la llamada API para guardar los datos
        // Por simplicidad, solo pasamos al siguiente paso
        onNext(stepData);
        showSuccess && showSuccess('Información guardada correctamente');
      } catch (error: any) {
        handleApiError(error);
        showError('No se pudieron guardar los datos. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }, [
      fitnessGoal,
      healthRestrictions,
      rh,
      additionalInfo,
      onNext,
      showError,
      showSuccess,
    ]);

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            commonStyles.container,
            { paddingBottom: 20 },
          ]}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.header}>
            <Text
              style={[commonStyles.title, { color: Colors[colorScheme].text }]}
            >
              Objetivos de fitness
            </Text>
            <Text
              style={[
                commonStyles.subtitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Personaliza tu experiencia (opcional)
            </Text>
          </View>

          <View style={commonStyles.form}>
            {/* Objetivo principal */}
            <Dropdown
              label='Objetivo principal'
              placeholder='¿Cuál es tu objetivo?'
              options={FITNESS_GOALS}
              value={fitnessGoal}
              onSelect={setFitnessGoal}
            />

            {/* Condiciones de salud */}
            <Dropdown
              label='Condiciones de salud'
              placeholder='¿Tienes alguna restricción?'
              options={HEALTH_CONDITIONS}
              value={healthRestrictions}
              onSelect={setHealthRestrictions}
            />

            {/* Tipo de sangre */}
            <Dropdown
              label='Tipo de sangre (RH)'
              placeholder='Selecciona tu tipo de sangre'
              options={rhTypes}
              value={rh}
              onSelect={setRh}
            />

            {/* Información adicional */}
            <FormInput
              label='Información adicional'
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholder='Cualquier información adicional que quieras compartir...'
              multiline
              numberOfLines={4}
              accessibilityLabel='Campo de información adicional'
              accessibilityHint='Ingresa cualquier información adicional sobre tu salud o objetivos'
            />

            {/* Botones de navegación */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              {onBack && (
                <Button
                  title='Atrás'
                  onPress={onBack}
                  variant='outline'
                  size='large'
                  style={{ flex: 1 }}
                  accessibilityLabel='Botón para regresar al paso anterior'
                  accessibilityHint='Presiona para regresar al paso anterior'
                />
              )}

              <Button
                title={isLoading ? 'Guardando...' : 'Finalizar'}
                onPress={handleNext}
                disabled={isLoading}
                loading={isLoading}
                variant='primary'
                size='large'
                style={{ flex: onBack ? 1 : undefined }}
                accessibilityLabel='Botón para finalizar el registro'
                accessibilityHint='Presiona para completar el registro'
              />
            </View>
          </View>

          {/* Componente de alertas personalizado */}
          <AlertComponent />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

Step4.displayName = 'Step4';

export default Step4;
