import { useState, useCallback } from 'react';
import { Region, City, EPS, DocumentType } from '@/dto/common';
import type { Step3Data } from '../types';

interface UseStep3FormResult {
  // Form data
  country: string;
  selectedCountryId: string;
  region: string;
  selectedRegionId: string;
  city: string;
  selectedCityId: string;
  documentType: string;
  selectedDocumentTypeId: string;
  documentNumber: string;
  eps: string;
  selectedEpsId: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;

  // Modal states
  showRegionModal: boolean;
  showCityModal: boolean;
  showDocumentTypeModal: boolean;
  showEpsModal: boolean;

  // Filter states
  regionFilter: string;
  cityFilter: string;
  documentTypeFilter: string;
  epsFilter: string;

  // Actions
  setCountry: (value: string) => void;
  setSelectedCountryId: (value: string) => void;
  setRegion: (value: string) => void;
  setSelectedRegionId: (value: string) => void;
  setCity: (value: string) => void;
  setSelectedCityId: (value: string) => void;
  setDocumentType: (value: string) => void;
  setSelectedDocumentTypeId: (value: string) => void;
  setDocumentNumber: (value: string) => void;
  setEps: (value: string) => void;
  setSelectedEpsId: (value: string) => void;
  setEmergencyContact: (value: string) => void;
  setEmergencyPhone: (value: string) => void;
  setAddress: (value: string) => void;

  // Modal actions
  setShowRegionModal: (value: boolean) => void;
  setShowCityModal: (value: boolean) => void;
  setShowDocumentTypeModal: (value: boolean) => void;
  setShowEpsModal: (value: boolean) => void;

  // Filter actions
  setRegionFilter: (value: string) => void;
  setCityFilter: (value: string) => void;
  setDocumentTypeFilter: (value: string) => void;
  setEpsFilter: (value: string) => void;

  // Handlers
  handleDocumentNumberChange: (text: string) => void;
  handleEmergencyPhoneChange: (text: string) => void;

  // Filter functions
  getFilteredRegions: (regions: Region[]) => Region[];
  getFilteredCities: (cities: City[]) => City[];
  getFilteredEps: (epsOptions: EPS[]) => EPS[];
  getFilteredDocumentTypes: (documentTypes: DocumentType[]) => DocumentType[];

  // Clear functions
  clearRegionData: () => void;
  clearCityData: () => void;
}

export const useStep3Form = (
  initialData?: Partial<Step3Data>
): UseStep3FormResult => {
  // Form states
  const [country, setCountry] = useState(initialData?.country || '');
  const [selectedCountryId, setSelectedCountryId] = useState(
    initialData?.countryId || ''
  );
  const [region, setRegion] = useState(initialData?.region || '');
  const [selectedRegionId, setSelectedRegionId] = useState(
    initialData?.regionId || ''
  );
  const [city, setCity] = useState(initialData?.city || '');
  const [selectedCityId, setSelectedCityId] = useState(
    initialData?.cityId || ''
  );
  const [documentType, setDocumentType] = useState(
    initialData?.documentType || ''
  );
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(
    initialData?.documentTypeId || ''
  );
  const [documentNumber, setDocumentNumber] = useState(
    initialData?.documentNumber || ''
  );
  const [eps, setEps] = useState(initialData?.eps || '');
  const [selectedEpsId, setSelectedEpsId] = useState(initialData?.epsId || '');
  const [emergencyContact, setEmergencyContact] = useState(
    initialData?.emergencyContact || ''
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    initialData?.emergencyPhone || ''
  );
  const [address, setAddress] = useState(initialData?.address || '');

  // Modal states
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showDocumentTypeModal, setShowDocumentTypeModal] = useState(false);
  const [showEpsModal, setShowEpsModal] = useState(false);

  // Filter states
  const [regionFilter, setRegionFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('');
  const [epsFilter, setEpsFilter] = useState('');

  const handleDocumentNumberChange = useCallback((text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '').slice(0, 20);
    setDocumentNumber(numericOnly);
  }, []);

  const handleEmergencyPhoneChange = useCallback((text: string) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setEmergencyPhone(numericOnly);
  }, []);

  const getFilteredRegions = useCallback(
    (regions: Region[]) =>
      regions.filter((region: Region) =>
        region.Nombre.toLowerCase().includes(regionFilter.toLowerCase())
      ),
    [regionFilter]
  );

  const getFilteredCities = useCallback(
    (cities: City[]) =>
      cities.filter((city: City) =>
        city.Nombre.toLowerCase().includes(cityFilter.toLowerCase())
      ),
    [cityFilter]
  );

  const getFilteredEps = useCallback(
    (epsOptions: EPS[]) =>
      epsOptions.filter((eps: EPS) =>
        eps.Nombre.toLowerCase().includes(epsFilter.toLowerCase())
      ),
    [epsFilter]
  );

  const getFilteredDocumentTypes = useCallback(
    (documentTypes: DocumentType[]) =>
      documentTypes.filter((docType: DocumentType) =>
        docType.Nombre.toLowerCase().includes(documentTypeFilter.toLowerCase())
      ),
    [documentTypeFilter]
  );

  const clearCityData = useCallback(() => {
    setCity('');
    setSelectedCityId('');
  }, []);

  const clearRegionData = useCallback(() => {
    setRegion('');
    setSelectedRegionId('');
    clearCityData();
  }, [clearCityData]);

  return {
    // Form data
    country,
    selectedCountryId,
    region,
    selectedRegionId,
    city,
    selectedCityId,
    documentType,
    selectedDocumentTypeId,
    documentNumber,
    eps,
    selectedEpsId,
    emergencyContact,
    emergencyPhone,
    address,

    // Modal states
    showRegionModal,
    showCityModal,
    showDocumentTypeModal,
    showEpsModal,

    // Filter states
    regionFilter,
    cityFilter,
    documentTypeFilter,
    epsFilter,

    // Actions
    setCountry,
    setSelectedCountryId,
    setRegion,
    setSelectedRegionId,
    setCity,
    setSelectedCityId,
    setDocumentType,
    setSelectedDocumentTypeId,
    setDocumentNumber,
    setEps,
    setSelectedEpsId,
    setEmergencyContact,
    setEmergencyPhone,
    setAddress,

    // Modal actions
    setShowRegionModal,
    setShowCityModal,
    setShowDocumentTypeModal,
    setShowEpsModal,

    // Filter actions
    setRegionFilter,
    setCityFilter,
    setDocumentTypeFilter,
    setEpsFilter,

    // Handlers
    handleDocumentNumberChange,
    handleEmergencyPhoneChange,

    // Filter functions
    getFilteredRegions,
    getFilteredCities,
    getFilteredEps,
    getFilteredDocumentTypes,

    // Clear functions
    clearRegionData,
    clearCityData,
  };
};
