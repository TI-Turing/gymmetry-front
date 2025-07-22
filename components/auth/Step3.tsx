import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import CountryCodePicker, { DEFAULT_COUNTRY } from './CountryCodePicker';
import { userAPI } from '@/services/apiExamples';
import { useCatalogs } from './hooks/useCatalogs';

// Imports locales
import { Step3Data, Country } from './types';
import { handleApiError } from './utils/api';
import { commonStyles } from './styles/common';

interface Step3Props {
  userId: string;
  onNext: (data: Step3Data) => void;
  initialData?: Step3Data;
}

export default function Step3({ userId, onNext, initialData }: Step3Props) {
  // Hook para obtener catálogos
  const { 
    documentTypes, 
    countries, 
    regions, 
    cities, 
    eps: epsOptions, 
    loading, 
    loadRegionsByCountry, 
    loadCitiesByRegion, 
    loadDocumentTypesByCountry 
  } = useCatalogs();

  // Estados básicos
  const [eps, setEps] = useState(initialData?.eps || '');
  const [selectedEpsId, setSelectedEpsId] = useState(initialData?.epsId || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [selectedCountryId, setSelectedCountryId] = useState(initialData?.countryId || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [selectedRegionId, setSelectedRegionId] = useState(initialData?.regionId || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [selectedCityId, setSelectedCityId] = useState(initialData?.cityId || '');
  const [documentType, setDocumentType] = useState(initialData?.documentType || '');
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(initialData?.documentTypeId || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyPhone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para modales
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showEpsModal, setShowEpsModal] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);

  // Estados para filtros
  const [countryFilter, setCountryFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [epsFilter, setEpsFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');

  const colorScheme = useColorScheme();

  // Efectos para cargar datos dependientes
  useEffect(() => {
    if (selectedCountryId) {
      loadRegionsByCountry(selectedCountryId);
      loadDocumentTypesByCountry(selectedCountryId);
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (selectedRegionId) {
      loadCitiesByRegion(selectedRegionId);
    }
  }, [selectedRegionId]);

  const handlePhoneChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setEmergencyPhone(numericOnly);
  };

  const handleNext = async () => {
    setIsLoading(true);

    const stepData: Step3Data = {
      eps: eps.trim() || undefined,
      epsId: selectedEpsId || undefined,
      country: country.trim() || undefined,
      countryId: selectedCountryId || undefined,
      region: region.trim() || undefined,
      regionId: selectedRegionId || undefined,
      city: city.trim() || undefined,
      cityId: selectedCityId || undefined,
      documentType: documentType.trim() || undefined,
      documentTypeId: selectedDocumentTypeId || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() ? `${selectedCountry.dialCode}${emergencyPhone.trim()}` : undefined,
      address: address.trim() || undefined,
    };
    
    try {
      const updateData = {
        emergencyName: stepData.emergencyContact,
        emergencyPhone: stepData.emergencyPhone,
        address: stepData.address,
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
  };

  // Funciones para filtrar opciones
  const getFilteredCountries = () => {
    return countries.filter(country => 
      country.Nombre.toLowerCase().includes(countryFilter.toLowerCase())
    );
  };

  const getFilteredRegions = () => {
    return regions.filter(region => 
      region.Nombre.toLowerCase().includes(regionFilter.toLowerCase())
    );
  };

  const getFilteredCities = () => {
    return cities.filter(city => 
      city.Nombre.toLowerCase().includes(cityFilter.toLowerCase())
    );
  };

  const getFilteredEps = () => {
    return epsOptions.filter(eps => 
      eps.Nombre.toLowerCase().includes(epsFilter.toLowerCase())
    );
  };

  const getFilteredDocumentTypes = () => {
    return documentTypes.filter(docType => 
      docType.Nombre.toLowerCase().includes(documentTypeFilter.toLowerCase())
    );
  };

  // Componente modal reutilizable con filtro
  const FilterableModal = ({ 
    visible, 
    onClose, 
    title, 
    data, 
    selectedId, 
    onSelect, 
    filter, 
    onFilterChange, 
    placeholder 
  }: {
    visible: boolean;
    onClose: () => void;
    title: string;
    data: any[];
    selectedId: string;
    onSelect: (item: any) => void;
    filter: string;
    onFilterChange: (text: string) => void;
    placeholder: string;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: 400,
            maxHeight: '80%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onStartShouldSetResponder={() => true}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme].text,
            }}>
              {title}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: `${Colors[colorScheme].text}10`,
              }}
            >
              <Text style={{
                fontSize: 16,
                color: Colors[colorScheme].text,
                fontWeight: 'bold',
              }}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campo de filtro */}
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
                marginBottom: 16,
              },
            ]}
            value={filter}
            onChangeText={onFilterChange}
            placeholder={placeholder}
            placeholderTextColor={`${Colors[colorScheme].text}60`}
          />

          <ScrollView style={{ maxHeight: 300 }}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={item.Id}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: index === data.length - 1 ? 0 : 8,
                  backgroundColor: selectedId === item.Id 
                    ? `${Colors[colorScheme].tint}10` 
                    : 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => onSelect(item)}
              >
                <Text style={{
                  color: selectedId === item.Id 
                    ? Colors[colorScheme].tint 
                    : Colors[colorScheme].text,
                  fontWeight: selectedId === item.Id ? '600' : 'normal',
                  fontSize: 16,
                }}>
                  {item.Nombre}
                </Text>
                {selectedId === item.Id && (
                  <Text style={{
                    color: Colors[colorScheme].tint,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
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
            onPress={() => setShowDocumentTypeModal(true)}
          >
            <Text style={{
              color: selectedDocumentTypeId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedDocumentTypeId 
                ? documentTypes.find(d => d.Id === selectedDocumentTypeId)?.Nombre || 'Documento seleccionado'
                : 'Selecciona tipo de documento'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
        </View>

        {/* País */}
        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            País
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
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={{
              color: selectedCountryId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedCountryId 
                ? countries.find(c => c.Id === selectedCountryId)?.Nombre || 'País seleccionado'
                : 'Selecciona tu país'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
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
                alignItems: 'center',
                opacity: !selectedCountryId ? 0.5 : 1
              }
            ]}
            onPress={() => selectedCountryId && setShowRegionModal(true)}
            disabled={!selectedCountryId}
          >
            <Text style={{
              color: selectedRegionId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {!selectedCountryId 
                ? 'Selecciona un país primero'
                : selectedRegionId 
                  ? regions.find(r => r.Id === selectedRegionId)?.Nombre || 'Región seleccionada'
                  : 'Selecciona tu región'
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
                alignItems: 'center',
                opacity: !selectedRegionId ? 0.5 : 1
              }
            ]}
            onPress={() => selectedRegionId && setShowCityModal(true)}
            disabled={!selectedRegionId}
          >
            <Text style={{
              color: selectedCityId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {!selectedRegionId 
                ? 'Selecciona una región primero'
                : selectedCityId 
                  ? cities.find(c => c.Id === selectedCityId)?.Nombre || 'Ciudad seleccionada'
                  : 'Selecciona tu ciudad'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
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
            onPress={() => setShowEpsModal(true)}
          >
            <Text style={{
              color: selectedEpsId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedEpsId 
                ? epsOptions.find(e => e.Id === selectedEpsId)?.Nombre || 'EPS seleccionada'
                : 'Selecciona tu EPS'
              }
            </Text>
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              ▼
            </Text>
          </TouchableOpacity>
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
            value={address}
            onChangeText={setAddress}
            placeholder="Calle 123 #45-67"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={2}
          />
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
            value={emergencyContact}
            onChangeText={setEmergencyContact}
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
                value={emergencyPhone}
                keyboardType="number-pad"
                onChangeText={handlePhoneChange}
                placeholder="3001234567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                maxLength={10}
              />
            </View>
          </View>
        </View>

        {/* Modales */}
        <FilterableModal
          visible={showDocumentTypeModal}
          onClose={() => {
            setShowDocumentTypeModal(false);
            setDocumentTypeFilter('');
          }}
          title="Seleccionar Tipo de Documento"
          data={getFilteredDocumentTypes()}
          selectedId={selectedDocumentTypeId}
          onSelect={(docType) => {
            setSelectedDocumentTypeId(docType.Id);
            setDocumentType(docType.Nombre);
            setShowDocumentTypeModal(false);
            setDocumentTypeFilter('');
          }}
          filter={documentTypeFilter}
          onFilterChange={setDocumentTypeFilter}
          placeholder="Buscar tipo de documento..."
        />

        <FilterableModal
          visible={showCountryModal}
          onClose={() => {
            setShowCountryModal(false);
            setCountryFilter('');
          }}
          title="Seleccionar País"
          data={getFilteredCountries()}
          selectedId={selectedCountryId}
          onSelect={(country) => {
            setSelectedCountryId(country.Id);
            setCountry(country.Nombre);
            // Reset dependent fields
            setSelectedRegionId('');
            setRegion('');
            setSelectedCityId('');
            setCity('');
            setShowCountryModal(false);
            setCountryFilter('');
          }}
          filter={countryFilter}
          onFilterChange={setCountryFilter}
          placeholder="Buscar país..."
        />

        <FilterableModal
          visible={showRegionModal}
          onClose={() => {
            setShowRegionModal(false);
            setRegionFilter('');
          }}
          title="Seleccionar Región"
          data={getFilteredRegions()}
          selectedId={selectedRegionId}
          onSelect={(region) => {
            setSelectedRegionId(region.Id);
            setRegion(region.Nombre);
            // Reset dependent fields
            setSelectedCityId('');
            setCity('');
            setShowRegionModal(false);
            setRegionFilter('');
          }}
          filter={regionFilter}
          onFilterChange={setRegionFilter}
          placeholder="Buscar región..."
        />

        <FilterableModal
          visible={showCityModal}
          onClose={() => {
            setShowCityModal(false);
            setCityFilter('');
          }}
          title="Seleccionar Ciudad"
          data={getFilteredCities()}
          selectedId={selectedCityId}
          onSelect={(city) => {
            setSelectedCityId(city.Id);
            setCity(city.Nombre);
            setShowCityModal(false);
            setCityFilter('');
          }}
          filter={cityFilter}
          onFilterChange={setCityFilter}
          placeholder="Buscar ciudad..."
        />

        <FilterableModal
          visible={showEpsModal}
          onClose={() => {
            setShowEpsModal(false);
            setEpsFilter('');
          }}
          title="Seleccionar EPS"
          data={getFilteredEps()}
          selectedId={selectedEpsId}
          onSelect={(eps) => {
            setSelectedEpsId(eps.Id);
            setEps(eps.Nombre);
            setShowEpsModal(false);
            setEpsFilter('');
          }}
          filter={epsFilter}
          onFilterChange={setEpsFilter}
          placeholder="Buscar EPS..."
        />

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
    </ScrollView>
  );
}
