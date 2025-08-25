import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { catalogService } from '@/services/catalogService';
import {
  CountrySelector,
  RegionSelector,
  CitySelector,
} from '@/components/catalogs';
import { GymStepProps, GymStep3Data } from '../types';
import { GymService } from '@/services/gymService';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymStepsStyles } from '../styles/gymSteps';
import { Country, Region, City } from '@/dto/common';
import { useI18n } from '@/i18n';

export default function GymStep3({
  gymId,
  onNext,
}: GymStepProps<GymStep3Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
  const { styles, colors } = useThemedStyles(makeGymStepsStyles);
  const { t } = useI18n();
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<GymStep3Data>({
    Id: gymId,
    countryId: '', // Se asignará Colombia al cargar países
    regionId: '',
    cityId: '',
    address: '',
  });

  const loadCountries = useCallback(async () => {
    try {
      const countries = await catalogService.getCountries();
      setCountries(countries);
    } catch {
      showAlert('error', t('error'), t('error_loading_countries'));
    }
  }, [showAlert, t]);

  // El campo país estará deshabilitado, no se permite selección manual
  const handleCountrySelect = async (countryId: string) => {
    setFormData((prev) => ({
      ...prev,
      countryId,
      regionId: '',
      cityId: '',
    }));
    await loadRegions(countryId);
  };

  const loadRegions = useCallback(
    async (countryId: string) => {
      try {
        const regions = await catalogService.getRegionsByCountry(countryId);
        setRegions(regions);
        setCities([]);
      } catch {
        showAlert('error', t('error'), t('error_loading_regions'));
      }
    },
    [showAlert, t]
  );

  const loadCities = useCallback(
    async (regionId: string) => {
      try {
        const cities = await catalogService.getCitiesByRegion(regionId);
        setCities(cities);
      } catch {
        showAlert('error', t('error'), t('error_loading_cities'));
      }
    },
    [showAlert, t]
  );

  useEffect(() => {
    // Cargar países al montar el componente
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    // Seleccionar Colombia por defecto cuando los países estén disponibles
    if (countries.length > 0 && !formData.countryId) {
      const colombia = countries.find(
        (c) => c.Nombre.toLowerCase() === 'colombia'
      );
      if (colombia) {
        setFormData((prev) => ({
          ...prev,
          countryId: colombia.Id,
          regionId: '',
          cityId: '',
        }));
        loadRegions(colombia.Id);
      }
    }
  }, [countries, formData.countryId, loadRegions]);

  const handleRegionSelect = async (regionId: string) => {
    setFormData((prev) => ({
      ...prev,
      regionId,
      cityId: '',
    }));
    await loadCities(regionId);
  };

  const handleCitySelect = (cityId: string) => {
    setFormData((prev) => ({ ...prev, cityId }));
  };

  const handleAddressChange = (text: string) => {
    setFormData((prev) => ({ ...prev, address: text }));
  };

  const validate = () => {
    if (!formData.countryId) {
      showAlert('warning', t('required_field'), t('country_required'));
      return false;
    }
    if (!formData.regionId) {
      showAlert('warning', t('required_field'), t('region_required'));
      return false;
    }
    if (!formData.cityId) {
      showAlert('warning', t('required_field'), t('city_required'));
      return false;
    }
    if (!formData.address.trim()) {
      showAlert('warning', t('required_field'), t('address_required'));
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await GymService.updateGymStep(formData);
      onNext(formData);
    } catch {
      showAlert('error', t('error'), t('error_saving_location'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.step3Container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.step3Header}>
          <FontAwesome name="map-marker" size={40} color={colors.tint} />
          <Text style={styles.step3Title}>{t('gym_step3_title')}</Text>
          <Text style={styles.step3Subtitle}>{t('gym_step3_subtitle')}</Text>
        </View>

        <View style={styles.step3Form}>
          <View style={{ opacity: 0.6 }} pointerEvents="none">
            <CountrySelector
              countries={countries}
              value={formData.countryId}
              onSelect={handleCountrySelect}
              required
              disabled
            />
          </View>
          <RegionSelector
            regions={regions}
            countryId={formData.countryId}
            value={formData.regionId}
            onSelect={handleRegionSelect}
            required
          />
          <CitySelector
            cities={cities}
            regionId={formData.regionId}
            value={formData.cityId}
            onSelect={handleCitySelect}
            required
          />
          <FormInput
            label={t('main_office_address_label')}
            value={formData.address}
            onChangeText={handleAddressChange}
            multiline
            numberOfLines={2}
          />
        </View>
      </ScrollView>
      <View style={styles.step3ButtonContainer}>
        <Button title={t('continue')} onPress={onSubmit} loading={loading} />
      </View>
      <AlertComponent />
    </KeyboardAvoidingView>
  );
}
