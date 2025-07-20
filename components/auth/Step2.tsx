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
import { userAPI } from '@/services/apiExamples';

interface Step2Props {
  userId: string;
  onNext: (data: { firstName: string; lastName: string; phone?: string; birthDate?: string }) => void;
  onSkip: () => void;
  initialData?: { firstName: string; lastName: string; phone?: string; birthDate?: string };
}

export default function Step2({ userId, onNext, onSkip, initialData }: Step2Props) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      onSkip(); // Si no completan los campos básicos, consideramos como skip
      return;
    }

    console.log('🚀 [STEP 2] Iniciando actualización de datos básicos...');
    console.log('👤 [STEP 2] User ID:', userId);
    
    const stepData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      birthDate: birthDate.trim() || undefined,
    };
    
    console.log('📤 [STEP 2] Datos a enviar:', stepData);
    
    try {
      // Mapear a los campos del backend
      const updateData = {
        name: stepData.firstName,
        lastName: stepData.lastName,
        phone: stepData.phone,
        birthDate: stepData.birthDate,
      };
      
      console.log('📋 [STEP 2] Datos mapeados para API:', updateData);
      
      const response = await userAPI.updateUser(userId, updateData);
      console.log('✅ [STEP 2] Actualización exitosa:', response);
      
      // Verificar que la respuesta sea exitosa
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error) {
      console.error('❌ [STEP 2] Error al actualizar usuario:', error);
      // Por ahora continuamos aunque falle la API
      onNext(stepData);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.skipButtonTop} onPress={onSkip}>
          <Text style={[styles.skipButtonTopText, { color: Colors[colorScheme].text }]}>
            Omitir
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Datos básicos
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
          Cuéntanos un poco sobre ti (opcional)
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              Nombre
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: '#666',
                },
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Juan"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              autoCapitalize="words"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
              Apellido
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: '#666',
                },
              ]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Pérez"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Teléfono
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={phone}
            onChangeText={setPhone}
            placeholder="+57 300 123 4567"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Fecha de nacimiento
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: Colors[colorScheme].tint },
            ]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
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
  buttonContainer: {
    marginTop: 20,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButtonTop: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  skipButtonTopText: {
    fontSize: 16,
    opacity: 0.7,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
