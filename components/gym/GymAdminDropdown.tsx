import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';
import { userService, UserBasicInfo } from '@/services/userService';
import { authService } from '@/services/authService';

interface GymAdminDropdownProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

export default function GymAdminDropdown({
  value,
  onValueChange,
  placeholder = 'Selecciona un administrador',
  disabled = false,
  required = false,
  label = 'Administrador principal',
}: GymAdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<UserBasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadGymEmployees();
  }, []);

  const loadGymEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const gymId = authService.getGymId();
      const isLoggedIn = authService.isAuthenticated();

      if (!gymId) {
        setError('No se encontró ID del gym');
        setIsLoading(false);
        return;
      }

      if (!isLoggedIn) {
        setError('Usuario no autenticado');
        setIsLoading(false);
        return;
      }

      const response = await userService.getUsersByGym(gymId);

      if (response.Success) {
        //TODO: filtrar por empleados del gym.
        setEmployees(response.Data);

        // Si solo hay un empleado, seleccionarlo automáticamente y deshabilitar
        if (response.Data.length === 1) {
          onValueChange(response.Data[0].id);
        } else if (!value && response.Data.length > 0) {
          // Si hay múltiples empleados y no hay valor seleccionado, no seleccionar automáticamente
        }
      } else {
        setError(response.Message || 'Error al cargar empleados del gym');
      }
    } catch (_err) {
      setError('Error al cargar empleados del gym');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar y ordenar empleados en tiempo real
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees;

    // Filtrar por texto de búsqueda si hay alguno
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = employees.filter(employee => {
        const fullName = `${employee.name} ${employee.lastName}`.toLowerCase();
        const email = employee.email?.toLowerCase() || '';
        const userName = employee.userName?.toLowerCase() || '';

        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          userName.includes(searchLower)
        );
      });
    }

    // Ordenar alfabéticamente por nombre completo
    return filtered.sort((a, b) => {
      const nameA = `${a.name} ${a.lastName}`.toLowerCase();
      const nameB = `${b.name} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [employees, searchText]);

  const selectedEmployee = employees.find(employee => employee.id === value);
  const isDisabledState = disabled || employees.length <= 1;

  const handleSelect = (employeeId: string) => {
    onValueChange(employeeId);
    setSearchText(''); // Limpiar búsqueda al seleccionar
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
          <Text style={styles.loadingText}>Cargando empleados...</Text>
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
          <TouchableOpacity
            onPress={loadGymEmployees}
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
          isDisabledState && styles.dropdownDisabled,
          isOpen && styles.dropdownOpen,
        ]}
        onPress={() => !isDisabledState && setIsOpen(!isOpen)}
        disabled={isDisabledState}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedEmployee && styles.placeholderText,
            isDisabledState && styles.disabledText,
          ]}
        >
          {selectedEmployee
            ? `${selectedEmployee.name} ${selectedEmployee.lastName}`
            : placeholder}
        </Text>

        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={isDisabledState ? '#666666' : '#B0B0B0'}
        />
      </TouchableOpacity>

      {employees.length <= 1 && employees.length > 0 && (
        <Text style={styles.helpText}>
          Solo hay un empleado disponible en este gym
        </Text>
      )}

      {isOpen && !isDisabledState && (
        <View style={styles.dropdownList}>
          {/* Campo de búsqueda */}
          <View style={styles.searchContainer}>
            <FontAwesome
              name='search'
              size={16}
              color='#B0B0B0'
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder='Buscar empleado...'
              placeholderTextColor='#B0B0B0'
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize='none'
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <FontAwesome name='times' size={14} color='#B0B0B0' />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {filteredAndSortedEmployees.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>
                  {searchText
                    ? 'No se encontraron empleados'
                    : 'No hay empleados disponibles'}
                </Text>
              </View>
            ) : (
              filteredAndSortedEmployees.map(employee => (
                <TouchableOpacity
                  key={employee.id}
                  style={[
                    styles.dropdownItem,
                    value === employee.id && styles.dropdownItemSelected,
                  ]}
                  onPress={() => handleSelect(employee.id)}
                >
                  <View style={styles.employeeInfoItem}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        value === employee.id &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {employee.name} {employee.lastName}
                    </Text>
                    <Text
                      style={[
                        styles.employeeEmailItem,
                        value === employee.id &&
                          styles.dropdownItemTextSelected,
                      ]}
                    >
                      {employee.email}
                    </Text>
                    {employee.userName && (
                      <Text
                        style={[
                          styles.employeeNameItem,
                          value === employee.id &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        @{employee.userName}
                      </Text>
                    )}
                  </View>
                  {value === employee.id && (
                    <FontAwesome
                      name='check'
                      size={16}
                      color={Colors.dark.tint}
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
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
  employeeInfoItem: {
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
  employeeEmailItem: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  employeeNameItem: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderRadius: 6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  noResultsText: {
    color: '#B0B0B0',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
