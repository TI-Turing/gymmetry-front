import React, { useState, useEffect, useCallback } from 'react';
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
import { userService } from '@/services/userService';
import type { UserBasicInfo } from '@/dto/user/UserBasicInfo';
import { authService } from '@/services/authService';

interface UserDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export default function UserDropdown({
  value,
  onValueChange,
  placeholder = 'Selecciona un administrador',
  disabled = false,
  required = false,
  label,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserBasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGymUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const gymId = authService.getGymId();
      if (!gymId) {
        setError('No se encontró ID del gym');
        return;
      }

      const response = await userService.getUsersByGym(gymId);

      if (response.Success) {
        //TODO: filtrar por empleados del gym.
        const items = response.Data || [];
        setUsers(items);

        // Si solo hay un usuario, seleccionarlo automáticamente y deshabilitar
        if (items.length === 1) {
          onValueChange(items[0].id);
        } else if (!value && items.length > 0) {
          // Si hay múltiples usuarios y no hay valor seleccionado, no seleccionar automáticamente
        }
      } else {
        setError(response.Message || 'Error al cargar usuarios del gym');
      }
    } catch {
      setError('Error al cargar usuarios del gym');
    } finally {
      setIsLoading(false);
    }
  }, [onValueChange, value]);

  useEffect(() => {
    loadGymUsers();
  }, [loadGymUsers]);

  const selectedUser = users.find(user => user.id === value);
  const isDisabledState = disabled || users.length <= 1;

  const handleSelect = (userId: string) => {
    onValueChange(userId);
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
          <ActivityIndicator size='small' color={Colors.dark.tint} />
          <Text style={styles.loadingText}>Cargando usuarios...</Text>
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
          <FontAwesome name='exclamation-triangle' size={16} color='#FF6B6B' />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadGymUsers} style={styles.retryButton}>
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
          isDisabledState && styles.dropdownDisabled,
          isOpen && styles.dropdownOpen,
        ]}
        onPress={() => !isDisabledState && setIsOpen(!isOpen)}
        disabled={isDisabledState}
      >
        <View style={styles.dropdownContent}>
          {selectedUser ? (
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.dropdownText,
                  isDisabledState && styles.disabledText,
                ]}
              >
                {selectedUser.name} {selectedUser.lastName}
              </Text>
              <Text
                style={[
                  styles.userEmail,
                  isDisabledState && styles.disabledText,
                ]}
              >
                {selectedUser.email}
              </Text>
            </View>
          ) : (
            <Text
              style={[
                styles.dropdownText,
                styles.placeholderText,
                isDisabledState && styles.disabledText,
              ]}
            >
              {placeholder}
            </Text>
          )}
        </View>

        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={isDisabledState ? '#666666' : '#B0B0B0'}
        />
      </TouchableOpacity>

      {users.length <= 1 && users.length > 0 && (
        <Text style={styles.helpText}>
          Solo hay un usuario disponible en este gym
        </Text>
      )}

      {isOpen && !isDisabledState && (
        <View style={styles.dropdownList}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {users.map(user => (
              <TouchableOpacity
                key={user.id}
                style={[
                  styles.dropdownItem,
                  value === user.id && styles.dropdownItemSelected,
                ]}
                onPress={() => handleSelect(user.id)}
              >
                <View style={styles.userInfoItem}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      value === user.id && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {user.name} {user.lastName}
                  </Text>
                  <Text
                    style={[
                      styles.userEmailItem,
                      value === user.id && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {user.email}
                  </Text>
                  {user.userName && (
                    <Text
                      style={[
                        styles.userNameItem,
                        value === user.id && styles.dropdownItemTextSelected,
                      ]}
                    >
                      @{user.userName}
                    </Text>
                  )}
                </View>
                {value === user.id && (
                  <FontAwesome
                    name='check'
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
  dropdownContent: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  placeholderText: {
    color: '#B0B0B0',
  },
  disabledText: {
    color: '#666666',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  helpText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 4,
    fontStyle: 'italic',
  },
  dropdownList: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 250,
    position: 'relative',
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 250,
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
  userInfoItem: {
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  dropdownItemTextSelected: {
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  userEmailItem: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  userNameItem: {
    fontSize: 12,
    color: '#888888',
    marginTop: 1,
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
