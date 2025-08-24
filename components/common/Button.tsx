import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';

import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  ...touchableProps
}) => {
  const colorScheme = useColorScheme();
  const isDisabled = disabled || loading;

  const getButtonStyles = (): ViewStyle => {
    const baseStyle = {
      borderRadius: UI_CONSTANTS.BORDER_RADIUS.MEDIUM,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...getSizeStyles(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].tint,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Colors[colorScheme].background,
          borderWidth: 1,
          borderColor: Colors[colorScheme].tint,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors[colorScheme].text + '40',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: UI_CONSTANTS.SPACING.MD,
          paddingVertical: UI_CONSTANTS.SPACING.SM,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingHorizontal: UI_CONSTANTS.SPACING.XL,
          paddingVertical: UI_CONSTANTS.SPACING.MD,
          minHeight: 56,
        };
      default: // medium
        return {
          paddingHorizontal: UI_CONSTANTS.SPACING.LG,
          paddingVertical: UI_CONSTANTS.SPACING.MD,
          minHeight: 48,
        };
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyle = {
      fontWeight: UI_CONSTANTS.FONT_WEIGHT.SEMIBOLD,
      ...getTextSizeStyles(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: Colors[colorScheme].tint,
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: Colors[colorScheme].text,
        };
      default:
        return baseTextStyle;
    }
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: UI_CONSTANTS.FONT_SIZE.SM };
      case 'large':
        return { fontSize: UI_CONSTANTS.FONT_SIZE.LG };
      default:
        return { fontSize: UI_CONSTANTS.FONT_SIZE.MD };
    }
  };

  const buttonStyles = [
    getButtonStyles(),
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const finalTextStyles = [
    getTextStyles(),
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : Colors[colorScheme].tint}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={finalTextStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: UI_CONSTANTS.OPACITY.DISABLED,
  },
  disabledText: {
    opacity: UI_CONSTANTS.OPACITY.DISABLED,
  },
});

export default Button;
