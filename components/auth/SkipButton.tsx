import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../Themed';
import { commonStyles } from './styles/common';

interface SkipButtonProps {
  currentStep: number;
  onSkip: () => void;
}

export const SkipButton = memo<SkipButtonProps>(({ currentStep, onSkip }) => {
  if (currentStep === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={commonStyles.skipButtonRegister}
      onPress={onSkip}
      accessibilityLabel='Omitir paso actual'
      accessibilityRole='button'
    >
      <Text style={[commonStyles.headerButtonText, { color: 'white' }]}>
        Omitir
      </Text>
    </TouchableOpacity>
  );
});

SkipButton.displayName = 'SkipButton';
