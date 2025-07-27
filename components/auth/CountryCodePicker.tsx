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
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'NL', name: 'Países Bajos', dialCode: '+31', flag: '🇳🇱' },
  { code: 'BE', name: 'Bélgica', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suiza', dialCode: '+41', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Suecia', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Noruega', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Dinamarca', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlandia', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Polonia', dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'República Checa', dialCode: '+420', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungría', dialCode: '+36', flag: '🇭🇺' },
  { code: 'RO', name: 'Rumania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'HR', name: 'Croacia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'SI', name: 'Eslovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'SK', name: 'Eslovaquia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'LV', name: 'Letonia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LT', name: 'Lituania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'RU', name: 'Rusia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'UA', name: 'Ucrania', dialCode: '+380', flag: '🇺🇦' },
  { code: 'BY', name: 'Bielorrusia', dialCode: '+375', flag: '🇧🇾' },
  { code: 'MD', name: 'Moldavia', dialCode: '+373', flag: '🇲🇩' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'TH', name: 'Tailandia', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'PH', name: 'Filipinas', dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malasia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapur', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64', flag: '🇳🇿' },
  { code: 'ZA', name: 'Sudáfrica', dialCode: '+27', flag: '🇿🇦' },
  { code: 'EG', name: 'Egipto', dialCode: '+20', flag: '🇪🇬' },
  { code: 'MA', name: 'Marruecos', dialCode: '+212', flag: '🇲🇦' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenia', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Arabia Saudí', dialCode: '+966', flag: '🇸🇦' },
  { code: 'TR', name: 'Turquía', dialCode: '+90', flag: '🇹🇷' },
  { code: 'IR', name: 'Irán', dialCode: '+98', flag: '🇮🇷' },
  { code: 'IQ', name: 'Irak', dialCode: '+964', flag: '🇮🇶' },
  { code: 'LB', name: 'Líbano', dialCode: '+961', flag: '🇱🇧' },
  { code: 'JO', name: 'Jordania', dialCode: '+962', flag: '🇯🇴' },
  { code: 'SY', name: 'Siria', dialCode: '+963', flag: '🇸🇾' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Catar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Baréin', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Omán', dialCode: '+968', flag: '🇴🇲' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { code: 'AF', name: 'Afganistán', dialCode: '+93', flag: '🇦🇫' },
  { code: 'PK', name: 'Pakistán', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladés', dialCode: '+880', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'KH', name: 'Camboya', dialCode: '+855', flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
];

interface CountryCodePickerProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
  disabled?: boolean;
}

export default function CountryCodePicker({
  selectedCountry,
  onSelect,
  disabled = false,
}: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const colorScheme = useColorScheme();

  const filteredCountries = COUNTRIES.filter(
    country =>
      country.name.toLowerCase().includes(searchText.toLowerCase()) ||
      country.dialCode.includes(searchText)
  );

  const handleSelect = (country: Country) => {
    onSelect(country);
    setModalVisible(false);
    setSearchText('');
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      style={[
        styles.countryItem,
        { borderBottomColor: `${Colors[colorScheme].text}20` },
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <View style={styles.countryInfo}>
        <Text style={[styles.countryName, { color: Colors[colorScheme].text }]}>
          {item.name}
        </Text>
        <Text
          style={[
            styles.dialCode,
            { color: Colors[colorScheme].text, opacity: 0.7 },
          ]}
        >
          {item.dialCode}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: disabled
              ? `${Colors[colorScheme].text}15`
              : Colors[colorScheme].background,
            borderColor: disabled ? `${Colors[colorScheme].text}40` : '#666',
            opacity: disabled ? 0.8 : 1,
          },
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text
          style={[
            styles.selectedDialCode,
            {
              color: disabled
                ? Colors[colorScheme].text
                : Colors[colorScheme].text,
            },
          ]}
        >
          {selectedCountry.dialCode}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={[
            styles.modal,
            { backgroundColor: Colors[colorScheme].background },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[styles.modalTitle, { color: Colors[colorScheme].text }]}
            >
              Seleccionar País
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { color: Colors[colorScheme].tint },
                ]}
              >
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
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
              placeholder='Buscar país o código...'
              placeholderTextColor={`${Colors[colorScheme].text}60`}
            />
          </View>

          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={item => item.code}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  selectedDialCode: {
    fontSize: 16,
    fontWeight: '500',
  },
  modal: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  countryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dialCode: {
    fontSize: 14,
    marginTop: 2,
  },
});

// Exportar también la lista de países y el país por defecto
export { COUNTRIES };
export const DEFAULT_COUNTRY =
  COUNTRIES.find(c => c.code === 'CO') || COUNTRIES[0];
