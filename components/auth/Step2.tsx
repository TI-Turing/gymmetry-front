import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import AuthContainer from './AuthContainer';
import { userAPI } from '../../services/apiExamples';
import { UpdateUserRequest } from '../../dto/user';
import { filterEmptyFields } from '../../utils/objectUtils';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { step2Styles as styles } from './styles';

interface Step2Props {
  userId: string;
  onNext: (data: { firstName: string; lastName: string; phone?: string; birthDate?: string }) => void;
  onSkip: () => void;
  initialData?: { firstName: string; lastName: string; phone?: string; birthDate?: string };
}

export default function Step2({ userId, onNext, onSkip, initialData }: Step2Props) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colorScheme = useColorScheme();

  // Función para formatear fecha en formato DD/MM/YYYY
  const formatDate = (date: Date): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para convertir fecha DD/MM/AAAA a objeto Date
  const parseDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Los meses van de 0-11
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date();
  };

  // Función para convertir fecha DD/MM/AAAA a YYYY-MM-DD para el backend
  const convertDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

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
      phone: (selectedCountry.dialCode + phone).trim() || undefined,
      birthDate: birthDate ? convertDateForBackend(birthDate.trim()) : undefined,
    };
    
    console.log('📤 [STEP 2] Datos a enviar:', stepData);
    
    try {
      // Mapear a los campos del backend y usar helper para filtrar campos vacíos
      const rawUpdateData = {
        id: userId,
        name: stepData.firstName,
        lastName: stepData.lastName,
        phone: stepData.phone,
        birthDate: stepData.birthDate
      };
      
      // Filtrar campos vacíos usando la función helper
      const updateData = filterEmptyFields(rawUpdateData);
      
      console.log('📋 [STEP 2] Datos filtrados para API:', updateData);
      
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

  // Función para manejar cambio de fecha desde el DateTimePicker
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Formato DD/MM/AAAA
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      setBirthDate(formattedDate);
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
          <View style={styles.phoneRow}>
            <View style={styles.prefixContainer}>
              <CountryCodePicker
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
            </View>
            <View style={styles.phoneContainer}>
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
                placeholder="300 123 4567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Fecha de nacimiento</Text>
          <TouchableOpacity
            style={[styles.input, { backgroundColor: Colors[colorScheme].background, borderColor: '#666' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: Colors[colorScheme].text }}>
              {birthDate ? formatDate(parseDate(birthDate)) : 'Selecciona tu fecha de nacimiento'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={parseDate(birthDate)}
              mode="date"
              display="default"
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
              onChange={handleDateChange}
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
              accentColor="#ff6300"
            />
          )}
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
