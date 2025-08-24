import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '../../Themed';
import { useColorScheme } from '../../useColorScheme';
import Colors from '@/constants/Colors';
import { userService } from '@/services/userService';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryCodePicker, { DEFAULT_COUNTRY } from '../CountryCodePicker';
import { useGenders } from '../hooks/useLazyCatalogs';
import {
  Step2Data,
  Country,
  PhoneVerificationData,
  OTPValidationData,
} from '../types';
import { handleApiError } from '../utils/api';
import {
  formatDateToDisplay,
  formatDateForBackend,
  parseDisplayDate,
} from '../utils/format';
import { commonStyles } from '../styles/common';
import { FontAwesome } from '@expo/vector-icons';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStep2Styles } from '../styles/step2';

interface Step2Props {
  userId: string;
  onNext: (data: Step2Data) => void;
  onBack?: () => void;
  initialData?: Step2Data;
}
export default forwardRef<{ snapshot: () => Partial<Step2Data> }, Step2Props>(
  function Step2({ userId, onNext, initialData }: Step2Props, ref) {
    const { genders, loading: gendersLoading } = useGenders(true); // autoLoad = true
    const { showError, showSuccess, AlertComponent } = useCustomAlert();

    const [firstName, setFirstName] = useState(initialData?.firstName || '');
    const [lastName, setLastName] = useState(initialData?.lastName || '');
    const [selectedCountry, setSelectedCountry] = useState<Country>(
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
    const [showGenderModal, setShowGenderModal] = useState(false);
    const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para verificación de teléfono
    const [phoneVerified, setPhoneVerified] = useState(
      initialData?.phoneVerified || false
    );
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState<
      'whatsapp' | 'sms' | null
    >(null);
    const [otpCode, setOtpCode] = useState<string>('');
    const [isVerificationLoading, setIsVerificationLoading] = useState(false);
    const [verificationStep, setVerificationStep] = useState<
      'checking' | 'method' | 'code' | 'error'
    >('method');
    const [phoneExists, setPhoneExists] = useState<boolean | null>(null);

    const colorScheme = useColorScheme();
    const styles = useThemedStyles(makeStep2Styles);

    const handlePhoneChange = (text: string) => {
      const numericOnly = text.replace(/[^0-9]/g, '');
      setPhone(numericOnly);
      // Reset verification status when phone changes
      if (phoneVerified) {
        setPhoneVerified(false);
      }
    };

    const handleVerifyPhone = async () => {
      if (!phone.trim()) {
        showError('Por favor ingresa un número de teléfono primero');
        return;
      }

      if (phone.length < 7) {
        showError('El número de teléfono debe tener al menos 7 dígitos');
        return;
      }

      // Abrir modal inmediatamente y mostrar loading
      setShowVerificationModal(true);
      setVerificationStep('checking');
      setIsVerificationLoading(true);
      setVerificationMethod(null);
      setOtpCode('');

      // Verificar si el teléfono existe
      try {
        const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
        const response = await userService.checkPhoneExists(fullPhone);

        if (response.Success) {
          if (response.Data === true) {
            // El teléfono YA EXISTE en la base de datos, NO permitir generar OTP
            setPhoneExists(true);
            setVerificationStep('error');
          } else {
            // El teléfono NO EXISTE, permitir generar OTP
            setPhoneExists(false);
            setVerificationStep('method');
          }
        } else {
          // Error en la respuesta de la API
          setVerificationStep('error');
          setPhoneExists(null);
        }
      } catch {
        setVerificationStep('error');
        setPhoneExists(null);
      } finally {
        setIsVerificationLoading(false);
      }
    };

    const handleSendVerification = async (method: 'whatsapp' | 'sms') => {
      setIsVerificationLoading(true);
      setVerificationMethod(method);
      try {
        const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
        const data: PhoneVerificationData = {
          UserId: userId,
          VerificationType: 'Phone',
          Recipient: fullPhone,
          Method: method,
        };
        const response = await userService.requestOtp({
          userId: data.UserId,
          verificationType: data.VerificationType,
          recipient: data.Recipient,
          method: data.Method,
        });
        if (response.Success || response.Success) {
          setVerificationStep('code');
        } else {
          showError(
            response.Message ||
              response.Message ||
              'Error al enviar verificación'
          );
        }
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        showError(errorMessage);
      } finally {
        setIsVerificationLoading(false);
      }
    };

    const handleValidateOTP = async () => {
      if (!otpCode.trim()) {
        showError('Por favor ingresa el código de verificación');
        return;
      }

      setIsVerificationLoading(true);

      try {
        const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
        const data: OTPValidationData = {
          UserId: userId,
          Otp: otpCode.trim(),
          VerificationType: 'Phone',
          Recipient: fullPhone,
        };

        const response = await userService.validateOtp({
          userId: data.UserId,
          otp: data.Otp,
          verificationType: data.VerificationType,
          recipient: data.Recipient,
        });

        if (response.Success) {
          setPhoneVerified(true);
          setShowVerificationModal(false);
          setOtpCode('');
          showSuccess('¡Teléfono verificado correctamente!');
        } else {
          showError(response.Message || 'Código incorrecto');
        }
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        showError(errorMessage);
      } finally {
        setIsVerificationLoading(false);
      }
    };

    const closeVerificationModal = () => {
      setShowVerificationModal(false);
      setVerificationStep('method');
      setVerificationMethod(null);
      setOtpCode('');
    };

    // Exponer snapshot de valores actuales para preservar al retroceder
    useImperativeHandle(ref, () => ({
      snapshot: () => ({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim()
          ? `${selectedCountry.dialCode}${phone.trim()}`
          : undefined,
        birthDate: birthDate || undefined,
        genderId: selectedGender || undefined,
        phoneVerified: phoneVerified,
      }),
    }));

    const handleNext = async () => {
      setIsLoading(true);

      const stepData: Step2Data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim()
          ? `${selectedCountry.dialCode}${phone.trim()}`
          : undefined,
        birthDate: birthDate
          ? formatDateForBackend(birthDate.trim())
          : undefined,
        genderId: selectedGender || undefined,
        phoneVerified: phoneVerified,
      };

      try {
        const updateData = {
          Name: stepData.firstName,
          LastName: stepData.lastName,
          UserName: stepData.firstName + ' ' + stepData.lastName,
          Phone: stepData.phone || null,
          BirthDate: stepData.birthDate || null,
          IdGender: stepData.genderId || null,
          // Propiedades requeridas con valores por defecto
          IdEps: null,
          DocumentTypeId: null,
          CountryId: null,
          Address: null,
          CityId: null,
          RegionId: null,
          Rh: null,
          EmergencyName: null,
          EmergencyPhone: null,
          PhysicalExceptions: null,
          UserTypeId: null,
          PhysicalExceptionsNotes: null,
        };

        const response = await userService.updateUser({
          Id: userId,
          ...updateData,
        });

        if (!response.Success) {
          showError(
            response.Message ||
              'Error al actualizar los datos. Intenta de nuevo.'
          );
          return; // NO permitir avanzar si la API falla
        }

        onNext(stepData);
      } catch (error: unknown) {
        const errorMessage = handleApiError(error);
        showError(errorMessage);
        // NO avanzar en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    const handleDateChange = (event: unknown, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setBirthDate(formatDateToDisplay(selectedDate));
      }
    };

    return (
      <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={commonStyles.header}>
          <Text
            style={[commonStyles.title, { color: Colors[colorScheme].text }]}
          >
            Datos básicos
          </Text>
          <Text
            style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}
          >
            Cuéntanos un poco sobre ti (opcional)
          </Text>
        </View>

        <View style={commonStyles.form}>
          <View style={commonStyles.row}>
            <View style={[commonStyles.inputContainer, commonStyles.halfWidth]}>
              <Text style={[commonStyles.label, styles.label]}>Nombre</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                autoCapitalize="words"
              />
            </View>

            <View style={[commonStyles.inputContainer, commonStyles.halfWidth]}>
              <Text style={[commonStyles.label, styles.label]}>Apellido</Text>
              <TextInput
                style={[commonStyles.input, styles.input]}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={commonStyles.inputContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Text style={[commonStyles.label, styles.label]}>Teléfono</Text>

              {/* Botón de verificación pequeño al lado del label */}
              {phone.length >= 7 && (
                <TouchableOpacity
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    backgroundColor: phoneVerified
                      ? '#4CAF50'
                      : Colors[colorScheme].tint,
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={handleVerifyPhone}
                  disabled={phoneVerified}
                >
                  <FontAwesome
                    name={phoneVerified ? 'check-circle' : 'phone'}
                    size={12}
                    color="white"
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: 12,
                    }}
                  >
                    {phoneVerified ? 'Verificado' : 'Verificar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={commonStyles.phoneRow}>
              <View style={commonStyles.prefixContainer}>
                <CountryCodePicker
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                  disabled={phoneVerified}
                />
              </View>
              <View
                style={[commonStyles.phoneContainer, { position: 'relative' }]}
              >
                <TextInput
                  style={[
                    commonStyles.input,
                    {
                      backgroundColor: phoneVerified
                        ? `${Colors[colorScheme].text}15`
                        : Colors[colorScheme].background,
                      color: Colors[colorScheme].text,
                      borderColor: phoneVerified
                        ? `${Colors[colorScheme].text}40`
                        : (styles as any).input.borderColor,
                      paddingRight: phoneVerified ? 40 : 16,
                      opacity: phoneVerified ? 0.8 : 1,
                    },
                  ]}
                  value={phone}
                  keyboardType="number-pad"
                  onChangeText={handlePhoneChange}
                  placeholderTextColor={`${Colors[colorScheme].text}60`}
                  maxLength={10}
                  editable={!phoneVerified}
                />
                {phoneVerified && (
                  <View
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: [{ translateY: -8 }],
                    }}
                  >
                    <FontAwesome
                      name="lock"
                      size={16}
                      color={`${Colors[colorScheme].text}80`}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, styles.label]}>
              Fecha de nacimiento
            </Text>
            <TouchableOpacity
              style={[
                commonStyles.input,
                {
                  backgroundColor: Colors[colorScheme].background,
                  borderColor: (styles as any).input.borderColor,
                  justifyContent: 'center',
                },
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
                maximumDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 10)
                  )
                }
                onChange={handleDateChange}
                themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                accentColor={Colors[colorScheme].tint}
              />
            )}
          </View>

          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, styles.label]}>Género</Text>
            {gendersLoading ? (
              <View
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: (styles as any).input.borderColor,
                    justifyContent: 'center',
                  },
                ]}
              >
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
                    borderColor: (styles as any).input.borderColor,
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => setShowGenderModal(true)}
              >
                <Text
                  style={{
                    color: selectedGender
                      ? Colors[colorScheme].text
                      : `${Colors[colorScheme].text}60`,
                  }}
                >
                  {selectedGender
                    ? genders.find((g) => g.Id === selectedGender)?.Nombre ||
                      'Género seleccionado'
                    : 'Selecciona tu género'}
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
                backgroundColor: Colors[colorScheme].overlay,
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: Colors[colorScheme].text,
                    }}
                  >
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
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors[colorScheme].text,
                        fontWeight: 'bold',
                      }}
                    >
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
                        backgroundColor:
                          selectedGender === gender.Id
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
                      <Text
                        style={{
                          color:
                            selectedGender === gender.Id
                              ? Colors[colorScheme].tint
                              : Colors[colorScheme].text,
                          fontWeight:
                            selectedGender === gender.Id ? '600' : 'normal',
                          fontSize: 16,
                        }}
                      >
                        {gender.Nombre}
                      </Text>
                      {selectedGender === gender.Id && (
                        <Text
                          style={{
                            color: Colors[colorScheme].tint,
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}
                        >
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
              {
                backgroundColor: Colors[colorScheme].tint,
              },
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

        {/* Modal de verificación de teléfono */}
        <Modal
          visible={showVerificationModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeVerificationModal}
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
            onPress={closeVerificationModal}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: Colors[colorScheme].text,
                  }}
                >
                  Verificar teléfono
                </Text>
                <TouchableOpacity
                  onPress={closeVerificationModal}
                  style={{
                    padding: 8,
                    borderRadius: 20,
                    backgroundColor: `${Colors[colorScheme].text}10`,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      fontWeight: 'bold',
                    }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {verificationStep === 'checking' ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <FontAwesome
                    name="spinner"
                    size={32}
                    color={Colors[colorScheme].tint}
                    style={{ marginBottom: 16 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      textAlign: 'center',
                    }}
                  >
                    Verificando disponibilidad del teléfono...
                  </Text>
                </View>
              ) : verificationStep === 'error' ? (
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                  <FontAwesome
                    name="exclamation-triangle"
                    size={32}
                    color="#FF6B6B"
                    style={{ marginBottom: 16 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      textAlign: 'center',
                      marginBottom: 20,
                    }}
                  >
                    {phoneExists
                      ? 'Este número de teléfono ya está registrado en la base de datos. Por favor usa otro número.'
                      : 'Hubo un error al verificar el teléfono. Por favor intenta nuevamente.'}
                  </Text>
                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: Colors[colorScheme].tint,
                      alignItems: 'center',
                    }}
                    onPress={closeVerificationModal}
                  >
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                      Cerrar
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : verificationStep === 'method' ? (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      marginBottom: 20,
                      textAlign: 'center',
                    }}
                  >
                    ¿Cómo quieres recibir el código de verificación?
                  </Text>

                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: '#25D366',
                      marginBottom: 12,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleSendVerification('whatsapp')}
                    disabled={isVerificationLoading}
                  >
                    <FontAwesome
                      name="whatsapp"
                      size={20}
                      color="white"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      {isVerificationLoading &&
                      verificationMethod === 'whatsapp'
                        ? 'Enviando...'
                        : 'WhatsApp'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: Colors[colorScheme].tint,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => handleSendVerification('sms')}
                    disabled={isVerificationLoading}
                  >
                    <FontAwesome
                      name="comment"
                      size={20}
                      color="white"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                      }}
                    >
                      {isVerificationLoading && verificationMethod === 'sms'
                        ? 'Enviando...'
                        : 'SMS'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors[colorScheme].text,
                      marginBottom: 20,
                      textAlign: 'center',
                    }}
                  >
                    Ingresa el código que recibiste por{' '}
                    {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                  </Text>

                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: '#666',
                      borderRadius: 8,
                      padding: 16,
                      fontSize: 18,
                      textAlign: 'center',
                      marginBottom: 20,
                      backgroundColor: Colors[colorScheme].background,
                      color: Colors[colorScheme].text,
                      letterSpacing: 4,
                    }}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    placeholderTextColor={`${Colors[colorScheme].text}60`}
                    keyboardType="number-pad"
                    maxLength={6}
                  />

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: `${Colors[colorScheme].text}20`,
                        alignItems: 'center',
                      }}
                      onPress={() => setVerificationStep('method')}
                    >
                      <Text
                        style={{
                          color: Colors[colorScheme].text,
                          fontWeight: '600',
                        }}
                      >
                        Cambiar método
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        padding: 16,
                        borderRadius: 8,
                        backgroundColor: Colors[colorScheme].tint,
                        alignItems: 'center',
                      }}
                      onPress={handleValidateOTP}
                      disabled={isVerificationLoading || otpCode.length < 4}
                    >
                      <Text style={{ color: 'white', fontWeight: '600' }}>
                        {isVerificationLoading ? 'Verificando...' : 'Verificar'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        <AlertComponent />
      </ScrollView>
    );
  }
);
