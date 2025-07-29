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
import { GymRegistrationFormData, GymRegistrationFormProps } from './types';
import Colors from '@/constants/Colors';

export default function GymRegistrationForm({
  onSubmit,
  onCancel,
}: GymRegistrationFormProps) {
  const [formData, setFormData] = useState<GymRegistrationFormData>({
    name: '',
    nit: '',
    email: '',
    countryId: '',
    gymPlanSelectedId: '',
    gymTypeId: '',
    instagram: '',
    facebook: '',
    website: '',
    slogan: '',
    phone: '',
    country: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    field: keyof GymRegistrationFormData,
    value: string
  ) => {
    setFormData((prev: GymRegistrationFormData) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field as string]) {
      setErrors((prev: { [key: string]: string }) => ({
        ...prev,
        [field as string]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Campos requeridos
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del gimnasio es requerido';
    }
    if (!formData.nit.trim()) {
      newErrors.nit = 'El NIT es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    } else {
      Alert.alert(
        'Formulario incompleto',
        'Por favor completa todos los campos requeridos'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <FontAwesome name='arrow-left' size={20} color='#FFFFFF' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Gimnasio</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <FormInput
            label='Nombre del Gimnasio *'
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            error={errors.name}
          />

          <FormInput
            label='NIT *'
            value={formData.nit}
            onChangeText={value => handleInputChange('nit', value)}
            error={errors.nit}
          />

          <FormInput
            label='Email *'
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            keyboardType='email-address'
            autoCapitalize='none'
            error={errors.email}
          />

          <FormInput
            label='Teléfono de Contacto *'
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            keyboardType='phone-pad'
            error={errors.phone}
          />

          <FormInput
            label='País *'
            value={formData.country}
            onChangeText={value => handleInputChange('country', value)}
            error={errors.country}
          />

          <FormInput
            label='Slogan'
            value={formData.slogan}
            onChangeText={value => handleInputChange('slogan', value)}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Información Digital */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presencia Digital</Text>

          <FormInput
            label='Sitio Web'
            value={formData.website}
            onChangeText={value => handleInputChange('website', value)}
            keyboardType='url'
            autoCapitalize='none'
          />

          <FormInput
            label='Instagram'
            value={formData.instagram}
            onChangeText={value => handleInputChange('instagram', value)}
            autoCapitalize='none'
          />

          <FormInput
            label='Facebook'
            value={formData.facebook}
            onChangeText={value => handleInputChange('facebook', value)}
            autoCapitalize='none'
          />
        </View>

        {/* Nota informativa */}
        <View style={styles.infoCard}>
          <FontAwesome name='info-circle' size={20} color='#2196F3' />
          <Text style={styles.infoText}>
            Una vez registrado, nuestro equipo revisará la información y te
            contactaremos para completar el proceso de verificación.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button
            title='Registrar Gimnasio'
            onPress={handleSubmit}
            style={styles.submitButton}
          />
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
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
  },
  submitButton: {
    backgroundColor: Colors.dark.tint,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
