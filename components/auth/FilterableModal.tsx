import React from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

interface FilterableModalProps<T> {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  filter: string;
  onFilterChange: (text: string) => void;
  getItemId: (item: T) => string;
  getItemName: (item: T) => string;
}

export function FilterableModal<T>({
  visible,
  onClose,
  title,
  data,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  getItemId,
  getItemName,
}: FilterableModalProps<T>) {
  const colorScheme = useColorScheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: Colors[colorScheme].background,
            borderRadius: 12,
            padding: 20,
            width: '90%',
            maxWidth: 400,
            maxHeight: '80%',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
          onStartShouldSetResponder={() => true}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Colors[colorScheme].text,
              }}
            >
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: `${Colors[colorScheme].text}10`,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors[colorScheme].text,
                  fontWeight: 'bold',
                }}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors[colorScheme].background,
              borderWidth: 1,
              borderColor: '#666',
              borderRadius: 8,
              marginBottom: 16,
              paddingHorizontal: 12,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                color: Colors[colorScheme].text,
                paddingVertical: 12,
                fontSize: 16,
              }}
              value={filter}
              onChangeText={onFilterChange}
              placeholder='Buscar'
              placeholderTextColor={`${Colors[colorScheme].text}60`}
            />
            <FontAwesome
              name='search'
              size={16}
              color='white'
              style={{ marginLeft: 8 }}
            />
          </View>

          <ScrollView style={{ maxHeight: 300 }}>
            {data.map((item, index) => {
              const itemId = getItemId(item);
              const itemName = getItemName(item);
              const isSelected = selectedId === itemId;

              return (
                <TouchableOpacity
                  key={itemId}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: index === data.length - 1 ? 0 : 8,
                    backgroundColor: isSelected
                      ? `${Colors[colorScheme].tint}10`
                      : 'transparent',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => onSelect(item)}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? Colors[colorScheme].tint
                        : Colors[colorScheme].text,
                      fontWeight: isSelected ? '600' : 'normal',
                      fontSize: 16,
                    }}
                  >
                    {itemName}
                  </Text>
                  {isSelected && (
                    <Text
                      style={{
                        color: Colors[colorScheme].tint,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
