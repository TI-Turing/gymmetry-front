import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isInRegisterFlow: boolean;
  setIsInRegisterFlow: (value: boolean) => void;
  onSkip?: () => void;
  setOnSkip: (callback: (() => void) | undefined) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentStep: 0,
  setCurrentStep: () => {},
  isInRegisterFlow: false,
  setIsInRegisterFlow: () => {},
  onSkip: () => {},
  setOnSkip: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isInRegisterFlow, setIsInRegisterFlow] = useState(false);
  const [onSkip, setOnSkip] = useState<(() => void) | undefined>(undefined);

  const contextValue: AuthContextType = {
    currentStep,
    setCurrentStep,
    isInRegisterFlow,
    setIsInRegisterFlow,
    onSkip,
    setOnSkip,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
