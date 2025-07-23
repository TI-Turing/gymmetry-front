import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import CountryCodePicker from './CountryCodePicker';
import { commonStyles } from './styles/common';
import { Country } from './types';

interface PhoneInputWithVerificationProps {
  selectedCountry: Country;
  onSelectCountry: (country: Country) => void;
  phone: string;
  onPhoneChange: (text: string) => void;
  phoneVerified: boolean;
  phoneExists: boolean | null;
  onVerifyPress: () => void;
}

export const PhoneInputWithVerification = memo<PhoneInputWithVerificationProps>(({
  selectedCountry,
  onSelectCountry,
  phone,
  onPhoneChange,
  phoneVerified,
  phoneExists,
  onVerifyPress,
}) => {
  const colorScheme = useColorScheme();

  const getBorderColor = () => {
    if (phoneExists === true) return '#ff6b6b'; // Rojo si existe
    if (phoneVerified) return '#28a745'; // Verde si está verificado
    return '#666'; // Default
  };

  const getVerificationButtonColor = () => {
    if (phoneExists === true) return '#ff6b6b';
    if (phoneVerified) return '#28a745';
    return Colors[colorScheme ?? 'light'].tint;
  };

  const getVerificationIcon = () => {
    if (phoneExists === true) return 'warning';
    if (phoneVerified) return 'check';
    return 'shield';
  };

  const getVerificationText = () => {
    if (phoneExists === true) return 'Ya existe';
    if (phoneVerified) return 'Verificado';
    return 'Verificar';
  };

  return (
    <View style={commonStyles.inputContainer}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Text style={[commonStyles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
          Teléfono
        </Text>
        {phone.trim() && (
          <TouchableOpacity
            onPress={onVerifyPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: getVerificationButtonColor(),
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
            disabled={phoneVerified || phoneExists === true}
            accessibilityLabel={`${getVerificationText()} teléfono`}
            accessibilityRole="button"
          >
            <FontAwesome 
              name={getVerificationIcon()} 
              size={14} 
              color="white" 
              style={{ marginRight: 6 }}
            />
            <Text style={{
              color: 'white',
              fontSize: 12,
              fontWeight: '600'
            }}>
              {getVerificationText()}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {phoneExists === true && (
        <Text style={{
          color: '#ff6b6b',
          fontSize: 12,
          marginTop: 4,
          fontStyle: 'italic'
        }}>
          Este número ya está registrado en el sistema
        </Text>
      )}
      
      <View style={commonStyles.phoneRow}>
        <View style={commonStyles.prefixContainer}>
          <CountryCodePicker
            selectedCountry={selectedCountry}
            onSelect={onSelectCountry}
          />
        </View>
        <View style={commonStyles.phoneContainer}>
          <TextInput
            style={[
              commonStyles.input,
              {
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: getBorderColor(),
              },
            ]}
            value={phone}
            keyboardType="number-pad"
            onChangeText={onPhoneChange}
            placeholder="3001234567"
            placeholderTextColor={`${Colors[colorScheme ?? 'light'].text}60`}
            maxLength={10}
            accessibilityLabel="Número de teléfono"
            accessibilityRole="text"
          />
        </View>
      </View>
    </View>
  );
});

PhoneInputWithVerification.displayName = 'PhoneInputWithVerification';
