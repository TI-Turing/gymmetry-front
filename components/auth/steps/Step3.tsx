import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../../Themed';
import CountryCodePicker, { DEFAULT_COUNTRY } from '../CountryCodePicker';
import { userService } from '@/services/userService';
import { catalogService } from '@/services/catalogService';
import { userSessionService } from '@/services/userSessionService';
import { Step3Data, Country } from '../types';
// import { handleApiError } from '../utils/api';
import { commonStyles } from '../styles/common';
// import { FilterableModal } from '../FilterableModal';
import { useStep3Form } from '../hooks/useStep3Form';
import { useCustomAlert } from '@/components/common/CustomAlert';
import {
  Country as CountryType,
  Region,
  City,
  EPS,
  DocumentType,
} from '@/dto/common';
import { RegionSelector } from '@/components/catalogs/RegionSelector';
import { CitySelector } from '@/components/catalogs/CitySelector';
import { DocumentTypeSelector } from '@/components/catalogs/DocumentTypeSelector';
import { EPSSelector } from '@/components/catalogs/EPSSelector';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStep3Styles } from '../styles/step3';

interface Step3Props {
  userId: string;
  onNext: (data: Step3Data) => void;
  onBack?: () => void;
  initialData?: Step3Data;
}

interface CatalogData {
  countries: CountryType[];
  regions: Region[];
  cities: City[];
  epsOptions: EPS[];
  documentTypes: DocumentType[];
  userCountryData: { id: string; name: string } | null;
}

