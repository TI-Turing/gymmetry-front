import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalogService';
import { 
  Gender,
  Country,
  Region,
  City,
  EPS,
  DocumentType
} from '@/dto/common';

interface CatalogsState {
  genders: Gender[];
  documentTypes: DocumentType[];
  countries: Country[];
  regions: Region[];
  cities: City[];
  eps: EPS[];
  loading: boolean;
  error: string | null;
}

export const useCatalogs = () => {
  const [state, setState] = useState<CatalogsState>({
    genders: [],
    documentTypes: [],
    countries: [],
    regions: [],
    cities: [],
    eps: [],
    loading: true,
    error: null
  });

  const loadCatalogs = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Cargar géneros, países y EPS primero
      const [
        gendersResponse,
        countriesResponse,
        epsResponse
      ] = await Promise.allSettled([
        catalogService.getGenders(),
        catalogService.getCountries(),
        catalogService.getEPS()
      ]);

      // Cargar tipos de documento para Colombia por defecto
      const colombiaId = catalogService.getColombiaId();
      const documentTypesResponse = await Promise.allSettled([
        catalogService.getDocumentTypes(colombiaId)
      ]);

      setState(prev => ({
        ...prev,
        genders: gendersResponse.status === 'fulfilled' ? gendersResponse.value : [],
        countries: countriesResponse.status === 'fulfilled' ? countriesResponse.value : [],
        eps: epsResponse.status === 'fulfilled' ? epsResponse.value : [],
        documentTypes: documentTypesResponse[0].status === 'fulfilled' ? documentTypesResponse[0].value : [],
        loading: false
      }));

    } catch (error) {
      console.error('Error loading catalogs:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido al cargar catálogos'
      }));
    }
  };

  const loadRegionsByCountry = async (countryId: string) => {
    try {
      const regions = await catalogService.getRegionsByCountry(countryId);
      setState(prev => ({ ...prev, regions }));
      return regions;
    } catch (error) {
      console.error('Error loading regions:', error);
      return [];
    }
  };

  const loadCitiesByRegion = async (regionId: string) => {
    try {
      const cities = await catalogService.getCitiesByRegion(regionId);
      setState(prev => ({ ...prev, cities }));
      return cities;
    } catch (error) {
      console.error('Error loading cities:', error);
      return [];
    }
  };

  const loadDocumentTypesByCountry = async (countryId: string) => {
    try {
      const documentTypes = await catalogService.getDocumentTypes(countryId);
      setState(prev => ({ ...prev, documentTypes }));
      return documentTypes;
    } catch (error) {
      console.error('Error loading document types:', error);
      return [];
    }
  };

  useEffect(() => {
    loadCatalogs();
  }, []);

  return {
    ...state,
    loadCatalogs,
    loadRegionsByCountry,
    loadCitiesByRegion,
    loadDocumentTypesByCountry
  };
};

// Hook específico para géneros (para Step2)
export const useGenders = () => {
  const { genders, loading, error } = useCatalogs();
  return { genders, loading, error };
};
