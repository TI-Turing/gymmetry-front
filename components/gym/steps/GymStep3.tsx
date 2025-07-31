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
import { GymStyles } from '../styles/GymStyles';
import { Country, Region, City } from '@/dto/common';
import Colors from '@/constants/Colors';

export default function GymStep3({
  gymId,
  onNext,
}: GymStepProps<GymStep3Data> & { gymId: string }) {
  const { showAlert, AlertComponent } = useCustomAlert();
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
      showAlert('error', 'Error', 'No se pudieron cargar los países');
    }
  }, [showAlert]);

  // El campo país estará deshabilitado, no se permite selección manual
  const handleCountrySelect = async (countryId: string) => {
    setFormData(prev => ({
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
        showAlert('error', 'Error', 'No se pudieron cargar las regiones');
      }
    },
    [showAlert]
  );

  const loadCities = useCallback(
    async (regionId: string) => {
      try {
        const cities = await catalogService.getCitiesByRegion(regionId);
        setCities(cities);
      } catch {
        showAlert('error', 'Error', 'No se pudieron cargar las ciudades');
      }
    },
    [showAlert]
  );

  useEffect(() => {
    // Cargar países al montar el componente
    loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    // Seleccionar Colombia por defecto cuando los países estén disponibles
    if (countries.length > 0 && !formData.countryId) {
      const colombia = countries.find(
        c => c.Nombre.toLowerCase() === 'colombia'
      );
      if (colombia) {
        setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      regionId,
      cityId: '',
    }));
    await loadCities(regionId);
  };

  const handleCitySelect = (cityId: string) => {
    setFormData(prev => ({ ...prev, cityId }));
  };

  const handleAddressChange = (text: string) => {
    setFormData(prev => ({ ...prev, address: text }));
  };

  const validate = () => {
    if (!formData.countryId) {
      showAlert('warning', 'Campo requerido', 'Selecciona un país');
      return false;
    }
    if (!formData.regionId) {
      showAlert('warning', 'Campo requerido', 'Selecciona una región');
      return false;
    }
    if (!formData.cityId) {
      showAlert('warning', 'Campo requerido', 'Selecciona una ciudad');
      return false;
    }
    if (!formData.address.trim()) {
      showAlert('warning', 'Campo requerido', 'Ingresa la dirección');
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await GymService.updateGymStep(formData);
      onNext(formData);
    } catch {
      showAlert(
        'error',
        'Error',
        'No se pudo guardar la información de ubicación'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={GymStyles.step3Container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={GymStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={GymStyles.step3Header}>
          <FontAwesome name='map-marker' size={40} color={Colors.dark.tint} />
          <Text style={GymStyles.step3Title}>Ubicación de la empresa</Text>
          <Text style={GymStyles.step3Subtitle}>
            Selecciona el país, región, ciudad en el que se encuentra registrado
            el gimnasio
          </Text>
        </View>

        <View style={GymStyles.step3Form}>
          <View style={{ opacity: 0.6 }} pointerEvents='none'>
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
            label='Dirección de la oficina principal*'
            value={formData.address}
            onChangeText={handleAddressChange}
            multiline
            numberOfLines={2}
          />
        </View>
      </ScrollView>
      <View style={GymStyles.step3ButtonContainer}>
        <Button title='Continuar' onPress={onSubmit} loading={loading} />
      </View>
      <AlertComponent />
    </KeyboardAvoidingView>
  );
}
