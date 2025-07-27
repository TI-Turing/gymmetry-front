import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { FormInput } from '../common/FormInput';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DEFAULT_COUNTRY } from './CountryCodePicker';
import { useGenders } from './hooks/useLazyCatalogs';
import { useCustomAlert } from './CustomAlert';
import { commonStyles } from './styles/common';
import { Step2Data, Country } from './types';
import { handleApiError } from './utils/api';
import { formatDateToDisplay, parseDisplayDate } from './utils/format';
import Colors from '@/constants/Colors';
import { VALIDATION_CONSTANTS } from '@/constants/AppConstants';

interface Step2Props {
  userId: string;
  onNext: (data: Step2Data) => void;
  onBack?: () => void;
  initialData?: Step2Data;
  showError?: (message: string) => void;
  showSuccess?: (message: string) => void;
}

const Step2 = memo<Step2Props>(
  ({ userId, onNext, onBack, initialData, showError: externalShowError }) => {
    const colorScheme = useColorScheme();
    const { showError: internalShowError, AlertComponent } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;

    // Hooks de datos
    const {
      genders,
      loading: gendersLoading,
      error: gendersError,
      loadGenders,
    } = useGenders(true);

    // Estados del formulario
    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [selectedCountry] = useState<Country>(
      DEFAULT_COUNTRY || {
        code: 'CO',
        name: 'Colombia',
        dialCode: '+57',
        flag: '🇨🇴',
      }
    );
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [selectedGender, setSelectedGender] = useState<string>(
      initialData?.genderId || ''
    );
    const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');

    // Estados de UI
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validaciones memoizadas
    const isFormValid = useMemo(() => {
      return (
        firstName.trim().length >= VALIDATION_CONSTANTS.NAME.MIN_LENGTH &&
        lastName.trim().length >= VALIDATION_CONSTANTS.NAME.MIN_LENGTH &&
        birthDate.length > 0 &&
        selectedGender.length > 0
      );
    }, [firstName, lastName, birthDate, selectedGender]);

    const fullPhoneNumber = useMemo(() => {
      if (!phone.trim()) return '';
      return `${selectedCountry.dialCode}${phone}`;
    }, [selectedCountry.dialCode, phone]);

    const selectedGenderName = useMemo(() => {
      const gender = genders.find(g => g.Id === selectedGender);
      return gender?.Nombre || 'Seleccionar género';
    }, [selectedGender, genders]);

    // Carga inicial de géneros si hay error
    useEffect(() => {
      if (gendersError && genders.length === 0) {
        loadGenders();
      }
    }, [gendersError, genders.length, loadGenders]);

    // Manejadores de eventos
    const handleFirstNameChange = useCallback((text: string) => {
      setFirstName(text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''));
    }, []);

    const handleLastNameChange = useCallback((text: string) => {
      setLastName(text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''));
    }, []);

    const handlePhoneChange = useCallback((text: string) => {
      const numericOnly = text.replace(/[^0-9]/g, '');
      setPhone(numericOnly);
    }, []);

    const handleDateChange = useCallback((_: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        if (formattedDate) {
          setBirthDate(formattedDate);
        }
      }
    }, []);

    const handleGenderSelect = useCallback((genderId: string) => {
      setSelectedGender(genderId);
      setShowGenderModal(false);
    }, []);

    const handleNext = useCallback(async () => {
      if (!isFormValid) {
        showError('Complete todos los campos requeridos');
        return;
      }

      setIsLoading(true);

      const stepData: Step2Data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(phone.trim() && { phone: fullPhoneNumber }),
        birthDate,
        genderId: selectedGender,
        phoneVerified: false, // Por simplicidad, sin verificación por ahora
      };

      try {
        // Simplificamos para que funcione - solo pasamos al siguiente paso
        onNext(stepData);
      } catch (error: any) {
        handleApiError(error);
        showError('No se pudieron guardar los datos. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }, [
      isFormValid,
      firstName,
      lastName,
      fullPhoneNumber,
      birthDate,
      selectedGender,
      userId,
      onNext,
      showError,
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
              Datos personales
            </Text>
            <Text
              style={[
                commonStyles.subtitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Completa tu información básica
            </Text>
          </View>

          <View style={commonStyles.form}>
            <FormInput
              label='Nombre'
              value={firstName}
              onChangeText={handleFirstNameChange}
              placeholder='Tu nombre'
              autoCapitalize='words'
              autoCorrect={false}
              textContentType='givenName'
              autoComplete='given-name'
              required
              error={
                firstName.trim().length > 0 &&
                firstName.trim().length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH
                  ? `El nombre debe tener al menos ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} caracteres`
                  : ''
              }
              accessibilityLabel='Campo de nombre'
              accessibilityHint='Ingresa tu nombre'
            />

            <FormInput
              label='Apellido'
              value={lastName}
              onChangeText={handleLastNameChange}
              placeholder='Tu apellido'
              autoCapitalize='words'
              autoCorrect={false}
              textContentType='familyName'
              autoComplete='family-name'
              required
              error={
                lastName.trim().length > 0 &&
                lastName.trim().length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH
                  ? `El apellido debe tener al menos ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH} caracteres`
                  : ''
              }
              accessibilityLabel='Campo de apellido'
              accessibilityHint='Ingresa tu apellido'
            />

            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Fecha de nacimiento *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel='Seleccionar fecha de nacimiento'
                accessibilityHint='Presiona para abrir el selector de fecha'
              >
                <Text
                  style={{
                    color: birthDate
                      ? Colors[colorScheme].text
                      : `${Colors[colorScheme].text}60`,
                    fontSize: 16,
                  }}
                >
                  {birthDate
                    ? formatDateToDisplay(parseDisplayDate(birthDate))
                    : 'Selecciona tu fecha de nacimiento'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Género *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => setShowGenderModal(true)}
                disabled={gendersLoading}
                accessibilityLabel='Seleccionar género'
                accessibilityHint='Presiona para abrir la lista de géneros'
              >
                {gendersLoading ? (
                  <LoadingSpinner size='small' />
                ) : (
                  <Text
                    style={{
                      color: selectedGender
                        ? Colors[colorScheme].text
                        : `${Colors[colorScheme].text}60`,
                      fontSize: 16,
                    }}
                  >
                    {selectedGenderName}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Teléfono (opcional)
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#666',
                    borderRadius: 8,
                    padding: 12,
                    marginRight: 10,
                    backgroundColor: Colors[colorScheme].background,
                  }}
                >
                  <Text style={{ color: Colors[colorScheme].text }}>
                    {selectedCountry.flag} {selectedCountry.dialCode}
                  </Text>
                </View>
                <FormInput
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder='123456789'
                  keyboardType='numeric'
                  textContentType='telephoneNumber'
                  autoComplete='tel'
                  containerStyle={{ flex: 1 }}
                  accessibilityLabel='Campo de teléfono'
                  accessibilityHint='Ingresa tu número de teléfono'
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              {onBack && (
                <Button
                  title='Atrás'
                  onPress={onBack}
                  variant='outline'
                  size='large'
                  style={{ flex: 1 }}
                />
              )}

              <Button
                title={isLoading ? 'Guardando...' : 'Continuar'}
                onPress={handleNext}
                disabled={!isFormValid || isLoading}
                loading={isLoading}
                variant='primary'
                size='large'
                style={{ flex: onBack ? 1 : undefined }}
                accessibilityLabel='Botón para continuar al siguiente paso'
                accessibilityHint='Presiona para guardar los datos y continuar'
              />
            </View>
          </View>

          {/* Modal de selección de género */}
          <Modal
            visible={showGenderModal}
            transparent={true}
            animationType='slide'
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
                  maxHeight: '80%',
                }}
                onStartShouldSetResponder={() => true}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: Colors[colorScheme].text,
                    marginBottom: 20,
                    textAlign: 'center',
                  }}
                >
                  Selecciona tu género
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {genders.map(gender => (
                    <TouchableOpacity
                      key={gender.Id}
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: `${Colors[colorScheme].text}20`,
                      }}
                      onPress={() => handleGenderSelect(gender.Id)}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors[colorScheme].text,
                        }}
                      >
                        {gender.Nombre}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* DateTimePicker */}
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ? parseDisplayDate(birthDate) : new Date()}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Componente de alertas personalizado */}
          <AlertComponent />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

Step2.displayName = 'Step2';

export default Step2;
