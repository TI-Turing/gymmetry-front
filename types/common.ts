// Common types used across the application

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface Country extends BaseEntity {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export interface Region extends BaseEntity {
  name: string;
  countryId: string;
}

export interface City extends BaseEntity {
  name: string;
  regionId: string;
}

export interface Gender extends BaseEntity {
  name: string;
  code: string;
}

export interface DocumentType extends BaseEntity {
  name: string;
  code: string;
}

export interface EPS extends BaseEntity {
  name: string;
  code: string;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

// Navigation types
export interface NavigationProps {
  navigation: any; // TODO: Type properly with React Navigation types
  route: any;
}

// Theme types
export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

// Form types
export interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface DropdownProps<T = SelectOption> {
  items: T[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

// Image handling types
export interface ImageAsset {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
  fileName?: string;
}

// User session types
export interface UserSession {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  user?: any; // TODO: Define proper User type
}

// API Error types
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

// Environment configuration types
export interface EnvironmentConfig {
  apiBaseUrl: string;
  catalogsApiBaseUrl: string;
  apiFunctionsKey: string;
  apiMainFunctionsKey: string;
  environment: string;
  debug: boolean;
}

export default {};
