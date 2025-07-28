import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import OccupancyChart from './OccupancyChart';

export default function GymConnectedView() {
  return (
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
      <OccupancyChart />

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
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  infoCard: {
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
