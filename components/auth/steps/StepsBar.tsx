import React from 'react';
import { View } from 'react-native';
import { Text } from '../../Themed';
import { useColorScheme } from '../../useColorScheme';
import Colors from '@/constants/Colors';
import { commonStyles } from '../styles/common';

interface StepsBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export default function StepsBar({
  currentStep,
  totalSteps,
  stepTitles,
}: StepsBarProps) {
  const colorScheme = useColorScheme();

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
                  {
                    backgroundColor: isActive
                      ? Colors[colorScheme].tint
                      : '#333',
                    borderColor: isActive ? Colors[colorScheme].tint : '#666',
                  },
                ]}
              >
                <Text
                  style={[
                    commonStyles.stepNumber,
                    { color: isActive ? '#fff' : '#999' },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>

              {index < totalSteps - 1 && (
                <View
                  style={[
                    commonStyles.stepLine,
                    {
                      backgroundColor:
                        index < currentStep ? Colors[colorScheme].tint : '#333',
                    },
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
