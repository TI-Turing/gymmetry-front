export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export interface Step1Data {
  email: string;
  password: string;
  userId?: string;
  token?: string;
}

export interface Step2Data {
  firstName: string;
  lastName: string;
  phone?: string;
  birthDate?: string;
}

export interface Step3Data {
  eps?: string;
  country?: string;
  region?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
}

export interface PasswordValidation {
  length: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  notEqualToEmail: boolean;
  validChars: boolean;
  noNumericSequence: boolean;
  noLetterSequence: boolean;
}

export interface Step4Data {
  fitnessGoal?: string;
  healthRestrictions?: string;
  additionalInfo?: string;
}

export interface ApiResponse<T = any> {
  Success: boolean;
  Message?: string;
  Data?: T;
  StatusCode?: number;
}

// Tipos adicionales
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string;
  birthDate?: string;
}

export interface Region {
  code: string;
  name: string;
}

export interface City {
  code: string;
  name: string;
  regionCode: string;
}

export interface DropdownOption {
  label: string;
  value: string;
}
