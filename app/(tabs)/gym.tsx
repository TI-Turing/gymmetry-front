import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useCustomAlert } from '@/components/auth/CustomAlert';

export default function GymScreen() {
  const { showSuccess, AlertComponent } = useCustomAlert();
  const [isConnectedToGym, setIsConnectedToGym] = useState(false);

  const handleScanQR = () => {
    showSuccess('Escáner QR', {
      confirmText: 'Abrir Escáner',
      onConfirm: () => {
        // Aquí abrir escáner QR
        setIsConnectedToGym(true);
      },
    });
  };

  const handleSearchGyms = () => {
    showSuccess('Buscar Gimnasios', {
      confirmText: 'Ver Lista',
      onConfirm: () => {
        // Aquí mostrar lista de gimnasios
        // Implementar navegación a lista de gimnasios
      },
    });
  };

  const renderNoGymView = () => (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>¡Conecta con tu Gym! 🏋️‍♂️</Text>
          <Text style={styles.headerSubtitle}>
            Vincula tu cuenta con un gimnasio para comenzar tu experiencia
          </Text>
        </View>

        {/* QR Scanner Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleScanQR}>
          <View style={styles.optionIcon}>
            <FontAwesome name='qrcode' size={32} color='#FF6B35' />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Escanear Código QR</Text>
            <Text style={styles.optionSubtitle}>
              Escanea el código QR disponible en tu gimnasio
            </Text>
          </View>
          <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
        </TouchableOpacity>

        {/* Search Gyms Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleSearchGyms}>
          <View style={styles.optionIcon}>
            <FontAwesome name='search' size={32} color='#4CAF50' />
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Buscar Gimnasios</Text>
            <Text style={styles.optionSubtitle}>
              Encuentra gimnasios cercanos a tu ubicación
            </Text>
          </View>
          <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
        </TouchableOpacity>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <FontAwesome name='info-circle' size={24} color='#2196F3' />
          <Text style={styles.infoText}>
            Una vez vinculado, podrás ver información en tiempo real del
            gimnasio, horarios, ocupación y mucho más.
          </Text>
        </View>
      </ScrollView>
      <AlertComponent />
    </View>
  );

  const renderGymView = () => (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gym Header */}
        <View style={styles.gymHeader}>
          <Text style={styles.gymName}>Smart Fit - Plaza Central</Text>
          <Text style={styles.gymAddress}>Calle 123 #45-67, Bogotá</Text>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <FontAwesome name='users' size={24} color='#FF6B35' />
            <Text style={styles.statusNumber}>47</Text>
            <Text style={styles.statusLabel}>Personas</Text>
            <Text style={styles.statusSubLabel}>Ahora en el gym</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <FontAwesome name='clock-o' size={24} color='#4CAF50' />
            <Text style={styles.statusNumber}>22:00</Text>
            <Text style={styles.statusLabel}>Cierre</Text>
            <Text style={styles.statusSubLabel}>Horario de hoy</Text>
          </View>
        </View>

        {/* Occupancy Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Ocupación del Día</Text>
          <View style={styles.chartContainer}>
            {/* Simulated chart bars */}
            {[30, 60, 80, 90, 70, 50, 40, 35].map((height, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${height}%`,
                      backgroundColor:
                        height > 70
                          ? '#F44336'
                          : height > 40
                            ? '#FF9800'
                            : '#4CAF50',
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>{`${6 + index * 2}:00`}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#4CAF50' }]}
              />
              <Text style={styles.legendText}>Bajo</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#FF9800' }]}
              />
              <Text style={styles.legendText}>Medio</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: '#F44336' }]}
              />
              <Text style={styles.legendText}>Alto</Text>
            </View>
          </View>
        </View>

        {/* Gym Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Información del Gimnasio</Text>
          <View style={styles.infoRow}>
            <FontAwesome name='phone' size={16} color='#B0B0B0' />
            <Text style={styles.infoDetail}>+57 1 234 5678</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name='clock-o' size={16} color='#B0B0B0' />
            <Text style={styles.infoDetail}>Lun - Dom: 5:00 AM - 10:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name='wifi' size={16} color='#B0B0B0' />
            <Text style={styles.infoDetail}>WiFi: SmartFit_Guest</Text>
          </View>
        </View>
      </ScrollView>
      <AlertComponent />
    </View>
  );

  return isConnectedToGym ? renderGymView() : renderNoGymView();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginLeft: 12,
  },
  gymHeader: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  gymName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  gymAddress: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  statusCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    width: 1,
    backgroundColor: '#333333',
    marginHorizontal: 20,
  },
  statusNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statusSubLabel: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#B0B0B0',
    transform: [{ rotate: '-45deg' }],
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDetail: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 12,
  },
});
