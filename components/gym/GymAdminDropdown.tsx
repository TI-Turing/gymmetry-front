import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { userService } from '@/services/userService';
import type { UserBasicInfo } from '@/dto/user/UserBasicInfo';
import { authService } from '@/services/authService';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymAdminDropdownStyles } from './styles/gymAdminDropdown';

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
  placeholder = 'Seleccione',
  disabled = false,
  required = false,
  label = 'Administrador principal',
}: GymAdminDropdownProps) {
  const { styles, colors } = useThemedStyles(makeGymAdminDropdownStyles);
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<UserBasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadGymEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const items = response.Data || [];

        // Mapear User a UserBasicInfo
        const mappedUsers = items.map((user) => ({
          id: user.Id,
          name: user.Name || '',
          lastName: user.LastName || '',
          userName: user.UserName || '',
          email: user.Email,
          gymId: user.GymId || undefined,
          userTypeId: user.UserTypeId || undefined,
        }));

        setEmployees(mappedUsers);

        // Si solo hay un empleado, seleccionarlo automáticamente y deshabilitar
        if (mappedUsers.length === 1) {
          onValueChange(mappedUsers[0].id);
        } else if (!value && mappedUsers.length > 0) {
          // Si hay múltiples empleados y no hay valor seleccionado, no seleccionar automáticamente
        }
      } else {
        setError(response.Message || 'Error al cargar empleados del gym');
      }
    } catch {
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
      filtered = employees.filter((employee) => {
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

  const selectedEmployee = employees.find((employee) => employee.id === value);
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
          <ActivityIndicator size="small" color={colors.tint} />
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
          <FontAwesome
            name="exclamation-triangle"
            size={16}
            color={colors.danger}
          />
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
          color={isDisabledState ? colors.disabled : colors.muted}
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
              name="search"
              size={16}
              color={colors.muted}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={colors.muted}
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <FontAwesome name="times" size={14} color={colors.muted} />
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
              filteredAndSortedEmployees.map((employee) => (
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
                    <FontAwesome name="check" size={16} color={colors.tint} />
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
