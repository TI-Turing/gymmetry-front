import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { userAPI } from '@/services/apiExamples';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { useGenders } from './hooks/useLazyCatalogs';
import { Step2Data, Country } from './types';
import { handleApiError } from './utils/api';
import { formatDateToDisplay, formatDateForBackend, parseDisplayDate } from './utils/format';
import { commonStyles } from './styles/common';

interface Step2Props {
  userId: string;
  onNext: (data: Step2Data) => void;
  initialData?: Step2Data;
}

export default function Step2({ userId, onNext, initialData }: Step2Props) {
  const { genders, loading: gendersLoading, error: gendersError, loadGenders } = useGenders(true); // autoLoad = true
  
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const handlePhoneChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setPhone(numericOnly);
  };

  const handleNext = async () => {
    setIsLoading(true);

    const stepData: Step2Data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() ? `${selectedCountry.dialCode}${phone.trim()}` : undefined,
      birthDate: birthDate ? formatDateForBackend(birthDate.trim()) : undefined,
      genderId: selectedGender || undefined,
    };
    
    try {
      const updateData = {
        name: stepData.firstName,
        lastName: stepData.lastName,
        ...(stepData.phone && { phone: stepData.phone }),
        ...(stepData.birthDate && { birthDate: stepData.birthDate }),
        ...(stepData.genderId && { IdGender: stepData.genderId }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 2] Error:', errorMessage);
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
                keyboardType="number-pad"
                onChangeText={handlePhoneChange}
                placeholder="3001234567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                maxLength={10}
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

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Género
          </Text>
          {gendersLoading ? (
            <View style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                justifyContent: 'center'
              }
            ]}>
              <Text style={{ color: `${Colors[colorScheme].text}60` }}>
                Cargando géneros...
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                commonStyles.input,
                {
                  backgroundColor: Colors[colorScheme].background,
                  borderColor: '#666',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }
              ]}
              onPress={() => setShowGenderModal(true)}
            >
              <Text style={{
                color: selectedGender 
                  ? Colors[colorScheme].text 
                  : `${Colors[colorScheme].text}60`
              }}>
                {selectedGender 
                  ? genders.find(g => g.Id === selectedGender)?.Nombre || 'Género seleccionado'
                  : 'Selecciona tu género'
                }
              </Text>
              <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
                ▼
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Modal para selección de género */}
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
            activeOpacity={1}
            onPress={() => setShowGenderModal(false)}
          >
            <View
              style={{
                backgroundColor: Colors[colorScheme].background,
                borderRadius: 12,
                padding: 20,
                width: '90%',
                maxWidth: 400,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
              onStartShouldSetResponder={() => true}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: Colors[colorScheme].text,
                }}>
                  Seleccionar Género
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowGenderModal(false)}
                  style={{
                    padding: 8,
                    borderRadius: 20,
                    backgroundColor: `${Colors[colorScheme].text}10`,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    color: Colors[colorScheme].text,
                    fontWeight: 'bold',
                  }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                {genders.map((gender, index) => (
                  <TouchableOpacity
                    key={gender.Id}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      marginBottom: index === genders.length - 1 ? 0 : 8,
                      backgroundColor: selectedGender === gender.Id 
                        ? `${Colors[colorScheme].tint}10` 
                        : 'transparent',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setSelectedGender(gender.Id);
                      setShowGenderModal(false);
                    }}
                  >
                    <Text style={{
                      color: selectedGender === gender.Id 
                        ? Colors[colorScheme].tint 
                        : Colors[colorScheme].text,
                      fontWeight: selectedGender === gender.Id ? '600' : 'normal',
                      fontSize: 16,
                    }}>
                      {gender.Nombre}
                    </Text>
                    {selectedGender === gender.Id && (
                      <Text style={{
                        color: Colors[colorScheme].tint,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

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
