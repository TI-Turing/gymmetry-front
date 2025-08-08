import React, { useState, useCallback } from 'react';
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { handleApiError } from '@/utils';
import { commonStyles } from './styles/common';
import Colors from '@/constants/Colors';

interface LoginFormProps {
  onLogin: (
    userNameOrEmail: string,
    password: string
  ) => Promise<{ Success: boolean; error?: string }>;
  onSwitchToRegister: () => void;
  showAlert?: (message: string, type?: 'success' | 'error') => void;
}

export default function LoginForm({
  onLogin,
  onSwitchToRegister,
  showAlert,
}: LoginFormProps) {
  console.log('🔥 LoginForm renderizado - onLogin:', typeof onLogin, !!onLogin);
  
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();

  const handleLogin = useCallback(async () => {
    console.log('🔥 LoginForm handleLogin llamado con:', {
      userNameOrEmail,
      password,
    });

    // Validation
    if (!userNameOrEmail || !password) {
      if (showAlert) {
        showAlert('Por favor completa todos los campos');
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔥 Llamando a onLogin desde LoginForm');
      const result = await onLogin(userNameOrEmail, password);
      console.log('🔥 Resultado de onLogin:', result);
      if (!result.Success && showAlert) {
        showAlert(result.error || 'Error desconocido');
      }
      // Si es Success: true, AuthContainer manejará el éxito
    } catch (error: any) {
      console.log('🔥 Error en LoginForm:', error);
      const errorMessage = handleApiError(error);
      if (showAlert) {
        showAlert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userNameOrEmail, password, onLogin, showAlert]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const isFormValid = !!userNameOrEmail && !!password;

  // Determinar si estamos en web y obtener dimensiones
  const isWeb = Platform.OS === 'web';
  const { height: screenHeight } = Dimensions.get('window');

  return (
    <>
      <KeyboardAvoidingView
        style={[{ flex: 1 }, isWeb && { backgroundColor: '#1A1A1A' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            commonStyles.container,
            { justifyContent: 'center' },
            isWeb && {
              alignItems: 'center',
              minHeight: screenHeight,
              backgroundColor: '#1A1A1A',
            },
          ]}
          keyboardShouldPersistTaps='handled'
        >
          <View
            style={[
              isWeb && {
                maxWidth: 400,
                width: '100%',
              },
            ]}
          >
            {isWeb ? (
              <LinearGradient
                colors={['#000000', '#121212', '#000000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 0,
                  padding: 40,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 12,
                  borderWidth: 0,
                }}
              >
                <WebFormContent
                  colorScheme={colorScheme}
                  userNameOrEmail={userNameOrEmail}
                  setUserNameOrEmail={setUserNameOrEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                  isFormValid={isFormValid}
                  isLoading={isLoading}
                  handleLogin={handleLogin}
                  onSwitchToRegister={onSwitchToRegister}
                />
              </LinearGradient>
            ) : (
              <MobileFormContent
                colorScheme={colorScheme}
                userNameOrEmail={userNameOrEmail}
                setUserNameOrEmail={setUserNameOrEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                isFormValid={isFormValid}
                isLoading={isLoading}
                handleLogin={handleLogin}
                onSwitchToRegister={onSwitchToRegister}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

// Componente para el formulario en web con estilos mejorados
interface FormContentProps {
  colorScheme: 'light' | 'dark';
  userNameOrEmail: string;
  setUserNameOrEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  isFormValid: boolean;
  isLoading: boolean;
  handleLogin: () => void;
  onSwitchToRegister: () => void;
}

function WebFormContent({
  colorScheme,
  userNameOrEmail,
  setUserNameOrEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  isFormValid,
  isLoading,
  handleLogin,
  onSwitchToRegister,
}: FormContentProps) {
  return (
    <>
      <View
        style={[
          commonStyles.header,
          { marginBottom: 40, backgroundColor: 'transparent' },
        ]}
      >
        <Text
          style={[
            commonStyles.title,
            {
              color: Colors.dark.tint,
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
            {
              color: '#FFFFFF',
              backgroundColor: 'transparent',
            },
          ]}
        >
          Inicia sesión para continuar
        </Text>
      </View>

      <View style={[commonStyles.form, { backgroundColor: 'transparent' }]}>
        <View
          style={[
            commonStyles.inputContainer,
            { backgroundColor: 'transparent' },
          ]}
        >
          <Text
            style={[
              commonStyles.label,
              {
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
            ]}
          >
            Usuario o Email
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: '#1E1E1E',
                color: '#FFFFFF',
                borderColor: Colors.dark.tint,
                borderWidth: 2,
              },
            ]}
            value={userNameOrEmail}
            onChangeText={setUserNameOrEmail}
            placeholderTextColor='#B0B0B0'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            autoComplete='email'
            textContentType='emailAddress'
            accessibilityLabel='Campo de usuario o email'
            accessibilityHint='Ingresa tu nombre de usuario o dirección de correo electrónico'
          />
        </View>

        <View
          style={[
            commonStyles.inputContainer,
            { backgroundColor: 'transparent' },
          ]}
        >
          <Text
            style={[
              commonStyles.label,
              {
                color: '#FFFFFF',
                backgroundColor: 'transparent',
              },
            ]}
          >
            Contraseña
          </Text>
          <View
            style={{ position: 'relative', backgroundColor: 'transparent' }}
          >
            <TextInput
              style={[
                commonStyles.input,
                {
                  backgroundColor: '#1E1E1E',
                  color: '#FFFFFF',
                  borderColor: '#666',
                  borderWidth: 2,
                  paddingRight: 50,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor='#B0B0B0'
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
                backgroundColor: 'transparent',
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
                color='#FFFFFF'
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            {
              backgroundColor: Colors.dark.tint,
              marginTop: 24,
            },
            (!isFormValid || isLoading) && { opacity: 0.6 },
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || isLoading}
          accessibilityLabel={isLoading ? 'Iniciando sesión' : 'Iniciar sesión'}
          accessibilityRole='button'
          accessibilityState={{ disabled: !isFormValid || isLoading }}
        >
          <Text style={[commonStyles.buttonText, { color: '#FFFFFF' }]}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'center',
            marginTop: 24,
            backgroundColor: 'transparent',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              marginBottom: 8,
              backgroundColor: 'transparent',
            }}
          >
            ¿No tienes cuenta?
          </Text>
          <TouchableOpacity
            onPress={onSwitchToRegister}
            accessibilityLabel='Ir a registro'
            accessibilityRole='button'
          >
            <Text
              style={{
                color: Colors.dark.tint,
                fontWeight: '600',
                backgroundColor: 'transparent',
              }}
            >
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

function MobileFormContent({
  colorScheme,
  userNameOrEmail,
  setUserNameOrEmail,
  password,
  setPassword,
  showPassword,
  togglePasswordVisibility,
  isFormValid,
  isLoading,
  handleLogin,
  onSwitchToRegister,
}: FormContentProps) {
  return (
    <>
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
          style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}
        >
          Inicia sesión para continuar
        </Text>
      </View>

      <View style={commonStyles.form}>
        <View style={commonStyles.inputContainer}>
          <Text
            style={[commonStyles.label, { color: Colors[colorScheme].text }]}
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
            style={[commonStyles.label, { color: Colors[colorScheme].text }]}
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
          accessibilityLabel={isLoading ? 'Iniciando sesión' : 'Iniciar sesión'}
          accessibilityRole='button'
          accessibilityState={{ disabled: !isFormValid || isLoading }}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={[{ color: Colors[colorScheme].text, marginBottom: 8 }]}>
            ¿No tienes cuenta?
          </Text>
          <TouchableOpacity
            onPress={onSwitchToRegister}
            accessibilityLabel='Ir a registro'
            accessibilityRole='button'
          >
            <Text
              style={[{ color: Colors[colorScheme].tint, fontWeight: '600' }]}
            >
              Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
