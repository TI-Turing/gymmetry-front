// Ejemplo de uso del BlockButton con rate limiting
// Este componente muestra diferentes configuraciones del BlockButton

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { BlockButton } from '../BlockButton';
// import { useI18n } from '../../../hooks/useI18n'; // Removed unused import
import { useColorScheme } from '../../useColorScheme';
import Colors from '@/constants/Colors';

export const BlockButtonExample: React.FC = () => {
  // const { t } = useI18n(); // Removed unused import
  const colorScheme = useColorScheme();

  const exampleUsers = [
    { id: '1', name: 'Juan Pérez', isBlocked: false },
    { id: '2', name: 'María García', isBlocked: true },
    { id: '3', name: 'Carlos López', isBlocked: false },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: Colors[colorScheme].text,
          marginBottom: 20,
        }}
      >
        BlockButton Examples
      </Text>

      {/* Ejemplo con indicador de rate limit */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            marginBottom: 10,
          }}
        >
          Con indicador de rate limit
        </Text>
        {exampleUsers.map((user) => (
          <View
            key={user.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 15,
              marginBottom: 10,
              backgroundColor: Colors[colorScheme].card,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: Colors[colorScheme].text, fontSize: 16 }}>
              {user.name}
            </Text>
            <BlockButton
              userId={user.id}
              userName={user.name}
              initialBlockedState={user.isBlocked}
              style="compact"
              size="medium"
              showRateLimit={true}
              onBlockStatusChanged={(_isBlocked) => {
                // Handle block status change
                // Could update local state, call analytics, etc.
              }}
            />
          </View>
        ))}
      </View>

      {/* Ejemplo solo icono */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            marginBottom: 10,
          }}
        >
          Solo icono
        </Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <BlockButton
            userId="4"
            userName="Usuario 1"
            style="icon"
            size="small"
          />
          <BlockButton
            userId="5"
            userName="Usuario 2"
            style="icon"
            size="medium"
          />
          <BlockButton
            userId="6"
            userName="Usuario 3"
            style="icon"
            size="large"
          />
        </View>
      </View>

      {/* Ejemplo solo texto */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            marginBottom: 10,
          }}
        >
          Solo texto
        </Text>
        <View style={{ flexDirection: 'column', gap: 10 }}>
          <BlockButton
            userId="7"
            userName="Usuario 4"
            style="text"
            size="small"
          />
          <BlockButton
            userId="8"
            userName="Usuario 5"
            style="text"
            size="medium"
            initialBlockedState={true}
          />
          <BlockButton
            userId="9"
            userName="Usuario 6"
            style="text"
            size="large"
          />
        </View>
      </View>

      {/* Ejemplo deshabilitado */}
      <View style={{ marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: Colors[colorScheme].text,
            marginBottom: 10,
          }}
        >
          Estados deshabilitados
        </Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <BlockButton
            userId="10"
            userName="Usuario 7"
            style="compact"
            disabled={true}
          />
          <BlockButton
            userId="11"
            userName="Usuario 8"
            style="compact"
            initialBlockedState={true}
            disabled={true}
          />
        </View>
      </View>
    </ScrollView>
  );
};
