import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import Dropdown from './Dropdown';
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

  const [eps, setEps] = useState(initialData?.eps || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [emergencyContact, setEmergencyContact] = useState(initialData?.emergencyContact || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [emergencyPhone, setEmergencyPhone] = useState(initialData?.emergencyPhone || '');
  const [address, setAddress] = useState(initialData?.address || '');
  
  // Nuevos campos
  const [documentType, setDocumentType] = useState(initialData?.documentType || '');
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string | undefined>(initialData?.documentTypeId);
  const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>(initialData?.countryId);
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>(initialData?.regionId);
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(initialData?.cityId);
  const [selectedEpsId, setSelectedEpsId] = useState<string | undefined>(initialData?.epsId);
  
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

  // Handlers para cargas dinámicas
  const handleCountryChange = async (countryName: string) => {
    const country = countries.find(c => c.Nombre === countryName);
    setSelectedCountryId(country?.Id);
    setCountry(countryName);
    
    if (country?.Id) {
      await loadDocumentTypesByCountry(country.Id);
      await loadRegionsByCountry(country.Id);
    }
    
    // Reset dependent fields
    setRegion('');
    setSelectedRegionId(undefined);
    setCity('');
    setSelectedCityId(undefined);
  };

  const handleRegionChange = async (regionName: string) => {
    const region = regions.find(r => r.Nombre === regionName);
    setSelectedRegionId(region?.Id);
    setRegion(regionName);
    
    if (region?.Id) {
      await loadCitiesByRegion(region.Id);
    }
    
    // Reset dependent fields
    setCity('');
    setSelectedCityId(undefined);
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    const stepData: Step3Data = {
      eps: eps || undefined,
      country: country || undefined,
      region: region || undefined,
      city: city || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() ? `${selectedCountry.dialCode}${emergencyPhone.trim()}` : undefined,
      address: address.trim() || undefined,
      documentType: documentType || undefined,
      documentTypeId: selectedDocumentTypeId,
      countryId: selectedCountryId,
      regionId: selectedRegionId,
      cityId: selectedCityId,
      epsId: selectedEpsId,
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
      // Continuar aunque falle la API para no bloquear el flujo
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  };

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
        <Dropdown
          label="Tipo de documento"
          placeholder="Selecciona tu tipo de documento"
          options={documentTypes.map(doc => doc.Nombre)}
          value={selectedDocumentTypeId ? documentTypes.find(d => d.Id === selectedDocumentTypeId)?.Nombre || '' : ''}
          onSelect={(docTypeName: string) => {
            const docType = documentTypes.find(d => d.Nombre === docTypeName);
            setDocumentType(docTypeName);
            setSelectedDocumentTypeId(docType?.Id);
          }}
        />

        <Dropdown
          label="País de residencia"
          placeholder="Selecciona tu país"
          options={countries.map(country => country.Nombre)}
          value={selectedCountryId ? countries.find(c => c.Id === selectedCountryId)?.Nombre || '' : ''}
          onSelect={handleCountryChange}
          searchable
        />

        <Dropdown
          label="EPS"
          placeholder="Selecciona tu EPS"
          options={epsOptions.map(eps => eps.Nombre)}
          value={selectedEpsId ? epsOptions.find(e => e.Id === selectedEpsId)?.Nombre || '' : ''}
          onSelect={(epsName: string) => {
            const epsItem = epsOptions.find(e => e.Nombre === epsName);
            setEps(epsName);
            setSelectedEpsId(epsItem?.Id);
          }}
        />

        <Dropdown
          label="País (ubicación actual)"
          placeholder="Selecciona tu país actual"
          options={countries.map(country => country.Nombre)}
          value={country}
          onSelect={setCountry}
          searchable
        />

        <Dropdown
          label="Región/Departamento"
          placeholder="Selecciona tu región"
          options={regions.map(region => region.Nombre)}
          value={region}
          onSelect={handleRegionChange}
          searchable
        />

        <Dropdown
          label="Ciudad"
          placeholder="Selecciona tu ciudad"
          options={cities.map(city => city.Nombre)}
          value={city}
          onSelect={(cityName: string) => {
            const cityItem = cities.find(c => c.Nombre === cityName);
            setCity(cityName);
            setSelectedCityId(cityItem?.Id);
          }}
          searchable
        />

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Nombre de un contacto de emergencia
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
            placeholder="Nombre completo"
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            autoCapitalize="words"
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Teléfono del contacto de emergencia
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
                onChangeText={setEmergencyPhone}
                placeholder="300 123 4567"
                placeholderTextColor={`${Colors[colorScheme].text}60`}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={commonStyles.inputContainer}>
          <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
            Dirección
          </Text>
          <TextInput
            style={[
              commonStyles.input,
              commonStyles.multilineInput,
              {
                backgroundColor: Colors[colorScheme].background,
                color: Colors[colorScheme].text,
                borderColor: '#666',
              },
            ]}
            value={address}
            onChangeText={setAddress}
            placeholder="Calle, carrera, número, apartamento..."
            placeholderTextColor={`${Colors[colorScheme].text}60`}
            multiline
            numberOfLines={3}
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
    </ScrollView>
  );
}
