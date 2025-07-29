// Respuesta estándar de la API del backend C# (para uso en el módulo gym)
export interface BackendApiResponse<T> {
  Success: boolean;
  Message: string;
  Data: T | null;
  StatusCode: number;
}

// Tipos para el registro de gimnasio por pasos
export interface GymType {
  Id: string;
  Name: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Gyms: any[];
}

// Información del país (lo que viene en Data de países)
export interface Country {
  Id: string;
  Name: string;
  Code: string;
  // ... otros campos que el backend retorne
}

// Paso 1: Información básica y registro inicial
export interface GymStep1Data {
  name: string;
  email: string;
  phone: string;
  nit: string;
  owner_UserId: string;
}

// Paso 2: Tipo de gimnasio y detalles
export interface GymStep2Data {
  gymTypeId: string;
  slogan: string;
  description: string;
  Id: string;
}

// Paso 3: Ubicación y contacto
export interface GymStep3Data {
  address: string;
  countryId: string;
  regionId: string;
  cityId: string;
  Id: string;
}

// Paso 4: Presencia digital
export interface GymStep4Data {
  website: string;
  instagram: string;
  facebook: string;
  Id: string;
}

// Paso 5: Multimedia (imágenes y videos)
export interface GymStep5Data {
  logo: string | null;
  coverImage: string | null;
  galleryImages: string[];
  videos: string[];
  Id: string;
}

// Datos completos del registro
export interface GymCompleteData
  extends GymStep1Data,
    GymStep2Data,
    GymStep3Data,
    GymStep4Data,
    GymStep5Data {
  Id: string; // Se obtiene después del primer paso
}

// Props para los componentes de pasos
export interface GymStepProps<T> {
  onNext: (data: T) => void;
  onBack?: () => void;
  initialData?: Partial<T>;
  isLoading?: boolean;
}

// Respuestas tipadas de la API usando la estructura estándar del backend C#
export type GymRegistrationResponse = BackendApiResponse<string>;
export type GymTypesResponse = BackendApiResponse<GymType[]>;
export type CountriesResponse = BackendApiResponse<Country[]>;
export type GymUpdateResponse = BackendApiResponse<any>; // El backend puede definir qué retorna en las actualizaciones

// Props del formulario principal
export interface GymRegistrationStepsProps {
  onComplete: (data: GymCompleteData) => void;
  onCancel: () => void;
}

// Props del formulario simple (legacy)
export interface GymRegistrationFormProps {
  onSubmit: (data: GymRegistrationFormData) => void;
  onCancel: () => void;
}

// Datos del formulario simple (legacy) - para compatibilidad
export interface GymRegistrationFormData {
  name: string;
  nit: string;
  email: string;
  phone: string;
  country: string;
  countryId: string;
  gymPlanSelectedId: string;
  gymTypeId: string;
  instagram: string;
  facebook: string;
  website: string;
  slogan: string;
}
