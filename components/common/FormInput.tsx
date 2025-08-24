import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  maxLines?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  error,
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  maxLines,
  ...textInputProps
}) => {
  const colorScheme = useColorScheme();
  const hasError = Boolean(error);
  const [height, setHeight] = React.useState<number | undefined>(undefined);

  const { multiline } = textInputProps;

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    if (multiline && maxLines) {
      const newHeight = event.nativeEvent.contentSize.height;
      setHeight(newHeight);
    }
  };

  const inputStyles: TextStyle[] = [
    styles.input,
    {
      backgroundColor: Colors[colorScheme].background,
      color: Colors[colorScheme].text,
      borderColor: hasError ? Colors[colorScheme].tint + '80' : '#666',
    },
  ];
  if (hasError) inputStyles.push(styles.inputError);

  if (multiline) {
    inputStyles.push(styles.multilineInput);
    if (height !== undefined) {
      const maxHeight =
        (styles.multilineInput.lineHeight || 20) * (maxLines || 1);
      inputStyles.push({ height: Math.min(height, maxHeight) } as TextStyle);
    }
  }

  if (inputStyle) {
    inputStyles.push(inputStyle as TextStyle);
  }

  return (
    <View
      style={[styles.container, (containerStyle || undefined) as ViewStyle]}
    >
      {label && (
        <Text
          style={[
            styles.label,
            { color: Colors[colorScheme].text },
            labelStyle as TextStyle,
          ]}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={styles.inputRow}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={inputStyles as unknown as StyleProp<TextStyle>}
          placeholderTextColor={`${Colors[colorScheme].text}60`}
          onContentSizeChange={handleContentSizeChange}
          {...textInputProps}
        />
      </View>

      {error && (
        <Text
          style={[
            styles.errorText,
            { color: Colors[colorScheme].tint },
            errorStyle as TextStyle,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: UI_CONSTANTS.SPACING.SM,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MEDIUM,
    paddingHorizontal: UI_CONSTANTS.SPACING.MD,
    fontSize: UI_CONSTANTS.FONT_SIZE.MD,
    flex: 1,
    textAlignVertical: 'center',
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: UI_CONSTANTS.SPACING.MD,
    paddingBottom: UI_CONSTANTS.SPACING.MD,
    lineHeight: 20,
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
