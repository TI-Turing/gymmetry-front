import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  searchable?: boolean;
}

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onSelect,
  searchable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  // Debug: agregar logs para verificar las opciones
  React.useEffect(() => {}, [options, value]);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleOpen = () => {
    if (options.length === 0) {
      Alert.alert(
        'Sin opciones',
        'No hay opciones disponibles para seleccionar'
      );
      return;
    }
    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
        {label}
      </Text>

      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: '#666',
          },
        ]}
        onPress={handleOpen}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dropdownText,
            {
              color: value
                ? Colors[colorScheme].text
                : `${Colors[colorScheme].text}60`,
            },
          ]}
        >
          {value || placeholder}
        </Text>
        <FontAwesome
          name='chevron-down'
          size={16}
          color={Colors[colorScheme].text}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContainer}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: Colors[colorScheme].background },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  Seleccionar {label || 'opción'}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  <FontAwesome
                    name='times'
                    size={20}
                    color={Colors[colorScheme].text}
                  />
                </TouchableOpacity>
              </View>

              {searchable && (
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: Colors[colorScheme].background,
                      color: Colors[colorScheme].text,
                      borderColor: '#666',
                    },
                  ]}
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder={`Buscar ${label?.toLowerCase() || 'opción'}...`}
                  placeholderTextColor={`${Colors[colorScheme].text}60`}
                />
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item === value && {
                        backgroundColor: `${Colors[colorScheme].tint}20`,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            item === value
                              ? Colors[colorScheme].tint
                              : Colors[colorScheme].text,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                    {item === value && (
                      <FontAwesome
                        name='check'
                        size={16}
                        color={Colors[colorScheme].tint}
                      />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.optionsList}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '70%',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
});
