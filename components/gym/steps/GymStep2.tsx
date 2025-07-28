import React, { useState, useEffect } from 'react';
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
import GymTypeDropdown from '../GymTypeDropdown';
import { GymStep2Data, GymStepProps, GymType } from '../types';
import { GymService } from '../GymService';
import Colors from '@/constants/Colors';

interface GymStep2Props extends GymStepProps<GymStep2Data> {
  gymId: string;
}

export default function GymStep2({
  onNext,
  onBack,
  initialData,
  gymId,
  isLoading = false,
}: GymStep2Props) {
  const [formData, setFormData] = useState<GymStep2Data>({
    gymTypeId: initialData?.gymTypeId || '',
    slogan: initialData?.slogan || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [gymTypes, setGymTypes] = useState<GymType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    loadGymTypes();
  }, []);

  const loadGymTypes = async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('🏷️ Loading gym types...');
      const response = await GymService.getGymTypes();
      // eslint-disable-next-line no-console
      console.log('📦 Gym types response:', response);
      // eslint-disable-next-line no-console
      console.log('📊 Response.Data type:', typeof response.Data);
      // eslint-disable-next-line no-console
      console.log('📊 Response.Data is array:', Array.isArray(response.Data));

      if (response.Success) {
        setGymTypes(response.Data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los tipos de gimnasio');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('💥 Error loading gym types:', error);
      Alert.alert('Error', 'Error de conexión al cargar tipos de gimnasio');
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleInputChange = (field: keyof GymStep2Data, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.gymTypeId) {
      newErrors.gymTypeId = 'Debes seleccionar un tipo de gimnasio';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
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
      await GymService.updateGymStep(gymId, formData);
      onNext(formData);
    } catch {
      Alert.alert('Error', 'Error al actualizar la información');
    } finally {
      setLoading(false);
    }
  };

  const selectedGymType = Array.isArray(gymTypes)
    ? gymTypes.find(type => type.Id === formData.gymTypeId)
    : null;

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
          <Text style={styles.headerTitle}>Tipo y Descripción</Text>
          <Text style={styles.headerSubtitle}>
            Cuéntanos qué tipo de gimnasio es y sus características principales
          </Text>
        </View>

        {/* Tipo de Gimnasio */}
        <View style={styles.section}>
          <GymTypeDropdown
            label='Tipo de Gimnasio *'
            placeholder='Selecciona el tipo de gimnasio'
            options={gymTypes}
            value={formData.gymTypeId}
            onSelect={typeId => handleInputChange('gymTypeId', typeId)}
            error={errors.gymTypeId}
            loading={loadingTypes}
          />
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <FormInput
            label='Slogan (Opcional)'
            value={formData.slogan}
            onChangeText={value => handleInputChange('slogan', value)}
            placeholder='Tu mejor versión te espera aquí'
            multiline
            numberOfLines={2}
          />

          <FormInput
            label='Descripción del Gimnasio *'
            value={formData.description}
            onChangeText={value => handleInputChange('description', value)}
            placeholder='Describe las características principales de tu gimnasio, servicios que ofreces, instalaciones, etc.'
            multiline
            numberOfLines={4}
            error={errors.description}
          />
        </View>

        {/* Información del tipo seleccionado */}
        {selectedGymType && (
          <View style={styles.infoCard}>
            <FontAwesome
              name='info-circle'
              size={20}
              color={Colors.dark.tint}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Tipo seleccionado:</Text>
              <Text style={styles.infoText}>{selectedGymType.Name}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Guardando...' : 'Continuar'}
          onPress={handleNext}
          disabled={loading || isLoading || loadingTypes}
          style={styles.nextButton}
        />

        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}
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
  section: {
    marginBottom: 30,
  },
  form: {
    gap: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.tint,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.tint,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
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
