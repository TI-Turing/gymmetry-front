import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthContext } from '@/components/auth/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function HeaderSkipButton() {
  const { currentStep, isInRegisterFlow, onSkip } = useAuthContext();
  const colorScheme = useColorScheme();

  // Mostrar el botón solo si estamos en registro y no en el primer paso
  const shouldShow = isInRegisterFlow && currentStep > 0;

  console.log('🎯 [HEADER SKIP] Rendering - isInRegisterFlow:', isInRegisterFlow, 'currentStep:', currentStep, 'shouldShow:', shouldShow);

  if (!shouldShow) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('🔘 [HEADER SKIP] Button pressed');
        if (onSkip) {
          onSkip();
        } else {
          console.log('⚠️ [HEADER SKIP] No onSkip function available');
        }
      }}
      style={{
        padding: 8,
        marginRight: -8,
      }}
    >
      <Text
        style={{
          color: Colors[colorScheme].tint,
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        Omitir
      </Text>
    </TouchableOpacity>
  );
}
