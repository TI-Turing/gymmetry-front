import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { GymType } from './types';

interface GymTypeDropdownProps {
  label: string;
  placeholder: string;
  options: GymType[];
  value: string; // ID del tipo seleccionado
  onSelect: (typeId: string) => void;
  error?: string;
  loading?: boolean;
}

export default function GymTypeDropdown({
  label,
  placeholder,
  options,
  value,
  onSelect,
  error,
  loading = false,
}: GymTypeDropdownProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  // eslint-disable-next-line no-console
  console.log('🏷️ GymTypeDropdown - options:', options);
  // eslint-disable-next-line no-console
  console.log('🏷️ GymTypeDropdown - value:', value);

  const selectedOption = options.find(option => option.Id === value);
  const selectedName = selectedOption?.Name || placeholder;

  const handleSelect = (typeId: string) => {
    // eslint-disable-next-line no-console
    console.log('📝 Selected gym type:', typeId);
    onSelect(typeId);
    setIsModalVisible(false);
  };

  const handleOpen = () => {
    if (loading) {
      return;
    }
    if (options.length === 0) {
      return;
    }
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
        {label}
      </Text>

      <TouchableOpacity
        style={[
          styles.input,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: error ? '#F44336' : '#666',
            justifyContent: 'center',
          },
        ]}
        onPress={handleOpen}
        disabled={loading}
        accessibilityLabel={label}
        accessibilityHint='Presiona para abrir la lista de tipos de gimnasio'
      >
        <Text
          style={{
            color: selectedOption
              ? Colors[colorScheme].text
              : `${Colors[colorScheme].text}60`,
            fontSize: 16,
          }}
        >
          {selectedName}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal de selección */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: Colors[colorScheme].text }]}
            >
              Selecciona el tipo de gimnasio
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
            >
              {options.map(item => (
                <TouchableOpacity
                  key={item.Id}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: `${Colors[colorScheme].text}20` },
                  ]}
                  onPress={() => handleSelect(item.Id)}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionName,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      {item.Name}
                    </Text>
                    <Text
                      style={[
                        styles.optionDescription,
                        { color: `${Colors[colorScheme].text}80` },
                      ]}
                    >
                      {item.Description}
                    </Text>
                  </View>
                  {value === item.Id && (
                    <FontAwesome name='check' size={16} color='#9C27B0' />
                  )}
                </TouchableOpacity>
              ))}

              {options.length === 0 && !loading && (
                <Text
                  style={[
                    styles.noOptionsText,
                    { color: Colors[colorScheme].text },
                  ]}
                >
                  No hay tipos de gimnasio disponibles
                </Text>
              )}
            </ScrollView>
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
  input: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    minHeight: 56,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  noOptionsText: {
    textAlign: 'center',
    opacity: 0.7,
    padding: 20,
  },
});
