import React, { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { userAPI } from '@/services/apiExamples';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { useGenders } from './hooks/useLazyCatalogs';
import { Step2Data, Country, PhoneVerificationData, OTPValidationData } from './types';
import { handleApiError } from './utils/api';
import { formatDateToDisplay, formatDateForBackend, parseDisplayDate } from './utils/format';
import { commonStyles } from './styles/common';
import { FontAwesome } from '@expo/vector-icons';
import { useCustomAlert } from './CustomAlert';

interface Step2Props {
  userId: string;
  onNext: (data: Step2Data) => void;
  initialData?: Step2Data;
}

export default function Step2({ userId, onNext, initialData }: Step2Props) {
  const { genders, loading: gendersLoading, error: gendersError, loadGenders } = useGenders(true); // autoLoad = true
  const { showAlert, AlertComponent } = useCustomAlert();
  
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para verificación de teléfono
  const [phoneVerified, setPhoneVerified] = useState(initialData?.phoneVerified || false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'sms' | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'checking' | 'method' | 'code' | 'error'>('method');
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);
  
  const colorScheme = useColorScheme();

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
      showAlert('error', 'Error', 'Por favor ingresa un número de teléfono primero');
      return;
    }
    
    if (phone.length < 7) {
      showAlert('error', 'Error', 'El número de teléfono debe tener al menos 7 dígitos');
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
      const response = await userAPI.checkPhoneExists(fullPhone);
      
      if (response.Success && response.Data === true) {
        // El teléfono ya existe, mostrar mensaje de error en el modal
        setPhoneExists(true);
        setVerificationStep('error');
      } else {
        // El teléfono no existe, mostrar opciones de verificación
        setPhoneExists(false);
        setVerificationStep('method');
      }
      
    } catch (error) {
      console.error('Error checking phone existence:', error);
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
        Method: method
      };
      const response = await userAPI.sendPhoneVerification(data);
      if (response.Success || response.Success) {
        setVerificationStep('code');
      } else {
        showAlert('error', 'Error', response.Message || response.Message || 'Error al enviar verificación');
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showAlert('error', 'Error', errorMessage);
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const handleValidateOTP = async () => {
    console.log('🔍 [STEP2] handleValidateOTP iniciado');
    console.log('🔍 [STEP2] otpCode:', otpCode);
    console.log('🔍 [STEP2] otpCode.length:', otpCode.length);
    console.log('🔍 [STEP2] isVerificationLoading:', isVerificationLoading);
    
    if (!otpCode.trim()) {
      console.log('❌ [STEP2] Código OTP vacío');
      showAlert('error', 'Error', 'Por favor ingresa el código de verificación');
      return;
    }

    setIsVerificationLoading(true);
    console.log('📤 [STEP2] Enviando validación OTP...');
    
    try {
      const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
      const data: OTPValidationData = {
        UserId: userId,
        Otp: otpCode.trim(),
        VerificationType: 'Phone'
      };
      
      console.log('📤 [STEP2] Datos a enviar:', data);
      const response = await userAPI.validateOTP(data);
      console.log('📥 [STEP2] Respuesta recibida:', response);
      
      if (response.Success) {
        console.log('✅ [STEP2] Verificación exitosa');
        setPhoneVerified(true);
        setShowVerificationModal(false);
        setOtpCode('');
        showAlert('success', 'Éxito', '¡Teléfono verificado correctamente!');
      } else {
        console.log('❌ [STEP2] Verificación fallida:', response.Message);
        showAlert('error', 'Error', response.Message || 'Código incorrecto');
      }
    } catch (error: any) {
      console.error('❌ [STEP2] Error en validación OTP:', error);
      const errorMessage = handleApiError(error);
      showAlert('error', 'Error', errorMessage);
    } finally {
      setIsVerificationLoading(false);
      console.log('🔍 [STEP2] handleValidateOTP finalizado');
    }
  };

  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setVerificationStep('method');
    setVerificationMethod(null);
    setOtpCode('');
  };

  const handleNext = async () => {
    setIsLoading(true);

    const stepData: Step2Data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() ? `${selectedCountry.dialCode}${phone.trim()}` : undefined,
      birthDate: birthDate ? formatDateForBackend(birthDate.trim()) : undefined,
      genderId: selectedGender || undefined,
      phoneVerified: phoneVerified,
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
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
              Teléfono
            </Text>
            
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
                  name={phoneVerified ? "check-circle" : "phone"} 
                  size={12} 
                  color="white" 
                  style={{ marginRight: 4 }}
                />
                <Text style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: 12,
                }}>
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
                <Text style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  fontWeight: 'bold',
                }}>
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
                <Text style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  textAlign: 'center',
                }}>
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
                <Text style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                  {phoneExists ? 
                    'Este número de teléfono ya está registrado. Por favor usa otro número.' : 
                    'Hubo un error al verificar el teléfono. Por favor intenta nuevamente.'
                  }
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
                <Text style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
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
                  <FontAwesome name="whatsapp" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {isVerificationLoading && verificationMethod === 'whatsapp' 
                      ? 'Enviando...' 
                      : 'WhatsApp'
                    }
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
                  <FontAwesome name="comment" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {isVerificationLoading && verificationMethod === 'sms' 
                      ? 'Enviando...' 
                      : 'SMS'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                  Ingresa el código que recibiste por {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
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
                  placeholder="000000"
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
                    <Text style={{ color: Colors[colorScheme].text, fontWeight: '600' }}>
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
      
      {/* Componente de alertas personalizado */}
      <AlertComponent />
    </ScrollView>
  );
}
