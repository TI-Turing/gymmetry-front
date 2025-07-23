import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
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
import { FontAwesome } from '@expo/vector-icons';
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

// Modal filtrable reutilizable
interface FilterableModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  selectedId: string;
  onSelect: (item: any) => void;
  filter: string;
  onFilterChange: (text: string) => void;
  placeholder?: string; // Opcional, por defecto será "Buscar"
}

const FilterableModal: React.FC<FilterableModalProps> = ({
  visible,
  onClose,
  title,
  data,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  placeholder, // Ya no lo usamos, mantenemos para compatibilidad
}) => {
  const colorScheme = useColorScheme();

  return (
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

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors[colorScheme].background,
            borderWidth: 1,
            borderColor: '#666',
            borderRadius: 8,
            marginBottom: 16,
            paddingHorizontal: 12,
          }}>
            <TextInput
              style={{
                flex: 1,
                color: Colors[colorScheme].text,
                paddingVertical: 12,
                fontSize: 16,
              }}
              value={filter}
              onChangeText={onFilterChange}
              placeholder="Buscar"
              placeholderTextColor={`${Colors[colorScheme].text}60`}
            />
            <FontAwesome 
              name="search" 
              size={16} 
              color="white" 
              style={{ marginLeft: 8 }}
            />
          </View>

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
};

