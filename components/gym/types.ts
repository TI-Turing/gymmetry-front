import type { GymCompleteData as TGymCompleteData } from '@/dto/gym/GymCompleteData';

// Re-export de tipos de dominio (DTOs)
export type { BackendApiResponse } from '@/dto/gym/BackendApiResponse';
export type { Gym } from '@/dto/gym/Gym';
export type { GymType } from '@/dto/gym/GymType';
export type { GymStep1Data } from '@/dto/gym/GymStep1Data';
export type { GymStep2Data } from '@/dto/gym/GymStep2Data';
export type { GymStep3Data } from '@/dto/gym/GymStep3Data';
export type { GymStep4Data } from '@/dto/gym/GymStep4Data';
export type { GymStep5Data } from '@/dto/gym/GymStep5Data';
export type { GymCompleteData } from '@/dto/gym/GymCompleteData';
export type {
  GymRegistrationResponse,
  GymUpdateResponse,
  GymGetResponse,
} from '@/dto/gym/responses';

// Tipos UI (props) que pertenecen a la capa de presentación
export interface GymStepProps<T> {
  onNext: (data: T) => void;
  onBack?: () => void;
  initialData?: Partial<T>;
  isLoading?: boolean;
}

export interface GymRegistrationStepsProps {
  onComplete: (data: TGymCompleteData) => void;
  onCancel: () => void;
}

export interface GymRegistrationFormProps {
  onSubmit: (data: GymRegistrationFormData) => void;
  onCancel: () => void;
}

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
