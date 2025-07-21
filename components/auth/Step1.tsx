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
    }
  }, [initialData]);

  const isFormValid = isEmailValid && isPasswordValid;

  const handleNext = async () => {
    if (!isFormValid) {
      const passwordErrors = validatePassword(password, email);
      const errorMessage = passwordErrors.length > 0 
        ? passwordErrors.join('\n')
        : 'Por favor completa todos los campos correctamente';
      
      Alert.alert('Error de validación', errorMessage);
      return;
    }

    setIsLoading(true);

    try {
      const response = await userAPI.createUser({
        email,
        Password: password
      }) as ApiResponse;

      if (!response.Success) {
        throw new Error(response.Message || 'Error al crear usuario');
      }
      
      if (response.Data?.Token) {
        apiService.setAuthToken(response.Data.Token);
      }
      
      onNext({ 
        email, 
        password,
        userId: response.Data?.Id,
        token: response.Data?.Token
      });

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
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
              { key: 'noNumericSequence', text: 'No puede contener secuencias numéricas (12345)' },
              { key: 'noLetterSequence', text: 'No puede contener secuencias de letras (ABCDEF)' },
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
