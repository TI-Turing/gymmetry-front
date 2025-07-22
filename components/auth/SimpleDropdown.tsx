import React, { useState } from 'react';
import { TouchableOpacity, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { commonStyles } from './styles/common';

interface SimpleDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
}

export default function SimpleDropdown({ 
  label, 
  placeholder, 
  options, 
  value, 
  onSelect
}: SimpleDropdownProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    console.log('🔍 [SIMPLE DROPDOWN] Pressed with options:', options);
    console.log('🔍 [SIMPLE DROPDOWN] Options length:', options.length);
    console.log('🔍 [SIMPLE DROPDOWN] Current value:', value);
    console.log('🔍 [SIMPLE DROPDOWN] Platform:', Platform.OS);
    
    if (options.length === 0) {
      Alert.alert('Sin opciones', 'No hay opciones disponibles');
      return;
    }

    if (Platform.OS === 'ios') {
      // En iOS usar ActionSheet nativo
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', ...options],
          cancelButtonIndex: 0,
          title: `Seleccionar ${label}`,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            onSelect(options[buttonIndex - 1]);
          }
        }
      );
    } else {
      // En Android usar Alert con botones
      console.log('🔍 [SIMPLE DROPDOWN] Creating Android alert buttons');
      const buttons = options.map((option) => ({
        text: option,
        onPress: () => {
          console.log('🔍 [SIMPLE DROPDOWN] Android Selection:', option);
          onSelect(option);
        },
      }));
      buttons.push({ 
        text: 'Cancelar', 
        onPress: () => {
          console.log('🔍 [SIMPLE DROPDOWN] Android Selection cancelled');
        }
      });

      console.log('🔍 [SIMPLE DROPDOWN] About to show Alert with title:', `Seleccionar ${label}`);
      console.log('🔍 [SIMPLE DROPDOWN] Button options:', buttons.map(b => b.text));
      Alert.alert(`Seleccionar ${label}`, '', buttons);
    }
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={[commonStyles.label, { color: Colors[colorScheme].text }]}>
        {label}
      </Text>
      <TouchableOpacity
        style={[
          commonStyles.input,
          {
            backgroundColor: Colors[colorScheme].background,
            borderColor: '#666',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}
        onPress={handlePress}
      >
        <Text
          style={{
            color: value ? Colors[colorScheme].text : `${Colors[colorScheme].text}60`,
            flex: 1,
          }}
        >
          {value || placeholder}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={16}
          color={Colors[colorScheme].text}
        />
      </TouchableOpacity>
    </View>
  );
}
