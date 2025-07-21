import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsModalVisible(false);
    setSearchText('');
  };

  const renderOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.option, { borderBottomColor: Colors[colorScheme].text + '20' }]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[styles.optionText, { color: Colors[colorScheme].text }]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
          {label}
        </Text>
        <TouchableOpacity
          style={[
            styles.dropdown,
            styles.dropdownWeb,
            {
              backgroundColor: Colors[colorScheme].background,
              borderColor: '#666',
            }
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text 
            style={[
              styles.dropdownText, 
              { 
                color: value ? Colors[colorScheme].text : `${Colors[colorScheme].text}60` 
              }
            ]}
          >
            {value || placeholder}
          </Text>
          <Text style={[styles.arrow, { color: Colors[colorScheme].text }]}>
            ▼
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, styles.modalOverlayWeb]}>
          <View style={[
            styles.modalContainer,
            styles.modalContainerWeb,
            { backgroundColor: Colors[colorScheme].background }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme].text }]}>
                {label}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[styles.closeButtonText, { color: Colors[colorScheme].text }]}>
                  ✕
                </Text>
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
                placeholder="Buscar..."
                placeholderTextColor={`${Colors[colorScheme].text}60`}
              />
            )}

            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item: string, index: number) => `${item}-${index}`}
              style={[styles.optionsList, styles.optionsListWeb]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 12,
    minHeight: 50,
  },
  dropdownWeb: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayWeb: {
    backdropFilter: 'blur(5px)',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContainerWeb: {
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  optionsList: {
    flex: 1,
  },
  optionsListWeb: {
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
