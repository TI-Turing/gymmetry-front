import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...textInputProps
}) => {
  const colorScheme = useColorScheme();
  const hasError = Boolean(error);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: Colors[colorScheme].text },
            labelStyle,
          ]}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: Colors[colorScheme].background,
            color: Colors[colorScheme].text,
            borderColor: hasError
              ? Colors[colorScheme].tint + '80'
              : Colors[colorScheme].text + '40',
          },
          hasError && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={`${Colors[colorScheme].text}60`}
        {...textInputProps}
      />

      {error && (
        <Text
          style={[
            styles.errorText,
            { color: Colors[colorScheme].tint },
            errorStyle,
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  label: {
    fontSize: UI_CONSTANTS.FONT_SIZE.SM,
    fontWeight: UI_CONSTANTS.FONT_WEIGHT.MEDIUM,
    marginBottom: UI_CONSTANTS.SPACING.XS,
  },
  required: {
    color: '#FF6B6B',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MEDIUM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    fontSize: UI_CONSTANTS.FONT_SIZE.MD,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    fontSize: UI_CONSTANTS.FONT_SIZE.XS,
    marginTop: UI_CONSTANTS.SPACING.XS,
    color: '#FF6B6B',
  },
});

export default FormInput;
