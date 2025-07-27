import { useState, useMemo } from 'react';
import { PasswordValidation } from '../types';
import {
  getPasswordValidation,
  isValidEmail,
  isPasswordValid,
} from '../utils/validation';

export const usePasswordValidation = (email: string) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validation = useMemo(
    () => getPasswordValidation(password, email),
    [password, email]
  );

  const isValid = useMemo(() => isPasswordValid(validation), [validation]);

  return {
    password,
    setPassword,
    showPassword,
    setShowPassword,
    validation,
    isValid,
  };
};

export const useFormValidation = () => {
  const [email, setEmail] = useState('');

  const isEmailValid = useMemo(() => isValidEmail(email), [email]);

  return {
    email,
    setEmail,
    isEmailValid,
  };
};
