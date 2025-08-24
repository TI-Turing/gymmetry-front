import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';
import {
  BranchApiService as BranchService,
  AccessMethodType,
} from '@/services/branchServiceNew';

interface AccessMethodDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export default function AccessMethodDropdown({
  value,
  onValueChange,
  placeholder = 'Seleccione',
  disabled = false,
  required = false,
  label,
}: AccessMethodDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accessMethods, setAccessMethods] = useState<AccessMethodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAccessMethods();
  }, []);

  const loadAccessMethods = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await BranchService.getAccessMethodTypes();

      if (response.Success) {
        setAccessMethods(response.Data || []);
        // No seleccionar automáticamente el primer método
      } else {
        setError(response.Message || 'Error al cargar métodos de acceso');
      }
    } catch {
      setError('Error al cargar métodos de acceso');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMethod = accessMethods.find((method) => method.Id === value);

  const handleSelect = (methodId: string) => {
    onValueChange(methodId);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.dark.tint} />
          <Text style={styles.loadingText}>Cargando métodos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={16} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={loadAccessMethods}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          isOpen && styles.dropdownOpen,
        ]}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedMethod && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {selectedMethod?.Name || placeholder}
        </Text>

        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={disabled ? '#666666' : '#B0B0B0'}
        />
      </TouchableOpacity>

      {isOpen && !disabled && (
        <View style={styles.dropdownList}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {accessMethods.map((method) => (
              <TouchableOpacity
                key={method.Id}
                style={[
                  styles.dropdownItem,
                  value === method.Id && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelect(method.Id)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === method.Id && styles.dropdownItemTextSelected,
                  ]}
                >
                  {method.Name}
                </Text>
                {value === method.Id && (
                  <FontAwesome
                    name="check"
                    size={16}
                    color={Colors.dark.tint}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: UI_CONSTANTS.SPACING.SM,
  },
  required: {
    color: '#FF6B6B',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownDisabled: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444444',
  },
  dropdownOpen: {
    borderColor: Colors.dark.tint,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  placeholderText: {
    color: '#B0B0B0',
  },
  disabledText: {
    color: '#666666',
  },
  dropdownList: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 200,
    position: 'relative',
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  dropdownItemSelected: {
    backgroundColor: Colors.dark.tint + '20',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  dropdownItemTextSelected: {
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A1A1A',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  retryButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  retryText: {
    color: Colors.dark.tint,
    fontSize: 14,
    fontWeight: '600',
  },
});
