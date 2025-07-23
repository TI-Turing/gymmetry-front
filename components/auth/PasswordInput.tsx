import React, { memo } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Text } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { commonStyles } from './styles/common';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  borderColor?: string;
  children?: React.ReactNode;
}

export const PasswordInput = memo<PasswordInputProps>(({
  label,
  value,
  onChangeText,
  placeholder,
  showPassword,
  onToggleVisibility,
  borderColor = '#666',
  children,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={commonStyles.inputContainer}>
      <Text style={[commonStyles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
        {label}
      </Text>
      <View style={commonStyles.passwordContainer}>
        <TextInput
          style={[
            commonStyles.passwordInput,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              color: Colors[colorScheme ?? 'light'].text,
              borderColor,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={`${Colors[colorScheme ?? 'light'].text}60`}
          secureTextEntry={!showPassword}
          accessibilityLabel={label}
          accessibilityRole="text"
        />
        <TouchableOpacity
          style={commonStyles.eyeButton}
          onPress={onToggleVisibility}
          accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          accessibilityRole="button"
        >
          <FontAwesome
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
});

PasswordInput.displayName = 'PasswordInput';