export default function Step3({ userId, onNext, initialData }: Step3Props) {
  // Estados para los catálogos
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [epsOptions, setEpsOptions] = useState<EPS[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [userCountryData, setUserCountryData] = useState<{ id: string; name: string } | null>(null);
  
  // Estados de loading
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingEPS, setLoadingEPS] = useState(false);
  const [loadingDocumentTypes, setLoadingDocumentTypes] = useState(false);

  // Estados del formulario - en el orden solicitado
  const [country, setCountry] = useState(initialData?.country || '');
  const [selectedCountryId, setSelectedCountryId] = useState(initialData?.countryId || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [selectedRegionId, setSelectedRegionId] = useState(initialData?.regionId || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [selectedCityId, setSelectedCityId] = useState(initialData?.cityId || '');
  const [documentType, setDocumentType] = useState(initialData?.documentType || '');
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(initialData?.documentTypeId || '');
  const [documentNumber, setDocumentNumber] = useState(initialData?.documentNumber || '');
  
  // Estados adicionales (no están en el orden principal)
  const [eps, setEps] = useState(initialData?.eps || '');
  const [selectedEpsId, setSelectedEpsId] = useState(initialData?.epsId || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyPhone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [isLoading, setIsLoading] = useState(false);

  // Estados de los modales
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [showEpsModal, setShowEpsModal] = useState(false);

  // Estados de filtros
  const [regionFilter, setRegionFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [epsFilter, setEpsFilter] = useState('');

  const colorScheme = useColorScheme();

  // Funciones para cargar catálogos
  const loadCountries = async () => {
    if (loadingCountries || countries.length > 0) return;
    setLoadingCountries(true);
    try {
      const data = await catalogService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const loadRegions = async (countryId: string) => {
    if (loadingRegions) return;
    setLoadingRegions(true);
    try {
      const data = await catalogService.getRegionsByCountry(countryId);
      setRegions(data);
      setCities([]); // Limpiar ciudades cuando cambia el país
    } catch (error) {
      console.error('Error loading regions:', error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadCities = async (regionId: string) => {
    if (loadingCities) return;
    setLoadingCities(true);
    try {
      const data = await catalogService.getCitiesByRegion(regionId);
      setCities(data);
    } catch (error) {
      console.error('Error loading cities:', error);
    } finally {
      setLoadingCities(false);
    }
  };

  const loadEPS = async () => {
    if (loadingEPS || epsOptions.length > 0) return;
    setLoadingEPS(true);
    try {
      const data = await catalogService.getEPS();
      setEpsOptions(data);
    } catch (error) {
      console.error('Error loading EPS:', error);
    } finally {
      setLoadingEPS(false);
    }
  };

  const loadDocumentTypes = async (countryId?: string) => {
    if (loadingDocumentTypes) return;
    setLoadingDocumentTypes(true);
    try {
      const data = countryId 
        ? await catalogService.getDocumentTypesByCountry(countryId)
        : await catalogService.getDocumentTypes();
      setDocumentTypes(data);
    } catch (error) {
      console.error('Error loading document types:', error);
    } finally {
      setLoadingDocumentTypes(false);
    }
  };

  // Cargar país del usuario
  const loadUserCountry = async () => {
    try {
      const sessionData = userSessionService.getUserCountryData();
      if (sessionData) {
        setUserCountryData(sessionData);
      }
    } catch (error) {
      console.error('Error loading user country:', error);
    }
  };

  // Efectos para cargar datos iniciales
  useEffect(() => {
    loadUserCountry();
    loadCountries();
    loadEPS();
  }, []);

  // Efectos para cargar datos dependientes
  useEffect(() => {
    if (selectedCountryId) {
      loadRegions(selectedCountryId);
      loadDocumentTypes(selectedCountryId);
    }
  }, [selectedCountryId]);

  useEffect(() => {
    if (selectedRegionId) {
      loadCities(selectedRegionId);
    }
  }, [selectedRegionId]);

  // Auto-preseleccionar país del usuario si no hay datos iniciales
  useEffect(() => {
    if (userCountryData && !initialData?.country && !country) {
      setCountry(userCountryData.name);
      setSelectedCountryId(userCountryData.id);
      console.log(`🌍 País auto-seleccionado: ${userCountryData.name}`);
    }
  }, [userCountryData, initialData, country]);

  const handleDocumentNumberChange = (text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '').slice(0, 20); // Límite de 20 caracteres
    setDocumentNumber(numericOnly);
  };

  const handleEmergencyPhoneChange = (text: string) => {
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
      documentNumber: documentNumber.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() ? `${selectedCountry.dialCode}${emergencyPhone.trim()}` : undefined,
      address: address.trim() || undefined,
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
  };

  // Funciones para filtrar opciones
  const getFilteredRegions = () => regions.filter((region: Region) => 
    region.Nombre.toLowerCase().includes(regionFilter.toLowerCase())
  );

  const getFilteredCities = () => cities.filter((city: City) => 
    city.Nombre.toLowerCase().includes(cityFilter.toLowerCase())
  );

  const getFilteredEps = () => epsOptions.filter((eps: EPS) => 
    eps.Nombre.toLowerCase().includes(epsFilter.toLowerCase())
  );

  const getFilteredDocumentTypes = () => documentTypes.filter((docType: DocumentType) => 
    docType.Nombre.toLowerCase().includes(documentTypeFilter.toLowerCase())
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
              color: country ? Colors[colorScheme].text : `${Colors[colorScheme].text}60` 
            }}>
              {country || 'Cargando país...'}
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
              if (!selectedCountryId) {
                console.log('Debe seleccionar un país primero');
                return;
              }
              setShowRegionModal(true);
              if (regions.length === 0) {
                loadRegions(selectedCountryId);
              }
            }}
            disabled={!selectedCountryId}
          >
            <Text style={{
              color: selectedRegionId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedRegionId 
                ? regions.find((r: Region) => r.Id === selectedRegionId)?.Nombre || 'Región seleccionada'
                : selectedCountryId ? 'Selecciona una región' : 'Selecciona un país primero'
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
              if (!selectedRegionId) {
                console.log('Debe seleccionar una región primero');
                return;
              }
              setShowCityModal(true);
              if (cities.length === 0) {
                loadCities(selectedRegionId);
              }
            }}
            disabled={!selectedRegionId}
          >
            <Text style={{
              color: selectedCityId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedCityId 
                ? cities.find((c: City) => c.Id === selectedCityId)?.Nombre || 'Ciudad seleccionada'
                : selectedRegionId ? 'Selecciona una ciudad' : 'Selecciona una región primero'
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
              setShowDocumentTypeModal(true);
              if (documentTypes.length === 0) {
                loadDocumentTypes();
              }
            }}
          >
            <Text style={{
              color: selectedDocumentTypeId 
                ? Colors[colorScheme].text 
                : `${Colors[colorScheme].text}60`
            }}>
              {selectedDocumentTypeId 
                ? documentTypes.find((d: DocumentType) => d.Id === selectedDocumentTypeId)?.Nombre || 'Documento seleccionado'
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
            value={documentNumber}
            onChangeText={handleDocumentNumberChange}
            placeholder="Ingresa tu número de documento"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            keyboardType="number-pad"
            maxLength={20}
          />
        </View>

        {/* Campos adicionales */}
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
                ? epsOptions.find((e: EPS) => e.Id === selectedEpsId)?.Nombre || 'EPS seleccionada'
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
                onChangeText={handleEmergencyPhoneChange}
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
            value={address}
            onChangeText={setAddress}
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

      {/* Modales */}
      <FilterableModal
        visible={showRegionModal}
        onClose={() => {
          setShowRegionModal(false);
          setRegionFilter('');
        }}
        title="Seleccionar Región"
        data={getFilteredRegions()}
        selectedId={selectedRegionId}
        onSelect={(item) => {
          setRegion(item.Nombre);
          setSelectedRegionId(item.Id);
          setShowRegionModal(false);
          setRegionFilter('');
          // Limpiar ciudades cuando cambia la región
          setCities([]);
          setCity('');
          setSelectedCityId('');
        }}
        filter={regionFilter}
        onFilterChange={setRegionFilter}
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
        onSelect={(item) => {
          setCity(item.Nombre);
          setSelectedCityId(item.Id);
          setShowCityModal(false);
          setCityFilter('');
        }}
        filter={cityFilter}
        onFilterChange={setCityFilter}
      />

      <FilterableModal
        visible={showDocumentTypeModal}
        onClose={() => {
          setShowDocumentTypeModal(false);
          setDocumentTypeFilter('');
        }}
        title="Seleccionar Tipo de Documento"
        data={getFilteredDocumentTypes()}
        selectedId={selectedDocumentTypeId}
        onSelect={(item) => {
          setDocumentType(item.Nombre);
          setSelectedDocumentTypeId(item.Id);
          setShowDocumentTypeModal(false);
          setDocumentTypeFilter('');
        }}
        filter={documentTypeFilter}
        onFilterChange={setDocumentTypeFilter}
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
        onSelect={(item) => {
          setEps(item.Nombre);
          setSelectedEpsId(item.Id);
          setShowEpsModal(false);
          setEpsFilter('');
        }}
        filter={epsFilter}
        onFilterChange={setEpsFilter}
      />
    </ScrollView>
  );
}
