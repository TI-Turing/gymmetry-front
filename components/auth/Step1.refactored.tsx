import React, { memo, useCallback, useMemo } from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { FormInput } from '../common/FormInput';
import { Button } from '../common/Button';
import { PasswordRequirements } from './PasswordRequirements';
import { useStep1Form } from './hooks/useStep1Form';
import { useCustomAlert } from './CustomAlert';
import { commonStyles } from './styles/common';
import { Step1Data } from './types';
import Colors from '@/constants/Colors';

interface Step1Props {
  onNext: (data: Step1Data) => void;
  initialData?: { email: string; password: string };
  showError?: (message: string) => void;
  showSuccess?: (message: string) => void;
}

const Step1 = memo<Step1Props>(
  ({
    onNext,
    initialData,
    showError: externalShowError,
    showSuccess: externalShowSuccess,
  }) => {
    const colorScheme = useColorScheme();
    const {
      showError: internalShowError,
      showSuccess: internalShowSuccess,
      AlertComponent,
    } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;
    const showSuccess = externalShowSuccess || internalShowSuccess;

    const {
      email,
      setEmail,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      showPassword,
      setShowPassword,
      showConfirmPassword,
      setShowConfirmPassword,
      isLoading,
      validation,
      isFormValid,
      passwordsMatch,
      handleNext,
    } = useStep1Form({
      onNext,
      initialData: initialData || undefined,
      showError,
      showSuccess,
    });

    const handleEmailChange = useCallback(
      (text: string) => {
        setEmail(text.toLowerCase().trim());
      },
      [setEmail]
    );

    const handlePasswordChange = useCallback(
      (text: string) => {
        setPassword(text);
      },
      [setPassword]
    );

    const handleConfirmPasswordChange = useCallback(
      (text: string) => {
        setConfirmPassword(text);
      },
      [setConfirmPassword]
    );

    const togglePasswordVisibility = useCallback(() => {
      setShowPassword(!showPassword);
    }, [showPassword, setShowPassword]);

    const toggleConfirmPasswordVisibility = useCallback(() => {
      setShowConfirmPassword(!showConfirmPassword);
    }, [showConfirmPassword, setShowConfirmPassword]);

    const emailError = useMemo(() => {
      if (!email) return '';
      if (!validation.isEmailValid) return 'Ingresa un email válido';
      return '';
    }, [email, validation.isEmailValid]);

    const passwordError = useMemo(() => {
      if (!password) return '';
      if (!validation.passwordValidation.isValid)
        return 'La contraseña no cumple con los requisitos';
      return '';
    }, [password, validation.passwordValidation.isValid]);

    const confirmPasswordError = useMemo(() => {
      if (!confirmPassword) return '';
      if (!passwordsMatch) return 'Las contraseñas no coinciden';
      return '';
    }, [confirmPassword, passwordsMatch]);

    const PasswordToggleIcon = ({
      isVisible,
      onPress,
    }: {
      isVisible: boolean;
      onPress: () => void;
    }) => (
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: [{ translateY: -10 }],
          padding: 4,
        }}
        accessibilityLabel={
          isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
        }
        accessibilityRole='button'
      >
        <FontAwesome
          name={isVisible ? 'eye-slash' : 'eye'}
          size={20}
          color={Colors[colorScheme].text}
        />
      </TouchableOpacity>
    );

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
              Crear cuenta
            </Text>
            <Text
              style={[
                commonStyles.subtitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Completa tus datos para continuar
            </Text>
          </View>

          <View style={commonStyles.form}>
            <FormInput
              label='Email'
              value={email}
              onChangeText={handleEmailChange}
              placeholder='tu@email.com'
              keyboardType='email-address'
              autoCapitalize='none'
              autoCorrect={false}
              autoComplete='email'
              textContentType='emailAddress'
              error={emailError}
              required
              accessibilityLabel='Campo de email'
              accessibilityHint='Ingresa tu dirección de correo electrónico'
            />

            <View style={{ position: 'relative' }}>
              <FormInput
                label='Contraseña'
                value={password}
                onChangeText={handlePasswordChange}
                placeholder='Crea una contraseña segura'
                secureTextEntry={!showPassword}
                textContentType='newPassword'
                autoComplete='password-new'
                error={passwordError}
                required
                accessibilityLabel='Campo de contraseña'
                accessibilityHint='Crea una contraseña segura para tu cuenta'
                inputStyle={{ paddingRight: 45 }}
              />
              <PasswordToggleIcon
                isVisible={showPassword}
                onPress={togglePasswordVisibility}
              />
            </View>

            <PasswordRequirements validation={validation.passwordValidation} />

            <View style={{ position: 'relative' }}>
              <FormInput
                label='Confirmar contraseña'
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder='Confirma tu contraseña'
                secureTextEntry={!showConfirmPassword}
                textContentType='newPassword'
                autoComplete='password-new'
                error={confirmPasswordError}
                required
                accessibilityLabel='Campo de confirmación de contraseña'
                accessibilityHint='Vuelve a escribir tu contraseña para confirmarla'
                inputStyle={{ paddingRight: 45 }}
              />
              <PasswordToggleIcon
                isVisible={showConfirmPassword}
                onPress={toggleConfirmPasswordVisibility}
              />
            </View>

            <Button
              title={isLoading ? 'Creando cuenta...' : 'Continuar'}
              onPress={handleNext}
              disabled={!isFormValid || isLoading}
              loading={isLoading}
              variant='primary'
              size='large'
              accessibilityLabel='Botón para continuar con el registro'
              accessibilityHint='Presiona para continuar al siguiente paso del registro'
            />
          </View>

          {/* Componente de alertas personalizado */}
          <AlertComponent />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

Step1.displayName = 'Step1';

export default Step1;
