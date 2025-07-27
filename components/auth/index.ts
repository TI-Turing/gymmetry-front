// Componentes principales
export { default as AuthContainer } from './AuthContainer';
export { default as LoginForm } from './LoginForm';
export { default as RegisterForm } from './RegisterForm';

// Steps del registro
export { default as Step1 } from './Step1';
export { default as Step2 } from './Step2';
export { default as Step3 } from './Step3';
export { default as Step4 } from './Step4';
export { default as StepsBar } from './StepsBar';

// Componentes auxiliares
export { default as Dropdown } from './Dropdown';
export { default as CountryCodePicker } from './CountryCodePicker';
export { CustomAlert, useCustomAlert } from './CustomAlert';

// Types
export * from './types';

// Hooks
export * from './hooks/useValidation';

// Utils
export * from './utils/validation';
export * from './utils/api';
export * from './utils/format';

// Data
export { COUNTRIES } from './data/countries';
export * from './data/colombia';

// Styles
export { commonStyles } from './styles/common';
