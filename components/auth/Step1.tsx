import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { userAPI } from '@/services/apiExamples';
import { apiService } from '@/services/apiService';

interface Step1Props {
  onNext: (data: { email: string; password: string; userId?: string; token?: string }) => void;
  initialData?: { email: string; password: string };
}

export default function Step1({ onNext, initialData }: Step1Props) {
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState(initialData?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  const validatePassword = (pwd: string, emailValue: string) => {
    const errors: string[] = [];

    // No puede ser igual al correo
    if (pwd.toLowerCase() === emailValue.toLowerCase()) {
      errors.push('La contraseña no puede ser igual al email');
    }

    // Debe tener entre 8 y 50 caracteres
    if (pwd.length < 8) {
      errors.push('Debe tener al menos 8 caracteres');
    }
    if (pwd.length > 50) {
      errors.push('No puede tener más de 50 caracteres');
    }

    // Debe tener al menos una letra y un número
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    if (!hasLetter) {
      errors.push('Debe contener al menos una letra');
    }
    if (!hasNumber) {
      errors.push('Debe contener al menos un número');
    }

    // Solo caracteres del alfabeto inglés, números y símbolos básicos (sin espacios)
    const validChars = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(pwd);
    if (!validChars) {
      errors.push('Solo se permiten caracteres del alfabeto inglés, números y símbolos básicos (sin espacios)');
    }

    return errors;
  };

  // Función para verificar cada regla individualmente
  const getPasswordValidation = (pwd: string, emailValue: string) => {
    return {
      length: pwd.length >= 8 && pwd.length <= 50,
      hasLetter: /[a-zA-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      notEqualToEmail: pwd.trim().length > 0 ? pwd.toLowerCase() !== emailValue.toLowerCase() : false,
      validChars: pwd.trim().length > 0 ? /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(pwd) : false,
    };
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    if (!email || !password) return false;
    if (!email.includes('@') || !email.includes('.')) return false;
    
    const validation = getPasswordValidation(password, email);
    return validation.length && 
           validation.hasLetter && 
           validation.hasNumber && 
           validation.notEqualToEmail && 
           validation.validChars;
  };

  const passwordValidation = getPasswordValidation(password, email);

  const handleNext = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    setIsLoading(true);

    try {
      // Llamar a la API para crear el usuario
      const response = await userAPI.createUser({
        email,
        Password: password
      });

      console.log('Usuario creado exitosamente:', response);
      
      // Verificar que la respuesta sea exitosa
      if (!response.Success) {
        throw new Error(response.Message || 'Error al crear usuario');
      }
      
      // Guardar el token en el servicio API
      if (response.Data?.Token) {
        console.log('🔑 [STEP 1] Token recibido, guardando para futuras peticiones...');
        console.log('🔑 [STEP 1] Token:', response.Data.Token);
        apiService.setAuthToken(response.Data.Token);
        console.log('✅ [STEP 1] Token configurado en apiService');
      } else {
        console.log('⚠️ [STEP 1] No se recibió token en la respuesta');
      }
      
      // Continuar al siguiente paso con los datos, userId y token
      onNext({ 
        email, 
        password,
        userId: response.Data?.Id,
        token: response.Data?.Token
      });

    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      Alert.alert('Error', error.message || 'No se pudo crear el usuario. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Crear tu cuenta
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
          Comencemos con tus credenciales de acceso
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Email *
          </Text>
          <TextInput
            style={[
              styles.input,
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

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            Contraseña *
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
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
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color={Colors[colorScheme].text}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.requirementsContainer}>
            <Text style={[
              styles.requirement,
              { color: passwordValidation.length ? Colors[colorScheme].tint : '#666' }
            ]}>
              • Entre 8 y 50 caracteres
            </Text>
            <Text style={[
              styles.requirement,
              { color: passwordValidation.hasLetter ? Colors[colorScheme].tint : '#666' }
            ]}>
              • Al menos una letra
            </Text>
            <Text style={[
              styles.requirement,
              { color: passwordValidation.hasNumber ? Colors[colorScheme].tint : '#666' }
            ]}>
              • Al menos un número
            </Text>
            <Text style={[
              styles.requirement,
              { color: passwordValidation.notEqualToEmail ? Colors[colorScheme].tint : '#666' }
            ]}>
              • No puede ser igual al email
            </Text>
            <Text style={[
              styles.requirement,
              { color: passwordValidation.validChars ? Colors[colorScheme].tint : '#666' }
            ]}>
              • Solo caracteres del alfabeto inglés (sin espacios)
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: Colors[colorScheme].tint },
            (isLoading || !isFormValid()) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={isLoading || !isFormValid()}
        >
          <Text style={styles.nextButtonText}>
            {isLoading ? 'Creando cuenta...' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 50,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirement: {
    fontSize: 12,
    marginBottom: 2,
    opacity: 0.9,
  },
  requirements: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
    lineHeight: 16,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
