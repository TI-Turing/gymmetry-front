import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '../Themed';
import { commonStyles } from './styles/common';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeSkipButtonStyles } from './styles/skipButton';

interface SkipButtonProps {
  currentStep: number;
  onSkip: () => void;
}

export const SkipButton = memo<SkipButtonProps>(({ currentStep, onSkip }) => {
  const styles = useThemedStyles(makeSkipButtonStyles);
  if (currentStep === 0) {
    return null;
  }

  return (
    <TouchableOpacity
      style={commonStyles.skipButtonRegister}
      onPress={onSkip}
      accessibilityLabel="Omitir paso actual"
      accessibilityRole="button"
    >
      <Text
        style={[
          commonStyles.headerButtonText,
          { color: styles.colors.textOnPrimary },
        ]}
      >
        Omitir
      </Text>
    </TouchableOpacity>
  );
});

SkipButton.displayName = 'SkipButton';
