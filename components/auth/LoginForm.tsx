import React, { useState, useCallback } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { useCustomAlert } from './CustomAlert';
import { handleApiError } from '@/utils';
import { commonStyles } from './styles/common';
import Colors from '@/constants/Colors';

interface LoginFormProps {
  onLogin: (userNameOrEmail: string, password: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
}: LoginFormProps) {
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const { showError, AlertComponent } = useCustomAlert();

  const handleLogin = useCallback(async () => {
    // Validation
    if (!userNameOrEmail || !password) {
      showError('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      await onLogin(userNameOrEmail, password);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userNameOrEmail, password, onLogin, showError]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const isFormValid = userNameOrEmail && password;

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            commonStyles.container,
            { justifyContent: 'center' },
          ]}
          keyboardShouldPersistTaps='handled'
        >
          <View style={[commonStyles.header, { marginBottom: 40 }]}>
            <Text
              style={[
                commonStyles.title,
                {
                  color: Colors[colorScheme].tint,
                  fontSize: 34,
                  fontWeight: 'bold',
                },
              ]}
            >
              GYMMETRY
            </Text>
            <Text
              style={[
                commonStyles.subtitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Inicia sesión para continuar
            </Text>
          </View>

          <View style={commonStyles.form}>
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Usuario o Email
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    color: Colors[colorScheme].text,
                    borderColor: Colors[colorScheme].tint,
                  },
                ]}
                value={userNameOrEmail}
                onChangeText={setUserNameOrEmail}
                placeholder='usuario o tu@email.com'
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                autoComplete='email'
                textContentType='emailAddress'
                accessibilityLabel='Campo de usuario o email'
                accessibilityHint='Ingresa tu nombre de usuario o dirección de correo electrónico'
              />
            </View>

            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Contraseña
              </Text>
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={[
                    commonStyles.input,
                    {
                      backgroundColor: Colors[colorScheme].background,
                      color: Colors[colorScheme].text,
                      borderColor: '#666',
                      paddingRight: 50,
                    },
                  ]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder='Tu contraseña'
                  placeholderTextColor={`${Colors[colorScheme].text}60`}
                  secureTextEntry={!showPassword}
                  autoComplete='password'
                  textContentType='password'
                  accessibilityLabel='Campo de contraseña'
                  accessibilityHint='Ingresa tu contraseña'
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: 12,
                    padding: 4,
                  }}
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  accessibilityRole='button'
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color={Colors[colorScheme].text}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                commonStyles.button,
                { backgroundColor: Colors[colorScheme].tint },
                (!isFormValid || isLoading) && commonStyles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!isFormValid || isLoading}
              accessibilityLabel={
                isLoading ? 'Iniciando sesión' : 'Iniciar sesión'
              }
              accessibilityRole='button'
              accessibilityState={{ disabled: !isFormValid || isLoading }}
            >
              <Text style={commonStyles.buttonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <Text
                style={[{ color: Colors[colorScheme].text, marginBottom: 8 }]}
              >
                ¿No tienes cuenta?
              </Text>
              <TouchableOpacity
                onPress={onSwitchToRegister}
                accessibilityLabel='Ir a registro'
                accessibilityRole='button'
              >
                <Text
                  style={[
                    { color: Colors[colorScheme].tint, fontWeight: '600' },
                  ]}
                >
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlertComponent />
    </>
  );
}
