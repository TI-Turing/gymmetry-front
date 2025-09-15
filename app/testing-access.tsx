import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function TestingAccess() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🧪 Framework de Testing</Text>
        <Text style={styles.subtitle}>
          Herramientas de testing integral para Gymmetry
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/testing-dashboard')}
          >
            <Text style={styles.primaryButtonText}>
              🚀 Abrir Dashboard de Testing
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/debug-auth')}
          >
            <Text style={styles.secondaryButtonText}>
              🔐 Debug de Autenticación
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📋 Qué incluye:</Text>
          <Text style={styles.infoItem}>
            • 61 casos de prueba automatizados
          </Text>
          <Text style={styles.infoItem}>
            • Simulación de condiciones de red
          </Text>
          <Text style={styles.infoItem}>
            • Testing de performance y memoria
          </Text>
          <Text style={styles.infoItem}>• Validación de rutinas y timers</Text>
          <Text style={styles.infoItem}>
            • Reportes detallados con métricas
          </Text>
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            ⚠️ Solo disponible en modo desarrollo
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#ff6300',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff6300',
  },
  secondaryButtonText: {
    color: '#ff6300',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  warningContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
