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
import { GymStep2Data, GymStepProps, GymType } from '../types';
import { GymService } from '../GymService';

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
      const response = await GymService.getGymTypes();
      if (response.Success) {
        setGymTypes(response.Data || []);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los tipos de gimnasio');
      }
    } catch {
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

  const selectedGymType = gymTypes.find(type => type.Id === formData.gymTypeId);

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
          <Text style={styles.label}>Tipo de Gimnasio *</Text>
          {loadingTypes ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando tipos...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.gymTypesContainer}
              showsVerticalScrollIndicator={false}
            >
              {gymTypes.map(type => (
                <TouchableOpacity
                  key={type.Id}
                  style={[
                    styles.gymTypeCard,
                    formData.gymTypeId === type.Id && styles.selectedGymType,
                  ]}
                  onPress={() => handleInputChange('gymTypeId', type.Id)}
                >
                  <View style={styles.gymTypeHeader}>
                    <Text
                      style={[
                        styles.gymTypeName,
                        formData.gymTypeId === type.Id && styles.selectedText,
                      ]}
                    >
                      {type.Name}
                    </Text>
                    {formData.gymTypeId === type.Id && (
                      <FontAwesome
                        name='check-circle'
                        size={20}
                        color='#9C27B0'
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.gymTypeDescription,
                      formData.gymTypeId === type.Id &&
                        styles.selectedDescription,
                    ]}
                  >
                    {type.Description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {errors.gymTypeId && (
            <Text style={styles.errorText}>{errors.gymTypeId}</Text>
          )}
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
            <FontAwesome name='info-circle' size={20} color='#9C27B0' />
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  gymTypesContainer: {
    maxHeight: 300,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  gymTypeCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedGymType: {
    borderColor: '#9C27B0',
    backgroundColor: '#2A1B2E',
  },
  gymTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gymTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  selectedText: {
    color: '#9C27B0',
  },
  gymTypeDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  selectedDescription: {
    color: '#D0B0D0',
  },
  form: {
    gap: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9C27B0',
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
    backgroundColor: '#9C27B0',
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
