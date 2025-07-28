import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';

export default function ChatComponent() {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat Grupal</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholderText}>💬 Próximamente...</Text>
        <Text style={styles.descriptionText}>
          Aquí podrás chatear con otros miembros del gimnasio
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A', // Negro claro como antes
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1A1A1A', // Negro claro consistente
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    color: Colors.dark.tint,
    fontSize: 24,
    marginBottom: 8,
  },
  descriptionText: {
    color: '#B0B0B0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
