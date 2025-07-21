import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { userAPI } from '@/services/apiExamples';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';

// Imports locales
import { Step2Data, Country } from './types';
import { handleApiError } from './utils/api';
import { formatDateToDisplay, formatDateForBackend, parseDisplayDate } from './utils/format';
import { commonStyles } from './styles/common';

interface Step2Props {
  userId: string;
  onNext: (data: Step2Data) => void;
  onSkip: () => void;
  initialData?: Step2Data;
}

export default function Step2({ userId, onNext, onSkip, initialData }: Step2Props) {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      onSkip();
      return;
    }

    setIsLoading(true);

    const stepData: Step2Data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() ? `${selectedCountry.dialCode}${phone.trim()}` : undefined,
      birthDate: birthDate ? formatDateForBackend(birthDate.trim()) : undefined,
    };
    
    try {
      const updateData = {
        name: stepData.firstName,
        lastName: stepData.lastName,
        ...(stepData.phone && { phone: stepData.phone }),
        ...(stepData.birthDate && { birthDate: stepData.birthDate }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 2] Error:', errorMessage);
      // Continuar aunque falle la API para no bloquear el flujo
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(formatDateToDisplay(selectedDate));
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.topBar}>
        <TouchableOpacity style={commonStyles.skipButton} onPress={onSkip}>
          <Text style={[commonStyles.skipButtonText, { color: Colors[colorScheme].text }]}>
            Omitir
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={commonStyles.header}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme].text }]}>
          Datos básicos
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
          Cuéntanos un poco sobre ti (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <View style={commonStyles.row}>
          <View style={[commonStyles.inputContainer, commonStyles.halfWidth]}>
            <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
              Nombre
            </Text>
            <TextInput
              style={[
                commonStyles.input,
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

          <View style={[commonStyles.inputContainer, commonStyles.halfWidth]}>
            <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
              Apellido
            </Text>
            <TextInput
              style={[
                commonStyles.input,
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

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Teléfono
          </Text>
          <View style={commonStyles.phoneRow}>
            <View style={commonStyles.prefixContainer}>
              <CountryCodePicker
                selectedCountry={selectedCountry}
                onSelect={setSelectedCountry}
              />
            </View>
            <View style={commonStyles.phoneContainer}>
              <TextInput
                style={[
                  commonStyles.input,
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

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Fecha de nacimiento
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.input, 
              { 
                backgroundColor: Colors[colorScheme].background, 
                borderColor: '#666',
                justifyContent: 'center'
              }
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: Colors[colorScheme].text }}>
              {birthDate || 'Selecciona tu fecha de nacimiento'}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ? parseDisplayDate(birthDate) : new Date()}
              mode="date"
              display="default"
              maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
              onChange={handleDateChange}
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
              accentColor="#ff6300"
            />
          )}
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
            {isLoading ? 'Guardando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
