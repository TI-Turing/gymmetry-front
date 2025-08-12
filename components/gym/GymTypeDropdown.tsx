import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { GymType } from './types';
// Import directo para evitar conflicto de export en barril styles
import { GymStyles } from './styles/GymStyles';

interface GymTypeDropdownProps {
  label: string;
  placeholder?: string;
  options: GymType[];
  value: string; // ID del tipo seleccionado
  onSelect: (typeId: string) => void;
  error?: string;
  loading?: boolean;
}

export default function GymTypeDropdown({
  label,
  placeholder = 'Seleccione',
  options,
  value,
  onSelect,
  error,
  loading = false,
}: GymTypeDropdownProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const colorScheme = useColorScheme();

  const selectedOption = options.find(option => option.Id === value);
  const selectedName = selectedOption?.Name || placeholder;

  const handleSelect = (typeId: string) => {
    // eslint-disable-next-line no-console
    // TODO: manejar selección de tipo de gimnasio (actualiza estado o llama servicio)
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
    <View style={GymStyles.dropdownContainer}>
      <Text
        style={[GymStyles.dropdownLabel, { color: Colors[colorScheme].text }]}
      >
        {label}
      </Text>

      <TouchableOpacity
        style={[
          GymStyles.dropdownInput,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: error ? '#F44336' : '#666',
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

      {error && <Text style={GymStyles.dropdownErrorText}>{error}</Text>}

      {/* Modal de selección */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={GymStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              GymStyles.modalContent,
              { backgroundColor: Colors[colorScheme].background },
            ]}
          >
            <Text
              style={[
                GymStyles.modalTitle,
                { color: Colors[colorScheme].text },
              ]}
            >
              Selecciona el tipo de gimnasio
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={GymStyles.optionsList}
            >
              {options.map(item => (
                <TouchableOpacity
                  key={item.Id}
                  style={[
                    GymStyles.optionItem,
                    { borderBottomColor: `${Colors[colorScheme].text}` },
                  ]}
                  onPress={() => handleSelect(item.Id)}
                >
                  <View style={GymStyles.optionContent}>
                    <Text
                      style={[
                        GymStyles.optionName,
                        { color: Colors[colorScheme].text },
                      ]}
                    >
                      {item.Name}
                    </Text>
                    <Text
                      style={[
                        GymStyles.optionDescription,
                        { color: `${Colors[colorScheme].text}80` },
                      ]}
                    >
                      {item.Description}
                    </Text>
                  </View>
                  {value === item.Id && (
                    <FontAwesome
                      name='check'
                      size={16}
                      color={Colors.dark.tint}
                    />
                  )}
                </TouchableOpacity>
              ))}

              {options.length === 0 && !loading && (
                <Text
                  style={[
                    GymStyles.noOptionsText,
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
