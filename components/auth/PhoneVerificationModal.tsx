import React, { memo } from 'react';
import { Modal, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { commonStyles } from './styles/common';

interface PhoneVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  verificationStep: 'checking' | 'method' | 'code' | 'error';
  verificationMethod: 'whatsapp' | 'sms' | null;
  selectedCountryDialCode: string;
  phone: string;
  otpCode: string;
  isLoading: boolean;
  onSendVerification: (method: 'whatsapp' | 'sms') => Promise<void>;
  onValidateOTP: () => Promise<void>;
  onOTPChange: (code: string) => void;
  onChangeMethod: () => void;
  onRetryCheck?: () => void;
}

export const PhoneVerificationModal = memo<PhoneVerificationModalProps>(
  ({
    visible,
    onClose,
    verificationStep,
    verificationMethod,
    selectedCountryDialCode,
    phone,
    otpCode,
    isLoading,
    onSendVerification,
    onValidateOTP,
    onOTPChange,
    onChangeMethod,
    onRetryCheck,
  }) => {
    const colorScheme = useColorScheme();

    const handleOTPChange = (text: string) => {
      const numericOnly = text.replace(/[^0-9]/g, '').slice(0, 6);
      onOTPChange(numericOnly);
    };

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
        onRequestClose={onClose}
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
          onPress={onClose}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].background,
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
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                Verificar Teléfono
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: `${Colors[colorScheme ?? 'light'].text}10`,
                }}
                accessibilityLabel='Cerrar modal'
                accessibilityRole='button'
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors[colorScheme ?? 'light'].text,
                    fontWeight: 'bold',
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Estado: Cargando/verificando */}
            {verificationStep === 'checking' && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                }}
              >
                <FontAwesome
                  name='spinner'
                  size={40}
                  color={Colors[colorScheme ?? 'light'].tint}
                  style={{ marginBottom: 16 }}
                />
                <Text
                  style={{
                    color: Colors[colorScheme ?? 'light'].text,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  Verificando número...
                </Text>
              </View>
            )}

            {/* Estado: Error - número ya registrado */}
            {verificationStep === 'error' && (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120,
                }}
              >
                <FontAwesome
                  name='exclamation-triangle'
                  size={40}
                  color={Colors[colorScheme ?? 'light'].tint}
                  style={{ marginBottom: 16 }}
                />
                <Text
                  style={{
                    color: Colors[colorScheme ?? 'light'].text,
                    fontSize: 16,
                    textAlign: 'center',
                    marginBottom: 12,
                  }}
                >
                  Este número ya está registrado en Gymmetry, intenta con otro.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors[colorScheme ?? 'light'].tint,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    minWidth: 120,
                    alignItems: 'center',
                  }}
                  onPress={onClose}
                  accessibilityLabel='Cerrar'
                  accessibilityRole='button'
                >
                  <Text
                    style={{ color: 'white', fontWeight: '600', fontSize: 16 }}
                  >
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Estado: Selección de método */}
            {verificationStep === 'method' && (
              <>
                <Text
                  style={{
                    color: Colors[colorScheme ?? 'light'].text,
                    marginBottom: 20,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  ¿Cómo quieres recibir el código de verificación?
                </Text>
                <Text
                  style={{
                    color: `${Colors[colorScheme ?? 'light'].text}80`,
                    marginBottom: 20,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  {selectedCountryDialCode}
                  {phone}
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#25D366',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onSendVerification('whatsapp')}
                  disabled={isLoading}
                  accessibilityLabel='Enviar código por WhatsApp'
                  accessibilityRole='button'
                >
                  <FontAwesome
                    name='whatsapp'
                    size={20}
                    color='white'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{ color: 'white', fontWeight: '600', fontSize: 16 }}
                  >
                    WhatsApp
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: Colors[colorScheme ?? 'light'].tint,
                    padding: 16,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => onSendVerification('sms')}
                  disabled={isLoading}
                  accessibilityLabel='Enviar código por SMS'
                  accessibilityRole='button'
                >
                  <FontAwesome
                    name='comment'
                    size={20}
                    color='white'
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{ color: 'white', fontWeight: '600', fontSize: 16 }}
                  >
                    SMS
                  </Text>
                </TouchableOpacity>

                {isLoading && (
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].text,
                      textAlign: 'center',
                      marginTop: 16,
                      fontStyle: 'italic',
                    }}
                  >
                    Enviando código...
                  </Text>
                )}
              </>
            )}

            {/* Estado: Ingreso de código OTP */}
            {verificationStep === 'code' && (
              <>
                <Text
                  style={{
                    color: Colors[colorScheme ?? 'light'].text,
                    marginBottom: 8,
                    fontSize: 16,
                    textAlign: 'center',
                  }}
                >
                  Código enviado vía{' '}
                  {verificationMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                </Text>
                <Text
                  style={{
                    color: `${Colors[colorScheme ?? 'light'].text}80`,
                    marginBottom: 20,
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  Ingresa el código de 6 dígitos que recibiste
                </Text>

                <View style={{ marginBottom: 20 }}>
                  <TextInput
                    style={[
                      commonStyles.input,
                      {
                        backgroundColor:
                          Colors[colorScheme ?? 'light'].background,
                        color: Colors[colorScheme ?? 'light'].text,
                        borderColor: '#666',
                        textAlign: 'center',
                        fontSize: 18,
                        letterSpacing: 2,
                      },
                    ]}
                    value={otpCode}
                    onChangeText={handleOTPChange}
                    placeholder='000000'
                    placeholderTextColor={`${Colors[colorScheme ?? 'light'].text}60`}
                    keyboardType='number-pad'
                    maxLength={6}
                    accessibilityLabel='Código de verificación'
                    accessibilityRole='text'
                  />
                </View>

                <TouchableOpacity
                  style={[
                    commonStyles.button,
                    {
                      backgroundColor: Colors[colorScheme ?? 'light'].tint,
                      marginBottom: 12,
                    },
                    (isLoading || !otpCode.trim()) && { opacity: 0.6 },
                  ]}
                  onPress={onValidateOTP}
                  disabled={isLoading || !otpCode.trim()}
                  accessibilityLabel='Verificar código'
                  accessibilityRole='button'
                >
                  <Text style={commonStyles.buttonText}>
                    {isLoading ? 'Verificando...' : 'Verificar Código'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 12,
                    alignItems: 'center',
                  }}
                  onPress={onChangeMethod}
                  accessibilityLabel='Cambiar método de envío'
                  accessibilityRole='button'
                >
                  <Text
                    style={{
                      color: Colors[colorScheme ?? 'light'].tint,
                      fontSize: 14,
                      textDecorationLine: 'underline',
                    }}
                  >
                    Cambiar método de envío
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
);
