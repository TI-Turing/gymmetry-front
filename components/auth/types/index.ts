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
  genderId?: string;
  phoneVerified?: boolean;
}

export interface PhoneVerificationData {
  phone: string;
  method: 'whatsapp' | 'sms';
}

export interface PhoneVerificationResponse {
  success: boolean;
  message: string;
  verificationId?: string;
}

export interface OTPValidationData {
  phone: string;
  code: string;
  verificationId: string;
}

export interface OTPValidationResponse {
  success: boolean;
  message: string;
  verified: boolean;
}

export interface PhoneExistsResponse {
  Success: boolean;
  Message: string;
  Data: boolean;
  StatusCode: number;
}

export interface Step3Data {
  eps?: string;
  country?: string;
  region?: string;
  city?: string;
  documentNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  // IDs como strings para compatibilidad con el backend
  documentTypeId?: string;
  documentType?: string;
  countryId?: string;
  regionId?: string;
  cityId?: string;
  epsId?: string;
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
  rh?: string;
}

export interface Step5Data {
  username?: string;
  profileImage?: string;
}

export interface ApiResponse<T = any> {
  Success: boolean;
  Message?: string;
  Data?: T;
  StatusCode?: number;
}

// Interfaces para validación de nombre de usuario
export interface UsernameCheckRequest {
  UserName: string;
}

export interface UsernameCheckResponse {
  Success: boolean;
  Message: string;
  Data: any[];
  StatusCode: number;
}

// Interfaces para upload de imagen de perfil
export interface UploadProfileImageResponse {
  Success: boolean;
  Message: string;
  Data: string; // URL de la imagen subida
  ErrorCode: string | null;
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
