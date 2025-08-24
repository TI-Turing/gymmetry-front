import React, { memo } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../../Themed';
import { useColorScheme } from '../../useColorScheme';
import Colors from '@/constants/Colors';
import { Step1Data } from '../types';
import { commonStyles } from '../styles/common';
import { PasswordInput } from '../PasswordInput';
import { PasswordRequirements } from '../PasswordRequirements';
import { useStep1Form } from '../hooks/useStep1Form';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStep1Styles } from '../styles/step1';

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
    const styles = useThemedStyles(makeStep1Styles);
    const {
      showError: internalShowError,
      showSuccess: internalShowSuccess,
      AlertComponent,
    } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;
    const showSuccess = externalShowSuccess || internalShowSuccess;

    const {
      confirmPassword,
      showConfirmPassword,
      isLoading,
      isFormValid,
      passwordsMatch,
      email,
      setEmail,
      password,
      setPassword,
      showPassword,
      setShowPassword,
      validation,
      setConfirmPassword,
      setShowConfirmPassword,
      handleNext,
    } = useStep1Form({ onNext, initialData, showError, showSuccess });

    return (
      <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={commonStyles.headerStep1}>
          <Text style={[commonStyles.title, styles.headerTitle]}>
            Crear tu cuenta
          </Text>
          <Text style={[commonStyles.subtitle, styles.headerSubtitle]}>
            Comencemos con tus credenciales de acceso
          </Text>
        </View>

        <View style={commonStyles.form}>
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, styles.label]}>Email *</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={`${Colors[colorScheme ?? 'light'].text}60`}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Campo de correo electrónico"
              accessibilityRole="text"
            />
          </View>

          <PasswordInput
            label="Contraseña *"
            value={password}
            onChangeText={setPassword}
            showPassword={showPassword}
            onToggleVisibility={() => setShowPassword(!showPassword)}
          >
            <View style={commonStyles.requirementsContainer}>
              <PasswordRequirements validation={validation} />
            </View>
          </PasswordInput>

          <PasswordInput
            label="Confirmar contraseña *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggleVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            borderColor={
              passwordsMatch || confirmPassword.length === 0
                ? '#666'
                : '#ff6b6b'
            }
          >
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text
                style={[
                  commonStyles.requirement,
                  { color: '#ff6b6b', marginTop: 4 },
                ]}
              >
                • Las contraseñas no coinciden
              </Text>
            )}

            {confirmPassword.length > 0 && passwordsMatch && (
              <Text
                style={[
                  commonStyles.requirement,
                  styles.chipOk,
                  { marginTop: 4 },
                ]}
              >
                • Las contraseñas coinciden ✓
              </Text>
            )}
          </PasswordInput>

          <TouchableOpacity
            style={[
              commonStyles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
              (isLoading || !isFormValid) && commonStyles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={isLoading || !isFormValid}
            accessibilityLabel="Continuar al siguiente paso"
            accessibilityRole="button"
          >
            <Text style={commonStyles.buttonText}>
              {isLoading ? 'Creando cuenta...' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Solo renderizar AlertComponent si no hay funciones externas */}
        {!externalShowError && <AlertComponent />}
      </ScrollView>
    );
  }
);

Step1.displayName = 'Step1';

export default Step1;
