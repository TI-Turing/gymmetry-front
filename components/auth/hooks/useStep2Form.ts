import React, { useState, useCallback, useEffect } from 'react';
import {
  Step2Data,
  Country,
  PhoneVerificationData,
  OTPValidationData,
} from '../types';
import { DEFAULT_COUNTRY } from '../CountryCodePicker';
import { useGenders } from './useLazyCatalogs';
import { userAPI } from '@/services/apiExamples';
import { handleApiError } from '../utils/api';
import {
  formatDateToDisplay,
  formatDateForBackend,
  parseDisplayDate,
} from '../utils/format';
import { useCustomAlert } from '../CustomAlert';

interface UseStep2FormProps {
  userId: string;
  onNext: (data: Step2Data) => void;
  initialData?: Step2Data;
}

interface UseStep2FormReturn {
  // Estado básico
  firstName: string;
  lastName: string;
  selectedCountry: Country;
  phone: string;
  selectedGender: string;
  birthDate: string;
  isLoading: boolean;

  // Estado de género
  genders: any[];
  gendersLoading: boolean;
  gendersError: any;
  showGenderModal: boolean;

  // Estado de fecha
  showDatePicker: boolean;

  // Estado de verificación de teléfono
  phoneVerified: boolean;
  showVerificationModal: boolean;
  verificationMethod: 'whatsapp' | 'sms' | null;
  verificationId: string;
  otpCode: string;
  isVerificationLoading: boolean;
  verificationStep: 'checking' | 'method' | 'code' | 'error';
  phoneExists: boolean | null;

  // Sistema de alertas
  AlertComponent: React.ComponentType;

  // Handlers
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setSelectedCountry: (country: Country) => void;
  handlePhoneChange: (text: string) => void;
  setSelectedGender: (value: string) => void;
  setBirthDate: (value: string) => void;
  setShowGenderModal: (show: boolean) => void;
  setShowDatePicker: (show: boolean) => void;
  setOtpCode: (code: string) => void;
  handleDateChange: (event: any, selectedDate?: Date) => void;
  handleVerifyPhone: () => void;
  handleSendVerification: (method: 'whatsapp' | 'sms') => Promise<void>;
  handleValidateOTP: () => Promise<void>;
  closeVerificationModal: () => void;
  handleChangeVerificationMethod: () => void;
  handleRetryPhoneCheck: () => void;
  handleNext: () => Promise<void>;
}

