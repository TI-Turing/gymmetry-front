import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  Platform,
} from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
];

export const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'CO') || COUNTRIES[0];

interface CountryCodePickerProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export default function CountryCodePicker({ selectedCountry, onSelect }: CountryCodePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchText.toLowerCase()) ||
    country.dialCode.includes(searchText)
  );

  const handleSelect = (country: Country) => {
    onSelect(country);
    setIsModalVisible(false);
    setSearchText('');
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[styles.countryItem, { borderBottomColor: Colors[colorScheme].text + '20' }]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[styles.flag, Platform.OS === 'web' && styles.flagWeb]}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={[styles.countryName, { color: Colors[colorScheme].text }]}>
          {item.name}
        </Text>
        <Text style={[styles.dialCode, { color: Colors[colorScheme].text }]}>
          {item.dialCode}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.picker,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: '#666',
          },
          Platform.OS === 'web' && styles.pickerWeb
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={[styles.flag, Platform.OS === 'web' && styles.flagWeb]}>
          {selectedCountry.flag}
        </Text>
        <Text style={[styles.dialCode, { color: Colors[colorScheme].text }]}>
          {selectedCountry.dialCode}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalOverlay, Platform.OS === 'web' && styles.modalOverlayWeb]}>
          <View style={[
            styles.modalContainer,
            { backgroundColor: Colors[colorScheme].background },
            Platform.OS === 'web' && styles.modalContainerWeb
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: Colors[colorScheme].text }]}>
                Seleccionar país
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
              placeholder="Buscar país..."
              placeholderTextColor={`${Colors[colorScheme].text}60`}
            />

            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={[styles.countryList, Platform.OS === 'web' && styles.countryListWeb]}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 12,
    minWidth: 80,
  },
  pickerWeb: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  flagWeb: {
    fontSize: 18,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '600',
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
  countryList: {
    flex: 1,
  },
  countryListWeb: {
    maxHeight: 300,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export { Country };
