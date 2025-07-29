export interface CatalogItem {
  Id: string;
  Nombre: string;
  PaisId?: string;
  RegionId?: string;
}

export interface Country extends CatalogItem {}

export interface Region extends CatalogItem {
  PaisId: string;
}

export interface City extends CatalogItem {
  RegionId: string;
}

export interface DocumentType extends CatalogItem {
  PaisId: string;
}

export interface EPS extends CatalogItem {}

export interface Gender extends CatalogItem {}

export interface CatalogSelectorProps {
  value?: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface CountrySelectorProps extends CatalogSelectorProps {
  countries: Country[];
}

export interface RegionSelectorProps extends CatalogSelectorProps {
  regions: Region[];
  countryId?: string;
}

export interface CitySelectorProps extends CatalogSelectorProps {
  cities: City[];
  regionId?: string;
}

export interface DocumentTypeSelectorProps extends CatalogSelectorProps {
  documentTypes: DocumentType[];
  countryId?: string;
}

export interface EPSSelectorProps extends CatalogSelectorProps {
  epsOptions: EPS[];
}

export interface GenderSelectorProps extends CatalogSelectorProps {
  genders: Gender[];
}