export const useStep2Form = ({
  userId,
  onNext,
  initialData,
}: UseStep2FormProps): UseStep2FormReturn => {
  const {
    genders,
    loading: gendersLoading,
    error: gendersError,
  } = useGenders(true);
  const { showAlert, AlertComponent } = useCustomAlert();

  // Estado básico
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    DEFAULT_COUNTRY || {
      code: 'CO',
      name: 'Colombia',
      dialCode: '+57',
      flag: '🇨🇴',
    }
  );
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || '');
  const [isLoading, setIsLoading] = useState(false);

  // Estado de UI
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Estado de verificación de teléfono
  const [phoneVerified, setPhoneVerified] = useState(
    initialData?.phoneVerified || false
  );
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<
    'whatsapp' | 'sms' | null
  >(null);
  const [verificationId, setVerificationId] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<
    'checking' | 'method' | 'code' | 'error'
  >('method');
  const [phoneExists, setPhoneExists] = useState<boolean | null>(null);

  // Verificar si el teléfono existe cuando cambia
  const checkPhoneExists = useCallback(
    async (phoneNumber: string, countryDialCode: string) => {
      if (!phoneNumber.trim() || phoneNumber.length < 7) {
        setPhoneExists(null);
        return;
      }

      try {
        const fullPhone = `${countryDialCode}${phoneNumber.trim()}`;
        const response = await userAPI.checkPhoneExists(fullPhone);

        if (response.Success) {
          setPhoneExists(response.Data);
        }
      } catch (error) {
        setPhoneExists(null);
      }
    },
    []
  );

  const handlePhoneChange = useCallback(
    (text: string) => {
      const numericOnly = text.replace(/[^0-9]/g, '');
      setPhone(numericOnly);

      // Reset verification status when phone changes
      if (phoneVerified) {
        setPhoneVerified(false);
      }

      // Reset phone exists status when phone changes
      if (phoneExists !== null) {
        setPhoneExists(null);
      }
    },
    [phoneVerified, phoneExists]
  );

  const handleCountryChange = useCallback(
    (country: Country) => {
      setSelectedCountry(country);

      // Reset phone verification status when country changes
      if (phoneVerified) {
        setPhoneVerified(false);
      }

      // Reset phone exists status when country changes
      if (phoneExists !== null) {
        setPhoneExists(null);
      }
    },
    [phoneVerified, phoneExists]
  );

  const handleVerifyPhone = useCallback(async () => {
    if (!phone.trim()) {
      showAlert(
        'error',
        'Error',
        'Por favor ingresa un número de teléfono primero'
      );
      return;
    }

    if (phone.length < 7) {
      showAlert(
        'error',
        'Error',
        'El número de teléfono debe tener al menos 7 dígitos'
      );
      return;
    }

    // Abrir modal inmediatamente y mostrar loading
    setShowVerificationModal(true);
    setVerificationStep('checking'); // Estado para mostrar loading
    setIsVerificationLoading(true);
    setVerificationMethod(null);
    setOtpCode('');

    // Verificar si el teléfono existe usando la función checkPhoneExists
    try {
      const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
      const response = await userAPI.checkPhoneExists(fullPhone);

      if (response.Success && response.Data === true) {
        // El teléfono ya existe, mostrar mensaje de error en el modal
        setPhoneExists(true);
        setVerificationStep('error');
      } else {
        // El teléfono no existe, mostrar opciones de verificación
        setPhoneExists(false);
        setVerificationStep('method');
      }
    } catch (error) {
      setVerificationStep('error');
      setPhoneExists(null);
    } finally {
      setIsVerificationLoading(false);
    }
  }, [phone, selectedCountry.dialCode]);

  const handleSendVerification = useCallback(
    async (method: 'whatsapp' | 'sms') => {
      setIsVerificationLoading(true);
      setVerificationMethod(method);
      try {
        const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
        const data: PhoneVerificationData = {
          UserId: userId,
          VerificationType: 'Phone',
          Recipient: fullPhone,
          Method: method,
        };
        const response = await userAPI.sendPhoneVerification(data);
        if (response.Success || response.Success) {
          setVerificationStep('code');
        } else {
          showAlert(
            'error',
            'Error',
            response.Message ||
              response.Message ||
              'Error al enviar verificación'
          );
        }
      } catch (error: any) {
        const errorMessage = handleApiError(error);
        showAlert('error', 'Error', errorMessage);
      } finally {
        setIsVerificationLoading(false);
      }
    },
    [selectedCountry.dialCode, phone]
  );

  const handleValidateOTP = useCallback(async () => {
    if (!otpCode.trim()) {
      showAlert(
        'error',
        'Error',
        'Por favor ingresa el código de verificación'
      );
      return;
    }

    setIsVerificationLoading(true);

    try {
      const fullPhone = `${selectedCountry.dialCode}${phone.trim()}`;
      const data: OTPValidationData = {
        UserId: userId,
        Otp: otpCode.trim(),
        VerificationType: 'Phone',
        Recipient: fullPhone,
      };

      const response = await userAPI.validateOTP(data);

      if (response.Success && response.Data) {
        setPhoneVerified(true);
        setShowVerificationModal(false);
        setOtpCode('');
        showAlert('success', 'Éxito', '¡Teléfono verificado correctamente!');
      } else {
        showAlert('error', 'Error', response.Message || 'Código incorrecto');
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showAlert('error', 'Error', errorMessage);
    } finally {
      setIsVerificationLoading(false);
    }
  }, [selectedCountry.dialCode, phone, otpCode, verificationId]);

  const closeVerificationModal = useCallback(() => {
    setShowVerificationModal(false);
    setVerificationStep('method');
    setVerificationMethod(null);
    setOtpCode('');
    setVerificationId('');
  }, []);

  const handleChangeVerificationMethod = useCallback(() => {
    setVerificationStep('method');
    setOtpCode('');
  }, []);

  const handleRetryPhoneCheck = useCallback(() => {
    setVerificationStep('method');
    setPhoneExists(false);
  }, []);

  const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(formatDateToDisplay(selectedDate));
    }
  }, []);

  const handleNext = useCallback(async () => {
    setIsLoading(true);

    const stepData: Step2Data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim()
        ? `${selectedCountry.dialCode}${phone.trim()}`
        : undefined,
      birthDate: birthDate ? formatDateForBackend(birthDate.trim()) : undefined,
      genderId: selectedGender || undefined,
      phoneVerified: phoneVerified,
    };

    try {
      const updateData = {
        name: stepData.firstName,
        lastName: stepData.lastName,
        ...(stepData.phone && { phone: stepData.phone }),
        ...(stepData.birthDate && { birthDate: stepData.birthDate }),
        ...(stepData.genderId && { IdGender: stepData.genderId }),
      };

      const response = await userAPI.updateUser(userId, updateData);

      if (!response.Success) {
        throw new Error(response.Message || 'Error al actualizar usuario');
      }

      onNext(stepData);
    } catch (error: any) {
      // Error handling - continuar con el flujo ya que los datos básicos están completos
      onNext(stepData);
    } finally {
      setIsLoading(false);
    }
  }, [
    firstName,
    lastName,
    phone,
    selectedCountry.dialCode,
    birthDate,
    selectedGender,
    phoneVerified,
    userId,
    onNext,
  ]);

  return {
    // Estado básico
    firstName,
    lastName,
    selectedCountry,
    phone,
    selectedGender,
    birthDate,
    isLoading,

    // Estado de género
    genders,
    gendersLoading,
    gendersError,
    showGenderModal,

    // Estado de fecha
    showDatePicker,

    // Estado de verificación de teléfono
    phoneVerified,
    showVerificationModal,
    verificationMethod,
    verificationId,
    otpCode,
    isVerificationLoading,
    verificationStep,
    phoneExists,

    // Sistema de alertas
    AlertComponent,

    // Handlers
    setFirstName,
    setLastName,
    setSelectedCountry: handleCountryChange,
    handlePhoneChange,
    setSelectedGender,
    setBirthDate,
    setShowGenderModal,
    setShowDatePicker,
    setOtpCode,
    handleDateChange,
    handleVerifyPhone,
    handleSendVerification,
    handleValidateOTP,
    closeVerificationModal,
    handleChangeVerificationMethod,
    handleRetryPhoneCheck,
    handleNext,
  };
};