export default forwardRef<{ snapshot: () => Partial<Step3Data> }, Step3Props>(
  function Step3(
    { userId, onNext, onBack: _onBack, initialData }: Step3Props,
    ref
  ) {
    const { showError, AlertComponent } = useCustomAlert();
    const formData = useStep3Form(initialData);
    const styles = useThemedStyles(makeStep3Styles);

    const [isLoading, setIsLoading] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(
      DEFAULT_COUNTRY || {
        code: 'CO',
        name: 'Colombia',
        dialCode: '+57',
        flag: '🇨🇴',
      }
    );

    // Catalog data
    const [catalogData, setCatalogData] = useState<CatalogData>({
      countries: [],
      regions: [],
      cities: [],
      epsOptions: [],
      documentTypes: [],
      userCountryData: null,
    });

    // Individual loading states to avoid object reference changes
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [regionsLoading, setRegionsLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [epsLoading, setEpsLoading] = useState(false);
    const [documentTypesLoading, setDocumentTypesLoading] = useState(false);

    const loadCountries = useCallback(async () => {
      if (countriesLoading || catalogData.countries.length > 0) {
        return;
      }

      setCountriesLoading(true);
      try {
        const data = await catalogService.getCountries();
        setCatalogData((prev) => ({ ...prev, countries: data }));
      } catch {
      } finally {
        setCountriesLoading(false);
      }
    }, [countriesLoading, catalogData.countries.length]);

    const loadRegions = useCallback(
      async (countryId: string) => {
        if (regionsLoading) {
          return;
        }

        setRegionsLoading(true);
        try {
          const data = await catalogService.getRegionsByCountry(countryId);
          setCatalogData((prev) => ({ ...prev, regions: data, cities: [] }));
        } catch {
        } finally {
          setRegionsLoading(false);
        }
      },
      [regionsLoading]
    );

    const loadCities = useCallback(
      async (regionId: string) => {
        if (citiesLoading) {
          return;
        }

        setCitiesLoading(true);
        try {
          const data = await catalogService.getCitiesByRegion(regionId);
          setCatalogData((prev) => ({ ...prev, cities: data }));
        } catch {
        } finally {
          setCitiesLoading(false);
        }
      },
      [citiesLoading]
    );

    const loadEPS = useCallback(async () => {
      if (epsLoading || catalogData.epsOptions.length > 0) {
        return;
      }

      setEpsLoading(true);
      try {
        const data = await catalogService.getEPS();
        setCatalogData((prev) => ({ ...prev, epsOptions: data }));
      } catch {
      } finally {
        setEpsLoading(false);
      }
    }, [epsLoading, catalogData.epsOptions.length]);

    const loadDocumentTypes = useCallback(
      async (countryId?: string) => {
        if (documentTypesLoading) {
          return;
        }

        setDocumentTypesLoading(true);
        try {
          const data = countryId
            ? await catalogService.getDocumentTypesByCountry(countryId)
            : await catalogService.getDocumentTypes();
          setCatalogData((prev) => ({ ...prev, documentTypes: data }));
        } catch {
        } finally {
          setDocumentTypesLoading(false);
        }
      },
      [documentTypesLoading]
    );

    const loadUserCountry = useCallback(async () => {
      try {
        const sessionData = userSessionService.getUserCountryData();
        if (sessionData) {
          setCatalogData((prev) => ({ ...prev, userCountryData: sessionData }));
        }
      } catch {}
    }, []);

    // Load initial data
    useEffect(() => {
      loadUserCountry();
      loadCountries();
      loadEPS();
    }, [loadUserCountry, loadCountries, loadEPS]); // cargar una vez

    // Load dependent data - solo depende del selectedCountryId
    useEffect(() => {
      if (formData.selectedCountryId) {
        loadRegions(formData.selectedCountryId);
        loadDocumentTypes(formData.selectedCountryId);
      }
    }, [formData.selectedCountryId, loadRegions, loadDocumentTypes]);

    useEffect(() => {
      if (formData.selectedRegionId) {
        loadCities(formData.selectedRegionId);
      }
    }, [formData.selectedRegionId, loadCities]);

    // Auto-select user's country
    useEffect(() => {
      if (
        catalogData.userCountryData &&
        !initialData?.country &&
        !formData.country
      ) {
        formData.setCountry(catalogData.userCountryData.name);
        formData.setSelectedCountryId(catalogData.userCountryData.id);
      }
    }, [catalogData.userCountryData, initialData, formData]);

    const handleNext = useCallback(async () => {
      setIsLoading(true);

      const stepData: Step3Data = {
        eps: formData.eps.trim() || undefined,
        epsId: formData.selectedEpsId || undefined,
        country: formData.country.trim() || undefined,
        countryId: formData.selectedCountryId || undefined,
        region: formData.region.trim() || undefined,
        regionId: formData.selectedRegionId || undefined,
        city: formData.city.trim() || undefined,
        cityId: formData.selectedCityId || undefined,
        documentType: formData.documentType.trim() || undefined,
        documentTypeId: formData.selectedDocumentTypeId || undefined,
        documentNumber: formData.documentNumber.trim() || undefined,
        emergencyContact: formData.emergencyContact.trim() || undefined,
        emergencyPhone: formData.emergencyPhone.trim()
          ? `${selectedCountry.dialCode}${formData.emergencyPhone.trim()}`
          : undefined,
        address: formData.address.trim() || undefined,
      };

      try {
        // Crear objeto UpdateRequest completo
        const updateRequest = {
          Id: userId,
          IdEps: stepData.epsId || null,
          Name: 'Usuario', // Valor temporal - se puede mejorar obteniendo del contexto
          LastName: 'Usuario', // Valor temporal
          UserName: 'Usuario Usuario', // Valor temporal
          IdGender: null,
          BirthDate: null,
          DocumentTypeId: stepData.documentTypeId || null,
          Phone: null,
          CountryId: stepData.countryId || null,
          Address: stepData.address || null,
          CityId: stepData.cityId || null,
          RegionId: stepData.regionId || null,
          Rh: null,
          EmergencyName: stepData.emergencyContact || null,
          EmergencyPhone: stepData.emergencyPhone || null,
          PhysicalExceptions: null,
          UserTypeId: null,
          PhysicalExceptionsNotes: null,
        };

        const response = await userService.updateUser(updateRequest);

        if (!response.Success) {
          showError(
            response.Message ||
              'Error al actualizar los datos. Intenta de nuevo.'
          );
          return; // NO permitir avanzar si la API falla
        }

        onNext(stepData);
      } catch {
        showError('No se pudieron guardar los datos. Intenta de nuevo.');
        // NO avanzar en caso de error
      } finally {
        setIsLoading(false);
      }
    }, [formData, selectedCountry, userId, onNext, showError]);

    // Exponer snapshot para preservar datos al retroceder
    useImperativeHandle(ref, () => ({
      snapshot: () => ({
        eps: formData.eps || undefined,
        epsId: formData.selectedEpsId || undefined,
        country: formData.country || undefined,
        countryId: formData.selectedCountryId || undefined,
        region: formData.region || undefined,
        regionId: formData.selectedRegionId || undefined,
        city: formData.city || undefined,
        cityId: formData.selectedCityId || undefined,
        documentType: formData.documentType || undefined,
        documentTypeId: formData.selectedDocumentTypeId || undefined,
        documentNumber: formData.documentNumber || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        emergencyPhone: formData.emergencyPhone || undefined,
        address: formData.address || undefined,
      }),
    }));

    // Handlers al usar componentes de catálogos reutilizables
    const onRegionSelect = useCallback(
      (id: string) => {
        const item = catalogData.regions.find((r) => r.Id === id);
        if (item) {
          formData.setRegion(item.Nombre);
          formData.setSelectedRegionId(item.Id);
          formData.clearCityData();
        }
      },
      [catalogData.regions, formData]
    );

    const onCitySelect = useCallback(
      (id: string) => {
        const item = catalogData.cities.find((c) => c.Id === id);
        if (item) {
          formData.setCity(item.Nombre);
          formData.setSelectedCityId(item.Id);
        }
      },
      [catalogData.cities, formData]
    );

    const onDocumentTypeSelect = useCallback(
      (id: string) => {
        const item = catalogData.documentTypes.find((d) => d.Id === id);
        if (item) {
          formData.setDocumentType(item.Nombre);
          formData.setSelectedDocumentTypeId(item.Id);
        }
      },
      [catalogData.documentTypes, formData]
    );

    const onEpsSelect = useCallback(
      (id: string) => {
        const item = catalogData.epsOptions.find((e) => e.Id === id);
        if (item) {
          formData.setEps(item.Nombre);
          formData.setSelectedEpsId(item.Id);
        }
      },
      [catalogData.epsOptions, formData]
    );

    return (
      <ScrollView contentContainerStyle={commonStyles.container}>
        <View style={commonStyles.header}>
          <Text style={[commonStyles.title, { color: styles.colors.text }]}>
            Información personal
          </Text>
          <Text style={[commonStyles.subtitle, { color: styles.colors.text }]}>
            Datos adicionales para tu perfil (opcional)
          </Text>
        </View>

        <View style={commonStyles.form}>
          {/* País (no editable) */}
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, { color: styles.colors.text }]}>
              País
            </Text>
            <View style={[commonStyles.input, styles.inputDisabled]}>
              <Text
                style={{
                  color: formData.country
                    ? styles.colors.text
                    : styles.colors.placeholder,
                }}
              >
                {formData.country || 'Cargando país...'}
              </Text>
            </View>
          </View>

          {/* Región */}
          <RegionSelector
            regions={
              catalogData.regions as unknown as import('@/components/catalogs/types').Region[]
            }
            countryId={formData.selectedCountryId}
            value={formData.selectedRegionId}
            onSelect={onRegionSelect}
            disabled={!formData.selectedCountryId}
            loading={regionsLoading}
          />

          {/* Ciudad */}
          <CitySelector
            cities={
              catalogData.cities as unknown as import('@/components/catalogs/types').City[]
            }
            regionId={formData.selectedRegionId}
            value={formData.selectedCityId}
            onSelect={onCitySelect}
            disabled={!formData.selectedRegionId}
            loading={citiesLoading}
          />

          {/* Tipo de documento */}
          <DocumentTypeSelector
            documentTypes={
              catalogData.documentTypes as unknown as import('@/components/catalogs/types').DocumentType[]
            }
            countryId={formData.selectedCountryId}
            value={formData.selectedDocumentTypeId}
            onSelect={onDocumentTypeSelect}
            loading={documentTypesLoading}
          />

          {/* Número de documento */}
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, { color: styles.colors.text }]}>
              Número de documento
            </Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.documentNumber}
              onChangeText={formData.handleDocumentNumberChange}
              placeholder="Ingresa tu número de documento"
              placeholderTextColor={styles.colors.placeholder}
              keyboardType="number-pad"
              maxLength={20}
            />
          </View>

          {/* EPS */}
          <EPSSelector
            epsOptions={
              catalogData.epsOptions as unknown as import('@/components/catalogs/types').EPS[]
            }
            value={formData.selectedEpsId}
            onSelect={onEpsSelect}
            loading={epsLoading}
          />

          {/* Contacto de emergencia */}
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, { color: styles.colors.text }]}>
              Contacto de emergencia
            </Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.emergencyContact}
              onChangeText={formData.setEmergencyContact}
              placeholder="Nombre del contacto"
              placeholderTextColor={styles.colors.placeholder}
              autoCapitalize="words"
            />
          </View>

          {/* Teléfono de emergencia */}
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, { color: styles.colors.text }]}>
              Teléfono de emergencia
            </Text>
            <View style={commonStyles.phoneRow}>
              <View style={commonStyles.prefixContainer}>
                <CountryCodePicker
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
              </View>
              <View style={commonStyles.phoneContainer}>
                <TextInput
                  style={[commonStyles.input, styles.input]}
                  value={formData.emergencyPhone}
                  keyboardType="number-pad"
                  onChangeText={formData.handleEmergencyPhoneChange}
                  placeholder="3001234567"
                  placeholderTextColor={styles.colors.placeholder}
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Dirección */}
          <View style={commonStyles.inputContainer}>
            <Text style={[commonStyles.label, { color: styles.colors.text }]}>
              Dirección
            </Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={formData.address}
              onChangeText={formData.setAddress}
              placeholder="Ingresa tu dirección"
              placeholderTextColor={styles.colors.placeholder}
              multiline
              numberOfLines={2}
            />
          </View>

          <TouchableOpacity
            style={[
              commonStyles.button,
              styles.button,
              isLoading && commonStyles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={isLoading}
          >
            <Text style={commonStyles.buttonText}>
              {isLoading ? 'Guardando...' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modals propios removidos: usando componentes de catálogos reutilizables */}

        {/* Componente de alertas personalizado */}
        <AlertComponent />
      </ScrollView>
    );
  }
);
