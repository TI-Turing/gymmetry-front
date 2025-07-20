import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';

interface StepsBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export default function StepsBar({ currentStep, totalSteps, stepTitles }: StepsBarProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor: index < currentStep 
                    ? Colors[colorScheme].tint 
                    : index === currentStep 
                    ? Colors[colorScheme].tint 
                    : '#333',
                  borderColor: index <= currentStep 
                    ? Colors[colorScheme].tint 
                    : '#666',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  {
                    color: index <= currentStep ? '#fff' : '#999',
                  },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor: index < currentStep 
                      ? Colors[colorScheme].tint 
                      : '#333',
                  },
                ]}
              />
            )}
          </View>
        ))}
      </View>
      
      <Text
        style={[
          styles.stepTitle,
          { color: Colors[colorScheme].text },
        ]}
      >
        {stepTitles[currentStep]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 5,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
