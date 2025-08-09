import React from 'react';
import { StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { View, Text } from '@/components/Themed';
import { RoutineDayDetail } from '@/components/routineDay/RoutineDayDetail';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function RoutineDayDetailScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="times" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Rutina</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Contenido */}
      <View style={styles.content}>
        <RoutineDayDetail />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40, // Para centrar el título
  },
  content: {
    flex: 1,
  },
});
