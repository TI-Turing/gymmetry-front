import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { userAPI } from '@/services/apiExamples';
import { catalogService } from '@/services/catalogService';
import { userSessionService } from '@/services/userSessionService';
import { Step3Data, Country } from './types';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';
import { FilterableModal } from './FilterableModal';
import { useStep3Form } from './hooks/useStep3Form';
import { 
  Country as CountryType,
  Region,
  City,
  EPS,
  DocumentType
} from '@/dto/common';

interface Step3Props {
  userId: string;
  onNext: (data: Step3Data) => void;
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

interface LoadingStates {
  countries: boolean;
  regions: boolean;
  cities: boolean;
  eps: boolean;
  documentTypes: boolean;
}

export default function Step3({ userId, onNext, initialData }: Step3Props) {
  const colorScheme = useColorScheme();
  const formData = useStep3Form(initialData);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  
  // Catalog data
  const [catalogData, setCatalogData] = useState<CatalogData>({
    countries: [],
    regions: [],
    cities: [],
    epsOptions: [],
    documentTypes: [],
    userCountryData: null,
  });
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    countries: false,
    regions: false,
    cities: false,
    eps: false,
    documentTypes: false,
  });

  const loadCountries = useCallback(async () => {
    if (loadingStates.countries || catalogData.countries.length > 0) return;
    
    setLoadingStates(prev => ({ ...prev, countries: true }));
    try {
      const data = await catalogService.getCountries();
      setCatalogData(prev => ({ ...prev, countries: data }));
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, countries: false }));
    }
  }, [loadingStates.countries, catalogData.countries.length]);

  const loadRegions = useCallback(async (countryId: string) => {
    if (loadingStates.regions) return;
    
    setLoadingStates(prev => ({ ...prev, regions: true }));
    try {
      const data = await catalogService.getRegionsByCountry(countryId);
      setCatalogData(prev => ({ ...prev, regions: data, cities: [] }));
    } catch (error) {
      console.error('Error loading regions:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, regions: false }));
    }
  }, [loadingStates.regions]);

  const loadCities = useCallback(async (regionId: string) => {
    if (loadingStates.cities) return;
    
    setLoadingStates(prev => ({ ...prev, cities: true }));
    try {
      const data = await catalogService.getCitiesByRegion(regionId);
      setCatalogData(prev => ({ ...prev, cities: data }));
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, cities: false }));
    }
  }, [loadingStates.cities]);

  const loadEPS = useCallback(async () => {
    if (loadingStates.eps || catalogData.epsOptions.length > 0) return;
    
    setLoadingStates(prev => ({ ...prev, eps: true }));
    try {
      const data = await catalogService.getEPS();
      setCatalogData(prev => ({ ...prev, epsOptions: data }));
    } catch (error) {
      console.error('Error loading EPS:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, eps: false }));
    }
  }, [loadingStates.eps, catalogData.epsOptions.length]);

  const loadDocumentTypes = useCallback(async (countryId?: string) => {
    if (loadingStates.documentTypes) return;
    
    setLoadingStates(prev => ({ ...prev, documentTypes: true }));
    try {
      const data = countryId 
        ? await catalogService.getDocumentTypesByCountry(countryId)
        : await catalogService.getDocumentTypes();
      setCatalogData(prev => ({ ...prev, documentTypes: data }));
    } catch (error) {
      console.error('Error loading document types:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, documentTypes: false }));
    }
  }, [loadingStates.documentTypes]);

  const loadUserCountry = useCallback(async () => {
    try {
      const sessionData = userSessionService.getUserCountryData();
      if (sessionData) {
        setCatalogData(prev => ({ ...prev, userCountryData: sessionData }));
      }
    } catch (error) {
      console.error('Error loading user country:', error);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadUserCountry();
    loadCountries();
    loadEPS();
  }, [loadUserCountry, loadCountries, loadEPS]);

  // Load dependent data
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
    if (catalogData.userCountryData && !initialData?.country && !formData.country) {
      formData.setCountry(catalogData.userCountryData.name);
      formData.setSelectedCountryId(catalogData.userCountryData.id);
    }
  }, [catalogData.userCountryData, initialData, formData.country]);

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
      const updateData = {
        emergencyName: stepData.emergencyContact,
        emergencyPhone: stepData.emergencyPhone,
        address: stepData.address,
        ...(stepData.documentNumber && { documentNumber: stepData.documentNumber }),
        ...(stepData.eps && { eps: stepData.eps }),
        ...(stepData.country && { country: stepData.country }),
        ...(stepData.region && { region: stepData.region }),
        ...(stepData.city && { city: stepData.city }),
        ...(stepData.documentType && { DocumentType: stepData.documentType }),
        ...(stepData.documentTypeId && { DocumentTypeId: stepData.documentTypeId }),
        ...(stepData.countryId && { CountryId: stepData.countryId }),
      };
      
      const response = await userAPI.updateUser(userId, updateData);
      
      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }
      
      onNext(stepData);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      console.error('❌ [STEP 3] Error:', errorMessage);
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  }, [formData, selectedCountry, userId, onNext]);

  const handleRegionSelect = useCallback((item: Region) => {
    formData.setRegion(item.Nombre);
    formData.setSelectedRegionId(item.Id);
    formData.setShowRegionModal(false);
    formData.setRegionFilter('');
    formData.clearCityData();
  }, [formData]);

  const handleCitySelect = useCallback((item: City) => {
    formData.setCity(item.Nombre);
    formData.setSelectedCityId(item.Id);
    formData.setShowCityModal(false);
    formData.setCityFilter('');
  }, [formData]);

  const handleDocumentTypeSelect = useCallback((item: DocumentType) => {
    formData.setDocumentType(item.Nombre);
    formData.setSelectedDocumentTypeId(item.Id);
    formData.setShowDocumentTypeModal(false);
    formData.setDocumentTypeFilter('');
  }, [formData]);

  const handleEpsSelect = useCallback((item: EPS) => {
    formData.setEps(item.Nombre);
    formData.setSelectedEpsId(item.Id);
    formData.setShowEpsModal(false);
    formData.setEpsFilter('');
  }, [formData]);

  const filteredRegions = useMemo(() => 
    formData.getFilteredRegions(catalogData.regions), 
    [formData.getFilteredRegions, catalogData.regions]
  );

  const filteredCities = useMemo(() => 
    formData.getFilteredCities(catalogData.cities), 
    [formData.getFilteredCities, catalogData.cities]
  );

  const filteredEps = useMemo(() => 
    formData.getFilteredEps(catalogData.epsOptions), 
    [formData.getFilteredEps, catalogData.epsOptions]
  );

  const filteredDocumentTypes = useMemo(() => 
    formData.getFilteredDocumentTypes(catalogData.documentTypes), 
    [formData.getFilteredDocumentTypes, catalogData.documentTypes]
  );

  return (
    <ScrollView contentContainerStyle={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={[commonStyles.title, { color: Colors[colorScheme].text }]}>
          Información personal
        </Text>
        <Text style={[commonStyles.subtitle, { color: Colors[colorScheme].text }]}>
          Datos adicionales para tu perfil (opcional)
        </Text>
      </View>

      <View style={commonStyles.form}>
        {/* País (no editable) */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            País
          </Text>
          <View
            style={[
              commonStyles.input,
              {
                backgroundColor: `${Colors[colorScheme].text}05`,
                borderColor: '#666',
                justifyContent: 'center'
              }
            ]}
          >
            <Text style={{ 
              color: formData.country ? Colors[colorScheme].text : `${Colors[colorScheme].text}60` 
            }}>
              {formData.country || 'Cargando país...'}
            </Text>
          </View>
        </View>

        {/* Región */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Región
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            ]}
            onPress={() => {
              if (!formData.selectedCountryId) return;
              formData.setShowRegionModal(true);
              if (catalogData.regions.length === 0) {
                loadRegions(formData.selectedCountryId);
              }
            }}
            disabled={!formData.selectedCountryId}
          >
            <Text style={{
              color: formData.selectedRegionId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {formData.selectedRegionId 
                ? catalogData.regions.find((r: Region) => r.Id === formData.selectedRegionId)?.Nombre || 'Región seleccionada'
                : formData.selectedCountryId ? 'Selecciona una región' : 'Selecciona un país primero'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ciudad */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Ciudad
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            ]}
            onPress={() => {
              if (!formData.selectedRegionId) return;
              formData.setShowCityModal(true);
              if (catalogData.cities.length === 0) {
                loadCities(formData.selectedRegionId);
              }
            }}
            disabled={!formData.selectedRegionId}
          >
            <Text style={{
              color: formData.selectedCityId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {formData.selectedCityId 
                ? catalogData.cities.find((c: City) => c.Id === formData.selectedCityId)?.Nombre || 'Ciudad seleccionada'
                : formData.selectedRegionId ? 'Selecciona una ciudad' : 'Selecciona una región primero'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tipo de documento */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Tipo de documento
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            ]}
            onPress={() => {
              formData.setShowDocumentTypeModal(true);
              if (catalogData.documentTypes.length === 0) {
                loadDocumentTypes();
              }
            }}
          >
            <Text style={{
              color: formData.selectedDocumentTypeId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {formData.selectedDocumentTypeId 
                ? catalogData.documentTypes.find((d: DocumentType) => d.Id === formData.selectedDocumentTypeId)?.Nombre || 'Documento seleccionado'
                : 'Selecciona tipo de documento'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* Número de documento */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Número de documento
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={formData.documentNumber}
            onChangeText={formData.handleDocumentNumberChange}
            placeholder="Ingresa tu número de documento"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="number-pad"
            maxLength={20}
          />
        </View>

        {/* EPS */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            EPS
          </Text>
          <TouchableOpacity
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: '#666',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }
            ]}
            onPress={() => formData.setShowEpsModal(true)}
          >
            <Text style={{
              color: formData.selectedEpsId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {formData.selectedEpsId 
                ? catalogData.epsOptions.find((e: EPS) => e.Id === formData.selectedEpsId)?.Nombre || 'EPS seleccionada'
                : 'Selecciona tu EPS'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contacto de emergencia */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Contacto de emergencia
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={formData.emergencyContact}
            onChangeText={formData.setEmergencyContact}
            placeholder="Nombre del contacto"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            autoCapitalize="words"
          />
        </View>

        {/* Teléfono de emergencia */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
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
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    color: Colors[colorScheme].text,
                    borderColor: '#666',
                  },
                ]}
                value={formData.emergencyPhone}
                keyboardType="number-pad"
                onChangeText={formData.handleEmergencyPhoneChange}
                placeholder="3001234567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                maxLength={10}
              />
            </View>
          </View>
        </View>

        {/* Dirección */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Dirección
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={formData.address}
            onChangeText={formData.setAddress}
            placeholder="Ingresa tu dirección"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={2}
          />
        </View>

        <TouchableOpacity
          style={[
            commonStyles.button,
            { backgroundColor: Colors[colorScheme].tint },
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

      {/* Modals */}
      <FilterableModal
        visible={formData.showRegionModal}
        onClose={() => {
          formData.setShowRegionModal(false);
          formData.setRegionFilter('');
        }}
        title="Seleccionar Región"
        data={filteredRegions}
        selectedId={formData.selectedRegionId}
        onSelect={handleRegionSelect}
        filter={formData.regionFilter}
        onFilterChange={formData.setRegionFilter}
        getItemId={(item: Region) => item.Id}
        getItemName={(item: Region) => item.Nombre}
      />

      <FilterableModal
        visible={formData.showCityModal}
        onClose={() => {
          formData.setShowCityModal(false);
          formData.setCityFilter('');
        }}
        title="Seleccionar Ciudad"
        data={filteredCities}
        selectedId={formData.selectedCityId}
        onSelect={handleCitySelect}
        filter={formData.cityFilter}
        onFilterChange={formData.setCityFilter}
        getItemId={(item: City) => item.Id}
        getItemName={(item: City) => item.Nombre}
      />

      <FilterableModal
        visible={formData.showDocumentTypeModal}
        onClose={() => {
          formData.setShowDocumentTypeModal(false);
          formData.setDocumentTypeFilter('');
        }}
        title="Seleccionar Tipo de Documento"
        data={filteredDocumentTypes}
        selectedId={formData.selectedDocumentTypeId}
        onSelect={handleDocumentTypeSelect}
        filter={formData.documentTypeFilter}
        onFilterChange={formData.setDocumentTypeFilter}
        getItemId={(item: DocumentType) => item.Id}
        getItemName={(item: DocumentType) => item.Nombre}
      />

      <FilterableModal
        visible={formData.showEpsModal}
        onClose={() => {
          formData.setShowEpsModal(false);
          formData.setEpsFilter('');
        }}
        title="Seleccionar EPS"
        data={filteredEps}
        selectedId={formData.selectedEpsId}
        onSelect={handleEpsSelect}
        filter={formData.epsFilter}
        onFilterChange={formData.setEpsFilter}
        getItemId={(item: EPS) => item.Id}
        getItemName={(item: EPS) => item.Nombre}
      />
    </ScrollView>
  );
}
