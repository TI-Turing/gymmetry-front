import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { GymType } from './types';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymTypeDropdownStyles } from './styles/gymTypeDropdown';

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
  const { styles, colors } = useThemedStyles(makeGymTypeDropdownStyles);

  const selectedOption = options.find((option) => option.Id === value);
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
    <View style={styles.dropdownContainer}>
      <Text style={styles.dropdownLabel}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.dropdownInput,
          { borderColor: error ? colors.danger : colors.border },
        ]}
        onPress={handleOpen}
        disabled={loading}
        accessibilityLabel={label}
        accessibilityHint="Presiona para abrir la lista de tipos de gimnasio"
      >
        <Text
          style={{
            color: selectedOption ? colors.text : `${colors.text}60`,
            fontSize: 16,
          }}
        >
          {selectedName}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.dropdownErrorText}>{error}</Text>}

      {/* Modal de selección */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Selecciona el tipo de gimnasio
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.optionsList}
            >
              {options.map((item) => (
                <TouchableOpacity
                  key={item.Id}
                  style={styles.optionItem}
                  onPress={() => handleSelect(item.Id)}
                >
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName}>{item.Name}</Text>
                    <Text style={styles.optionDescription}>
                      {item.Description}
                    </Text>
                  </View>
                  {value === item.Id && (
                    <FontAwesome name="check" size={16} color={colors.tint} />
                  )}
                </TouchableOpacity>
              ))}

              {options.length === 0 && !loading && (
                <Text style={styles.noOptionsText}>
                  Sin opciones disponibles
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
