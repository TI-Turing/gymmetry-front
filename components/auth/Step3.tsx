import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { userAPI } from '@/services/apiExamples';

// Imports locales
import { Step3Data, Country } from './types';
import { EPS_OPTIONS, COUNTRIES, COLOMBIA_REGIONS, COLOMBIA_CITIES } from './data/colombia';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';

interface Step3Props {
  userId: string;
  onNext: (data: Step3Data) => void;
  initialData?: Step3Data;
}

export default function Step3({ userId, onNext, initialData }: Step3Props) {
  const [eps, setEps] = useState(initialData?.eps || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyPhone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handleNext = async () => {
    setIsLoading(true);
    
    const stepData: Step3Data = {
      eps: eps || undefined,
      country: country || undefined,
      region: region || undefined,
      city: city || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() ? `${selectedCountry.dialCode}${emergencyPhone.trim()}` : undefined,
      address: address.trim() || undefined,
    };
    
    try {
      const updateData = {
        emergencyName: stepData.emergencyContact,
        emergencyPhone: stepData.emergencyPhone,
        address: stepData.address,
        ...(stepData.eps && { eps: stepData.eps }),
        ...(stepData.country && { country: stepData.country }),
        ...(stepData.region && { region: stepData.region }),
        ...(stepData.city && { city: stepData.city }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 3] Error:', errorMessage);
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
          Información personal
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
          Datos adicionales para tu perfil (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        <Dropdown
          label="EPS"
          placeholder="Selecciona tu EPS"
          options={EPS_OPTIONS}
          value={eps}
          onSelect={setEps}
        />

        <Dropdown
          label="País"
          placeholder="Selecciona tu país"
          options={COUNTRIES}
          value={country}
          onSelect={setCountry}
          searchable
        />

        <Dropdown
          label="Región/Departamento"
          placeholder="Selecciona tu región"
          options={COLOMBIA_REGIONS}
          value={region}
          onSelect={setRegion}
          searchable
        />

        <Dropdown
          label="Ciudad"
          placeholder="Selecciona tu ciudad"
          options={COLOMBIA_CITIES}
          value={city}
          onSelect={setCity}
          searchable
        />

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Nombre de un contacto de emergencia
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
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Nombre completo"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            autoCapitalize="words"
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Teléfono del contacto de emergencia
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
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                placeholder="300 123 4567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Dirección
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              commonStyles.multilineInput,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle, carrera, número, apartamento..."
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={3}
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
            {isLoading ? 'Guardando...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
