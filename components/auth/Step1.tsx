import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { userAPI } from '@/services/apiExamples';
import { apiService } from '@/services/apiService';

// Imports locales
import { Step1Data, ApiResponse } from './types';
import { usePasswordValidation, useFormValidation } from './hooks/useValidation';
import { validatePassword } from './utils/validation';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';

interface Step1Props {
  onNext: (data: Step1Data) => void;
  initialData?: { email: string; password: string };
}

export default function Step1({ onNext, initialData }: Step1Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colorScheme = useColorScheme();

  const { email, setEmail, isEmailValid } = useFormValidation();
  const { 
    password, 
    setPassword, 
    showPassword, 
    setShowPassword, 
    validation, 
    isValid: isPasswordValid 
  } = usePasswordValidation(email);

  // Inicializar con datos previos si existen
  React.useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setPassword(initialData.password);
      setConfirmPassword(initialData.password);
    }
  }, [initialData]);

  const passwordsMatch = password === confirmPassword;
  const isFormValid = isEmailValid && isPasswordValid && passwordsMatch && confirmPassword.length > 0;

  const handleNext = async () => {
    console.log('🔄 [STEP 1] handleNext llamado');
    console.log('🔄 [STEP 1] isFormValid:', isFormValid);
    
    if (!isFormValid) {
      let errorMessage = '';
      
      if (!isEmailValid) {
        errorMessage = 'Por favor ingresa un email válido';
      } else if (!isPasswordValid) {
        const passwordErrors = validatePassword(password, email);
        errorMessage = passwordErrors.length > 0 
          ? passwordErrors.join('\n')
          : 'La contraseña no cumple los requisitos';
      } else if (!passwordsMatch) {
        errorMessage = 'Las contraseñas no coinciden';
      } else if (confirmPassword.length === 0) {
        errorMessage = 'Por favor confirma tu contraseña';
      }
      
      Alert.alert('Error de validación', errorMessage);
      return;
    }

    setIsLoading(true);
    console.log('🔄 [STEP 1] Iniciando creación de usuario...');

    try {
      const response = await userAPI.createUser({
        email,
        Password: password
      }) as ApiResponse;

      console.log('🔄 [STEP 1] Respuesta de la API:', response);

      if (!response.Success) {
        throw new Error(response.Message || 'Error al crear usuario');
      }
      
      if (response.Data?.Token) {
        apiService.setAuthToken(response.Data.Token);
        console.log('🔑 [STEP 1] Token configurado');
      }
      
      const stepData = { 
        email, 
        password,
        userId: response.Data?.Id,
        token: response.Data?.Token
      };
      
      console.log('🔄 [STEP 1] Llamando onNext con:', stepData);
      onNext(stepData);

    } catch (error: any) {
      console.error('❌ [STEP 1] Error:', error);
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.headerStep1}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme].text }]}>
          Crear tu cuenta
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
          Comencemos con tus credenciales de acceso
        </Text>
      </View>

      <View style={commonStyles.form}>
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Email *
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
            value={email}
            onChangeText={setEmail}
            placeholder="tu@email.com"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Contraseña *
          </Text>
          <View style={commonStyles.passwordContainer}>
            <TextInput
              style={[
                commonStyles.passwordInput,
                {
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: '#666',
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="8-50 caracteres, letras y números"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={commonStyles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
          
          <View style={commonStyles.requirementsContainer}>
            {[
              { key: 'length', text: 'Entre 8 y 50 caracteres' },
              { key: 'hasLetter', text: 'Al menos una letra' },
              { key: 'hasNumber', text: 'Al menos un número' },
              { key: 'notEqualToEmail', text: 'No puede ser igual al email' },
              { key: 'validChars', text: 'Solo caracteres del alfabeto inglés (sin espacios)' },
            ].map(({ key, text }) => (
              <Text
                key={key}
                style={[
                  commonStyles.requirement,
                  { 
                    color: validation[key as keyof typeof validation] 
                      ? Colors[colorScheme].tint 
                      : '#666' 
                  }
                ]}
              >
                • {text}
              </Text>
            ))}
          </View>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Confirmar contraseña *
          </Text>
          <View style={commonStyles.passwordContainer}>
            <TextInput
              style={[
                commonStyles.passwordInput,
                {
                  backgroundColor: Colors[colorScheme].background,
                  color: Colors[colorScheme].text,
                  borderColor: passwordsMatch || confirmPassword.length === 0 ? '#666' : '#ff6b6b',
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirma tu contraseña"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={commonStyles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesome
                name={showConfirmPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
          
          {confirmPassword.length > 0 && !passwordsMatch && (
            <Text style={[commonStyles.requirement, { color: '#ff6b6b', marginTop: 4 }]}>
              • Las contraseñas no coinciden
            </Text>
          )}
          
          {confirmPassword.length > 0 && passwordsMatch && (
            <Text style={[commonStyles.requirement, { color: Colors[colorScheme].tint, marginTop: 4 }]}>
              • Las contraseñas coinciden ✓
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            { backgroundColor: Colors[colorScheme].tint },
            (isLoading || !isFormValid) && commonStyles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || !isFormValid}
        >
          <Text style={commonStyles.buttonText}>
            {isLoading ? 'Creando cuenta...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
