import React, { memo } from 'react';
import { TextInput } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { commonStyles } from './styles/common';

interface AdditionalInfoInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const AdditionalInfoInput = memo<AdditionalInfoInputProps>(
  ({ value, onChangeText }) => {
    const colorScheme = useColorScheme();

    return (
      <View style={commonStyles.inputContainer}>
        <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
          Información adicional
        </Text>
        <TextInput
          style={[
            commonStyles.input,
            {
              minHeight: 100,
              textAlignVertical: 'top',
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              borderColor: '#666',
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder='Cuéntanos cualquier cosa que consideres importante...'
          placeholderTextColor={`${Colors[colorScheme].text}60`}
          multiline
          numberOfLines={4}
          accessibilityLabel='Campo de información adicional'
          accessibilityHint='Puedes agregar cualquier información relevante aquí'
        />
      </View>
    );
  }
);

AdditionalInfoInput.displayName = 'AdditionalInfoInput';
