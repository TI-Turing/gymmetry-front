import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import Dropdown from '@/components/auth/Dropdown';
import { GymStepProps, GymStep3Data } from '../types';
import { GymService } from '../GymService';
import Colors from '@/constants/Colors';

interface Country {
  Id: string;
  Name: string;
  Code: string;
}

export default function GymStep3({
  gymId,
  onNext,
  onBack,
  initialData,
}: GymStepProps<GymStep3Data> & { gymId: string }) {
  const [formData, setFormData] = useState<GymStep3Data>({
    address: initialData?.address || '',
    city: initialData?.city || '',
    country: initialData?.country || '',
    countryId: initialData?.countryId || '',
    postalCode: initialData?.postalCode || '',
    emergencyPhone: initialData?.emergencyPhone || '',
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setIsLoadingCountries(true);
      const response = await GymService.getCountries();
      setCountries(response.Data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
      Alert.alert('Error', 'No se pudieron cargar los países');
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const handleInputChange = (field: keyof GymStep3Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountrySelect = (countryId: string) => {
    const selectedCountry = countries.find(c => c.Id === countryId);
    setFormData(prev => ({
      ...prev,
      countryId,
      country: selectedCountry?.Name || '',
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.address.trim()) {
      Alert.alert('Error', 'La dirección es obligatoria');
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert('Error', 'La ciudad es obligatoria');
      return false;
    }
    if (!formData.countryId) {
      Alert.alert('Error', 'El país es obligatorio');
      return false;
    }
    if (!formData.postalCode.trim()) {
      Alert.alert('Error', 'El código postal es obligatorio');
      return false;
    }
    if (!formData.emergencyPhone.trim()) {
      Alert.alert('Error', 'El teléfono de emergencia es obligatorio');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await GymService.updateGymStep(gymId, {
        address: formData.address,
        city: formData.city,
        countryId: formData.countryId,
        postalCode: formData.postalCode,
        emergencyPhone: formData.emergencyPhone,
      });

      onNext(formData);
    } catch (error) {
      console.error('Error updating gym step 3:', error);
      Alert.alert('Error', 'No se pudo guardar la información de ubicación');
    } finally {
      setIsLoading(false);
    }
  };

  const countryOptions = countries.map(country => ({
    label: country.Name,
    value: country.Id,
  }));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <FontAwesome name='map-marker' size={40} color='#9C27B0' />
        <Text style={styles.title}>Ubicación y Contacto</Text>
        <Text style={styles.subtitle}>
          Proporciona la dirección y contacto de emergencia del gimnasio
        </Text>
      </View>

      <View style={styles.form}>
        <FormInput
          label='Dirección'
          value={formData.address}
          onChangeText={value => handleInputChange('address', value)}
          placeholder='Ej: Calle 123 #45-67'
          multiline
          numberOfLines={2}
          required
        />

        <FormInput
          label='Ciudad'
          value={formData.city}
          onChangeText={value => handleInputChange('city', value)}
          placeholder='Ej: Medellín'
          required
        />

        <Dropdown
          label='País'
          options={countryOptions}
          selectedValue={formData.countryId}
          onSelect={handleCountrySelect}
          placeholder='Selecciona un país'
          isLoading={isLoadingCountries}
          required
        />

        <FormInput
          label='Código Postal'
          value={formData.postalCode}
          onChangeText={value => handleInputChange('postalCode', value)}
          placeholder='Ej: 050001'
          keyboardType='numeric'
          required
        />

        <FormInput
          label='Teléfono de Emergencia'
          value={formData.emergencyPhone}
          onChangeText={value => handleInputChange('emergencyPhone', value)}
          placeholder='Ej: +57 300 123 4567'
          keyboardType='phone-pad'
          required
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title='Anterior'
          onPress={onBack}
          variant='outline'
          style={styles.backButton}
        />
        <Button
          title='Continuar'
          onPress={handleNext}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 15,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});
