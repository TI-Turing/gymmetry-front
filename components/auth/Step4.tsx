import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import { userAPI } from '@/services/apiExamples';
import { filterEmptyFields } from '../../utils/objectUtils';

interface Step4Props {
  userId: string;
  onNext: (data: {
    fitnessGoal?: string;
    healthRestrictions?: string;
    additionalInfo?: string;
  }) => void;
  initialData?: {
    fitnessGoal?: string;
    healthRestrictions?: string;
    additionalInfo?: string;
  };
}

const FITNESS_GOALS = [
  'Perder peso',
  'Ganar masa muscular',
  'Mantener peso actual',
  'Mejorar resistencia cardiovascular',
  'Aumentar fuerza',
  'Mejorar flexibilidad',
  'Rehabilitación',
  'Preparación deportiva',
  'Bienestar general',
  'Otro',
];

const HEALTH_CONDITIONS = [
  'Ninguna',
  'Asma',
  'Diabetes',
  'Hipertensión',
  'Problemas cardíacos',
  'Lesiones articulares',
  'Problemas de espalda',
  'Alergias',
  'Embarazo',
  'Otra condición',
];

export default function Step4({ userId, onNext, initialData }: Step4Props) {
  const [fitnessGoal, setFitnessGoal] = useState(initialData?.fitnessGoal || '');
  const [healthRestrictions, setHealthRestrictions] = useState(initialData?.healthRestrictions || '');
  const [additionalInfo, setAdditionalInfo] = useState(initialData?.additionalInfo || '');
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    console.log('🚀 [STEP 4] Iniciando actualización de información fitness...');
    console.log('👤 [STEP 4] User ID:', userId);
    
    const stepData = {
      fitnessGoal: fitnessGoal || undefined,
      healthRestrictions: healthRestrictions || undefined,
      additionalInfo: additionalInfo.trim() || undefined,
    };
    
    console.log('📤 [STEP 4] Datos a enviar:', stepData);
    
    try {
      // Mapear a los campos del backend y usar helper para filtrar campos vacíos
      const rawUpdateData = {
        id: userId,
        physicalExceptions: stepData.healthRestrictions,
        fitnessGoal: stepData.fitnessGoal, // TODO: Verificar si existe en el backend
        additionalInfo: stepData.additionalInfo // TODO: Verificar si existe en el backend
      };
      
      // Filtrar campos vacíos usando la función helper
      const updateData = filterEmptyFields(rawUpdateData);
      
      console.log('📋 [STEP 4] Datos filtrados para API:', updateData);
      
      const response = await userAPI.updateUser(userId, updateData);
      console.log('✅ [STEP 4] Actualización exitosa:', response);
      
      // Verificar que la respuesta sea exitosa
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error) {
      console.error('❌ [STEP 4] Error al actualizar usuario:', error);
      // Por ahora continuamos aunque falle la API
      onNext(stepData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Información fitness
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
          Ayúdanos a personalizar tu experiencia
        </Text>
      </View>

      <View style={styles.form}>
        <Dropdown
          label="Objetivo fitness principal"
          placeholder="¿Cuál es tu objetivo?"
          options={FITNESS_GOALS}
          value={fitnessGoal}
          onSelect={setFitnessGoal}
        />

        <Dropdown
          label="Restricciones de salud"
          placeholder="¿Tienes alguna condición médica?"
          options={HEALTH_CONDITIONS}
          value={healthRestrictions}
          onSelect={setHealthRestrictions}
        />

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Información adicional
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.multilineInput,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholder="Cuéntanos sobre tu experiencia con el ejercicio, lesiones previas, medicamentos que tomas, o cualquier otra información relevante..."
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: Colors[colorScheme].text }]}>
            ℹ️ Esta información nos ayuda a recomendarte ejercicios seguros y adecuados para ti. 
            Siempre consulta con tu médico antes de comenzar cualquier programa de ejercicios.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.finishButton,
            { backgroundColor: Colors[colorScheme].tint },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.finishButtonText}>
            Finalizar registro
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 120,
  },
  infoBox: {
    backgroundColor: 'rgba(255, 99, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  finishButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
