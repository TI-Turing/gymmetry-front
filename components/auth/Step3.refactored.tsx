import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';

import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import { FormInput } from '../common/FormInput';
import { Button } from '../common/Button';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useCustomAlert } from './CustomAlert';
import { commonStyles } from './styles/common';
import { Step3Data } from './types';
import { handleApiError } from './utils/api';
import { useStep3Form } from './hooks/useStep3Form';
import { useCatalogs } from './hooks/useCatalogs';
import Colors from '@/constants/Colors';

interface Step3Props {
  userId?: string;
  onNext: (data: Step3Data) => void;
  onBack?: () => void;
  initialData?: Step3Data;
  showError?: (message: string) => void;
}

const Step3 = memo<Step3Props>(
  ({ onNext, onBack, initialData, showError: externalShowError }) => {
    const colorScheme = useColorScheme();
    const { showError: internalShowError, AlertComponent } = useCustomAlert();

    // Usar las funciones externas si se proporcionan, sino usar las internas
    const showError = externalShowError || internalShowError;

    // Hooks de formulario y datos
    const formData = useStep3Form(initialData);
    const {
      countries,
      regions,
      cities,
      eps: epsOptions,
      documentTypes,
      loading: catalogsLoading,
      loadRegionsByCountry,
      loadCitiesByRegion,
      loadDocumentTypesByCountry,
    } = useCatalogs();

    // Estados locales
    const [isLoading, setIsLoading] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);

    // Datos calculados
    const selectedCountryName = useMemo(() => {
      const country = countries.find(
        (c: any) => c.Id === formData.selectedCountryId
      );
      return country?.Nombre || 'Seleccionar país';
    }, [countries, formData.selectedCountryId]);

    const selectedRegionName = useMemo(() => {
      const region = regions.find(
        (r: any) => r.Id === formData.selectedRegionId
      );
      return region?.Nombre || 'Seleccionar región/estado';
    }, [regions, formData.selectedRegionId]);

    const selectedCityName = useMemo(() => {
      const city = cities.find((c: any) => c.Id === formData.selectedCityId);
      return city?.Nombre || 'Seleccionar ciudad';
    }, [cities, formData.selectedCityId]);

    const selectedEPSName = useMemo(() => {
      const eps = epsOptions.find((e: any) => e.Id === formData.selectedEpsId);
      return eps?.Nombre || 'Seleccionar EPS';
    }, [epsOptions, formData.selectedEpsId]);

    const selectedDocumentTypeName = useMemo(() => {
      const docType = documentTypes.find(
        (dt: any) => dt.Id === formData.selectedDocumentTypeId
      );
      return docType?.Nombre || 'Seleccionar tipo de documento';
    }, [documentTypes, formData.selectedDocumentTypeId]);

    // Validaciones
    const isFormValid = useMemo(() => {
      return (
        formData.selectedCountryId.length > 0 &&
        formData.selectedRegionId.length > 0 &&
        formData.selectedCityId.length > 0 &&
        formData.selectedDocumentTypeId.length > 0 &&
        formData.documentNumber.trim().length >= 8 &&
        formData.selectedEpsId.length > 0
      );
    }, [
      formData.selectedCountryId,
      formData.selectedRegionId,
      formData.selectedCityId,
      formData.selectedDocumentTypeId,
      formData.documentNumber,
      formData.selectedEpsId,
    ]);

    // Filtros para cascadas
    const filteredRegions = useMemo(() => {
      if (!formData.selectedCountryId) return [];
      return regions.filter(
        (region: any) => region.PaisId === formData.selectedCountryId
      );
    }, [regions, formData.selectedCountryId]);

    const filteredCities = useMemo(() => {
      if (!formData.selectedRegionId) return [];
      return cities.filter(
        (city: any) => city.RegionId === formData.selectedRegionId
      );
    }, [cities, formData.selectedRegionId]);

    const filteredDocumentTypes = useMemo(() => {
      if (!formData.selectedCountryId) return [];
      return documentTypes.filter(
        (docType: any) => docType.PaisId === formData.selectedCountryId
      );
    }, [documentTypes, formData.selectedCountryId]);

    // Manejadores de cambio
    const handleCountrySelect = useCallback(
      async (countryId: string) => {
        formData.setSelectedCountryId(countryId);
        formData.setSelectedRegionId(''); // Reset región cuando cambia país
        formData.setSelectedCityId(''); // Reset ciudad cuando cambia país
        formData.setSelectedDocumentTypeId(''); // Reset tipo documento cuando cambia país
        setShowCountryModal(false);

        // Cargar regiones y tipos de documento para el país seleccionado
        await Promise.all([
          loadRegionsByCountry(countryId),
          loadDocumentTypesByCountry(countryId),
        ]);
      },
      [formData, loadRegionsByCountry, loadDocumentTypesByCountry]
    );

    const handleRegionSelect = useCallback(
      async (regionId: string) => {
        formData.setSelectedRegionId(regionId);
        formData.setSelectedCityId(''); // Reset ciudad cuando cambia región

        // Cargar ciudades para la región seleccionada
        await loadCitiesByRegion(regionId);
      },
      [formData, loadCitiesByRegion]
    );

    const handleCitySelect = useCallback(
      (cityId: string) => {
        formData.setSelectedCityId(cityId);
        formData.setShowCityModal(false);
      },
      [formData]
    );

    const handleEPSSelect = useCallback(
      (epsId: string) => {
        formData.setSelectedEpsId(epsId);
        formData.setShowEpsModal(false);
      },
      [formData]
    );

    const handleDocumentTypeSelect = useCallback(
      (documentTypeId: string) => {
        formData.setSelectedDocumentTypeId(documentTypeId);
        formData.setShowDocumentTypeModal(false);
      },
      [formData]
    );

    const handleDocumentNumberChange = useCallback(
      (text: string) => {
        const numericOnly = text.replace(/[^0-9]/g, '');
        formData.setDocumentNumber(numericOnly);
      },
      [formData]
    );

    const handleNext = useCallback(async () => {
      if (!isFormValid) {
        showError('Complete todos los campos requeridos');
        return;
      }

      setIsLoading(true);

      const stepData: Step3Data = {
        countryId: formData.selectedCountryId,
        regionId: formData.selectedRegionId,
        cityId: formData.selectedCityId,
        documentTypeId: formData.selectedDocumentTypeId,
        documentNumber: formData.documentNumber.trim(),
        epsId: formData.selectedEpsId,
        ...(formData.emergencyContact && {
          emergencyContact: formData.emergencyContact.trim(),
        }),
        ...(formData.emergencyPhone && {
          emergencyPhone: formData.emergencyPhone.trim(),
        }),
        ...(formData.address && { address: formData.address.trim() }),
      };

      try {
        // Aquí iría la llamada API para guardar los datos
        // Por simplicidad, solo pasamos al siguiente paso
        onNext(stepData);
      } catch (error: any) {
        handleApiError(error);
        showError('No se pudieron guardar los datos. Intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }, [isFormValid, formData, onNext, showError]);

    // Componente de selector modal
    const SelectorModal = memo<{
      visible: boolean;
      title: string;
      data: { Id: string; Nombre: string }[];
      onSelect: (id: string) => void;
      onClose: () => void;
      loading?: boolean;
    }>(({ visible, title, data, onSelect, onClose, loading = false }) => (
      <Modal
        visible={visible}
        transparent={true}
        animationType='slide'
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
            }}
            onStartShouldSetResponder={() => true}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Colors[colorScheme].text,
                marginBottom: 20,
                textAlign: 'center',
              }}
            >
              {title}
            </Text>

            {loading ? (
              <View style={{ alignItems: 'center', padding: 20 }}>
                <LoadingSpinner size='large' />
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {data.map(item => (
                  <TouchableOpacity
                    key={item.Id}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: `${Colors[colorScheme].text}20`,
                    }}
                    onPress={() => onSelect(item.Id)}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors[colorScheme].text,
                      }}
                    >
                      {item.Nombre}
                    </Text>
                  </TouchableOpacity>
                ))}
                {data.length === 0 && !loading && (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors[colorScheme].text,
                      opacity: 0.7,
                      padding: 20,
                    }}
                  >
                    No hay opciones disponibles
                  </Text>
                )}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    ));

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            commonStyles.container,
            { paddingBottom: 20 },
          ]}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View style={commonStyles.header}>
            <Text
              style={[commonStyles.title, { color: Colors[colorScheme].text }]}
            >
              Información adicional
            </Text>
            <Text
              style={[
                commonStyles.subtitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Completa tu información de ubicación y salud
            </Text>
          </View>

          <View style={commonStyles.form}>
            {/* País */}
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                País *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => setShowCountryModal(true)}
                disabled={catalogsLoading}
                accessibilityLabel='Seleccionar país'
                accessibilityHint='Presiona para abrir la lista de países'
              >
                {catalogsLoading ? (
                  <LoadingSpinner size='small' />
                ) : (
                  <Text
                    style={{
                      color: formData.selectedCountryId
                        ? Colors[colorScheme].text
                        : `${Colors[colorScheme].text}60`,
                      fontSize: 16,
                    }}
                  >
                    {selectedCountryName}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Región/Estado */}
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Región/Estado *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                    opacity: formData.selectedCountryId ? 1 : 0.5,
                  },
                ]}
                onPress={() => formData.setShowRegionModal(true)}
                disabled={!formData.selectedCountryId || catalogsLoading}
                accessibilityLabel='Seleccionar región o estado'
                accessibilityHint='Presiona para abrir la lista de regiones'
              >
                <Text
                  style={{
                    color: formData.selectedRegionId
                      ? Colors[colorScheme].text
                      : `${Colors[colorScheme].text}60`,
                    fontSize: 16,
                  }}
                >
                  {selectedRegionName}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Ciudad */}
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Ciudad *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                    opacity: formData.selectedRegionId ? 1 : 0.5,
                  },
                ]}
                onPress={() => formData.setShowCityModal(true)}
                disabled={!formData.selectedRegionId || catalogsLoading}
                accessibilityLabel='Seleccionar ciudad'
                accessibilityHint='Presiona para abrir la lista de ciudades'
              >
                <Text
                  style={{
                    color: formData.selectedCityId
                      ? Colors[colorScheme].text
                      : `${Colors[colorScheme].text}60`,
                    fontSize: 16,
                  }}
                >
                  {selectedCityName}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tipo de documento */}
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                Tipo de documento *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                    opacity: formData.selectedCountryId ? 1 : 0.5,
                  },
                ]}
                onPress={() => formData.setShowDocumentTypeModal(true)}
                disabled={!formData.selectedCountryId || catalogsLoading}
                accessibilityLabel='Seleccionar tipo de documento'
                accessibilityHint='Presiona para abrir la lista de tipos de documento'
              >
                <Text
                  style={{
                    color: formData.selectedDocumentTypeId
                      ? Colors[colorScheme].text
                      : `${Colors[colorScheme].text}60`,
                    fontSize: 16,
                  }}
                >
                  {selectedDocumentTypeName}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Número de documento */}
            <FormInput
              label='Número de documento'
              value={formData.documentNumber}
              onChangeText={handleDocumentNumberChange}
              placeholder='123456789'
              keyboardType='numeric'
              required
              error={
                formData.documentNumber.trim().length > 0 &&
                formData.documentNumber.trim().length < 8
                  ? `El número de documento debe tener al menos 8 dígitos`
                  : ''
              }
              accessibilityLabel='Campo de número de documento'
              accessibilityHint='Ingresa tu número de documento de identidad'
            />

            {/* EPS */}
            <View style={commonStyles.inputContainer}>
              <Text
                style={[
                  commonStyles.label,
                  { color: Colors[colorScheme].text },
                ]}
              >
                EPS *
              </Text>
              <TouchableOpacity
                style={[
                  commonStyles.input,
                  {
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: '#666',
                    justifyContent: 'center',
                  },
                ]}
                onPress={() => formData.setShowEpsModal(true)}
                disabled={catalogsLoading}
                accessibilityLabel='Seleccionar EPS'
                accessibilityHint='Presiona para abrir la lista de EPS'
              >
                {catalogsLoading ? (
                  <LoadingSpinner size='small' />
                ) : (
                  <Text
                    style={{
                      color: formData.selectedEpsId
                        ? Colors[colorScheme].text
                        : `${Colors[colorScheme].text}60`,
                      fontSize: 16,
                    }}
                  >
                    {selectedEPSName}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Información adicional */}
            <Text
              style={[
                commonStyles.subtitle,
                {
                  color: Colors[colorScheme].text,
                  marginTop: 20,
                  marginBottom: 10,
                  fontWeight: '600',
                },
              ]}
            >
              Información adicional
            </Text>

            <FormInput
              label='Contacto de emergencia'
              value={formData.emergencyContact}
              onChangeText={formData.setEmergencyContact}
              placeholder='Nombre del contacto'
              accessibilityLabel='Campo de contacto de emergencia'
              accessibilityHint='Ingresa el nombre de tu contacto de emergencia'
            />

            <FormInput
              label='Teléfono de emergencia'
              value={formData.emergencyPhone}
              onChangeText={formData.setEmergencyPhone}
              placeholder='3001234567'
              keyboardType='phone-pad'
              accessibilityLabel='Campo de teléfono de emergencia'
              accessibilityHint='Ingresa el teléfono de tu contacto de emergencia'
            />

            <FormInput
              label='Dirección'
              value={formData.address}
              onChangeText={formData.setAddress}
              placeholder='Calle 123 #45-67'
              multiline
              numberOfLines={2}
              accessibilityLabel='Campo de dirección'
              accessibilityHint='Ingresa tu dirección de residencia'
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              {onBack && (
                <Button
                  title='Atrás'
                  onPress={onBack}
                  variant='outline'
                  size='large'
                  style={{ flex: 1 }}
                />
              )}

              <Button
                title={isLoading ? 'Guardando...' : 'Continuar'}
                onPress={handleNext}
                disabled={!isFormValid || isLoading}
                loading={isLoading}
                variant='primary'
                size='large'
                style={{ flex: onBack ? 1 : undefined }}
                accessibilityLabel='Botón para continuar al siguiente paso'
                accessibilityHint='Presiona para guardar los datos y continuar'
              />
            </View>
          </View>

          {/* Modales de selección */}
          <SelectorModal
            visible={showCountryModal}
            title='Selecciona tu país'
            data={countries}
            onSelect={handleCountrySelect}
            onClose={() => setShowCountryModal(false)}
            loading={catalogsLoading}
          />

          <SelectorModal
            visible={formData.showRegionModal}
            title='Selecciona tu región/estado'
            data={filteredRegions}
            onSelect={handleRegionSelect}
            onClose={() => formData.setShowRegionModal(false)}
          />

          <SelectorModal
            visible={formData.showCityModal}
            title='Selecciona tu ciudad'
            data={filteredCities}
            onSelect={handleCitySelect}
            onClose={() => formData.setShowCityModal(false)}
          />

          <SelectorModal
            visible={formData.showDocumentTypeModal}
            title='Selecciona el tipo de documento'
            data={filteredDocumentTypes}
            onSelect={handleDocumentTypeSelect}
            onClose={() => formData.setShowDocumentTypeModal(false)}
          />

          <SelectorModal
            visible={formData.showEpsModal}
            title='Selecciona tu EPS'
            data={epsOptions}
            onSelect={handleEPSSelect}
            onClose={() => formData.setShowEpsModal(false)}
            loading={catalogsLoading}
          />

          {/* Componente de alertas personalizado */}
          <AlertComponent />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
);

Step3.displayName = 'Step3';

export default Step3;
