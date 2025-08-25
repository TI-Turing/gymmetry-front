import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import GymTypeDropdown from '../GymTypeDropdown';
import { GymStep2Data, GymStepProps, GymType } from '../types';
import { GymService } from '@/services/gymService';
import { gymTypeService } from '@/services/gymTypeService';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '../styles/gymSteps';
import { useI18n } from '@/i18n';

interface GymStep2Props extends GymStepProps<GymStep2Data> {
  gymId: string;
}

export default function GymStep2({
  onNext,
  onBack: _onBack,
  initialData,
  gymId,
  isLoading = false,
}: GymStep2Props) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();
  const [formData, setFormData] = useState<GymStep2Data>({
    gymTypeId: initialData?.gymTypeId || '',
    slogan: initialData?.slogan || '',
    description: initialData?.description || '',
    Id: initialData?.Id || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [gymTypes, setGymTypes] = useState<GymType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const loadGymTypes = useCallback(async () => {
    try {
      const response = await gymTypeService.getAllGymTypes();
      if (response.Success) {
        setGymTypes(response.Data || []);
      } else {
        showAlert('error', t('error'), t('error_loading_gym_types'));
      }
    } catch {
      showAlert('error', t('error'), t('connection_error_gym_types'));
    } finally {
      setLoadingTypes(false);
    }
  }, [showAlert, t]);

  useEffect(() => {
    loadGymTypes();
  }, [loadGymTypes]);

  const handleInputChange = (field: keyof GymStep2Data, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.gymTypeId) {
      newErrors.gymTypeId = t('gym_type_required');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('gym_description_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      showAlert('warning', t('form_incomplete'), t('complete_required_fields'));
      return;
    }
    formData.Id = gymId;
    setLoading(true);
    try {
      await GymService.updateGymStep(formData);
      onNext(formData);
    } catch {
      showAlert('error', t('error'), t('error_updating_info'));
    } finally {
      setLoading(false);
    }
  };

  const selectedGymType = Array.isArray(gymTypes)
    ? gymTypes.find((type) => type.Id === formData.gymTypeId)
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
          <Text style={styles.headerTitle}>{t('gym_step2_title')}</Text>
          <Text style={styles.headerSubtitle}>{t('gym_step2_subtitle')}</Text>
        </View>

        {/* Tipo de Gimnasio */}
        <View style={styles.section}>
          <GymTypeDropdown
            label={t('gym_type_label')}
            options={gymTypes}
            value={formData.gymTypeId}
            onSelect={(typeId) => handleInputChange('gymTypeId', typeId)}
            error={errors.gymTypeId}
            loading={loadingTypes}
          />
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <FormInput
            label={t('slogan_label')}
            value={formData.slogan}
            onChangeText={(value) => handleInputChange('slogan', value)}
            multiline
            numberOfLines={2}
          />

          <FormInput
            label={t('gym_description_label')}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            maxLines={6}
            error={errors.description}
          />
        </View>

        {/* Información del tipo seleccionado */}
        {selectedGymType && (
          <View style={styles.infoCard}>
            <FontAwesome name="info-circle" size={20} color={colors.tint} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{t('selected_type_label')}</Text>
              <Text style={styles.infoText}>{selectedGymType.Name}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? t('loading_saving') : t('continue')}
          onPress={handleNext}
          disabled={loading || isLoading || loadingTypes}
          style={styles.nextButton}
        />
      </View>
      <AlertComponent />
    </KeyboardAvoidingView>
  );
}
