import React from 'react';
import { View } from 'react-native';
import { Text } from '../../Themed';
import { commonStyles } from '../styles/common';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeStepsBarStyles } from '../styles/stepsBar';

interface StepsBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[]; // opcional, no usado en la UI actual
}

export default function StepsBar({ currentStep, totalSteps }: StepsBarProps) {
  const styles = useThemedStyles(makeStepsBarStyles);

  return (
    <View style={commonStyles.stepsContainer}>
      <View style={commonStyles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const isActive = index <= currentStep;

          return (
            <View key={index} style={commonStyles.stepContainer}>
              <View
                style={[
                  commonStyles.stepCircle,
                  isActive
                    ? styles.stepCircleActive
                    : styles.stepCircleInactive,
                ]}
              >
                <Text
                  style={[
                    commonStyles.stepNumber,
                    isActive
                      ? styles.stepNumberActive
                      : styles.stepNumberInactive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>

              {index < totalSteps - 1 && (
                <View
                  style={[
                    commonStyles.stepLine,
                    index < currentStep
                      ? styles.stepLineActive
                      : styles.stepLineInactive,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
