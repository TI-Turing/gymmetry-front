import React, { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { catalogStyles, getColorSchemeStyles } from './styles/catalogStyles';
import { CatalogItem } from './types';

interface BaseCatalogSelectorProps {
  label: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string;
  data: CatalogItem[];
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const BaseCatalogSelector = memo<BaseCatalogSelectorProps>(
  ({
    label,
    value,
    placeholder = 'Seleccione',
    disabled = false,
    loading = false,
    required = false,
    error,
    data,
    onPress,
    accessibilityLabel,
    accessibilityHint,
  }) => {
    const colorScheme = useColorScheme();
    const colorStyles = getColorSchemeStyles(colorScheme);

    const selectedItem = useMemo(() => {
      return data.find((item) => item.Id === value);
    }, [data, value]);

    const displayText = selectedItem?.Nombre || placeholder;
    const isSelected = !!selectedItem;

    return (
      <View style={catalogStyles.container}>
        <Text style={[catalogStyles.label, colorStyles.label]}>
          {label}
          {required && ' *'}
        </Text>

        <TouchableOpacity
          style={[
            catalogStyles.selector,
            colorStyles.selector,
            disabled
              ? catalogStyles.selectorDisabled
              : catalogStyles.selectorEnabled,
          ]}
          onPress={onPress}
          disabled={disabled || loading}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text
              style={[
                catalogStyles.selectorText,
                colorStyles.selectorText,
                isSelected
                  ? colorStyles.selectorText
                  : colorStyles.placeholderText,
              ]}
            >
              {displayText}
            </Text>
          )}
        </TouchableOpacity>

        {error && <Text style={catalogStyles.errorText}>{error}</Text>}
      </View>
    );
  }
);

BaseCatalogSelector.displayName = 'BaseCatalogSelector';
