import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenWrapper from '@/components/layout/ScreenWrapper';

export default function CreatePostRoute() {
  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper
      headerTitle="Crear Publicación"
      showBackButton={true}
      onPressBack={handleBack}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Pantalla de Crear Post</Text>
        <Text style={styles.subtitle}>¡Navegación exitosa!</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});