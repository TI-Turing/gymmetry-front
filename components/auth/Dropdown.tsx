import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
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
  searchable = false 
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

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
        onPress={() => setIsOpen(true)}
      >
        <Text
          style={[
            styles.dropdownText,
            {
              color: value ? Colors[colorScheme].text : `${Colors[colorScheme].text}60`,
            },
          ]}
        >
          {value || placeholder}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={16}
          color={Colors[colorScheme].text}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme].text }]}>
                Seleccionar {label}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <FontAwesome
                  name="times"
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
                placeholder={`Buscar ${label.toLowerCase()}...`}
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
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: item === value
                          ? Colors[colorScheme].tint
                          : Colors[colorScheme].text,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <FontAwesome
                      name="check"
                      size={16}
                      color={Colors[colorScheme].tint}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
            />
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
  modalContent: {
    width: '90%',
    maxHeight: '70%',
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
