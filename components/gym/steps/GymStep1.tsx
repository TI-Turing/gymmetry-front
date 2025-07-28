import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { GymStep1Data, GymStepProps } from '../types';
import { GymService } from '../GymService';
import Colors from '@/constants/Colors';

export default function GymStep1({
  onNext,
  onBack,
  initialData,
  isLoading = false,
}: GymStepProps<GymStep1Data>) {
  const [formData, setFormData] = useState<GymStep1Data>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    nit: initialData?.nit || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof GymStep1Data, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del gimnasio es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData.nit.trim()) {
      newErrors.nit = 'El NIT es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Formulario incompleto',
        'Por favor completa todos los campos requeridos'
      );
      return;
    }

    setLoading(true);
    try {
      // Registrar gimnasio inicial y obtener ID
      const response = await GymService.registerGym(formData);

      if (response.Success && response.Data) {
        // Pasar los datos junto con el gymId al siguiente paso
        onNext({
          ...formData,
          gymId: response.Data.Id,
        } as any);
      } else {
        Alert.alert(
          'Error',
          response.Message || 'Error al registrar el gimnasio'
        );
      }
    } catch (_error) {
      Alert.alert('Error', 'Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Información Básica</Text>
          <Text style={styles.headerSubtitle}>
            Comencemos con los datos principales de tu gimnasio
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <FormInput
            label='Nombre del Gimnasio *'
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            error={errors.name}
            inputStyle={styles.input}
          />

          <FormInput
            label='Email Corporativo *'
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType='email-address'
            autoCapitalize='none'
            error={errors.email}
            inputStyle={styles.input}
          />

          <FormInput
            label='Teléfono Principal *'
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            keyboardType='phone-pad'
            error={errors.phone}
            inputStyle={styles.input}
          />

          <FormInput
            label='NIT o Identificación Tributaria *'
            value={formData.nit}
            onChangeText={value => handleInputChange('nit', value)}
            error={errors.nit}
            inputStyle={styles.input}
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <FontAwesome name='info-circle' size={20} color={Colors.dark.tint} />
          <Text style={styles.infoText}>
            Esta información será verificada por nuestro equipo. Asegúrate de
            que sea correcta y esté actualizada.
          </Text>
        </View>
      </ScrollView>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Registrando...' : 'Continuar'}
          onPress={handleNext}
          disabled={loading || isLoading}
          style={styles.nextButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  input: {
    borderColor: '#666',
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.tint,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginLeft: 12,
  },
  buttonContainer: {
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  nextButton: {
    backgroundColor: Colors.dark.tint,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
