import React from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import OccupancyChart from './OccupancyChart';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymConnectedViewStyles } from './styles/gymConnectedView';

export default function GymConnectedView() {
  const { styles, colors } = useThemedStyles(makeGymConnectedViewStyles);
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
          <FontAwesome name="users" size={24} color={colors.tint} />
          <Text style={styles.statusNumber}>47</Text>
          <Text style={styles.statusLabel}>Personas</Text>
          <Text style={styles.statusSubLabel}>Ahora en el gym</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <FontAwesome name="clock-o" size={24} color={colors.success} />
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
          <FontAwesome name="phone" size={16} color={colors.muted} />
          <Text style={styles.infoDetail}>+57 1 234 5678</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={16} color={colors.muted} />
          <Text style={styles.infoDetail}>Lun - Dom: 5:00 AM - 10:00 PM</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesome name="wifi" size={16} color={colors.muted} />
          <Text style={styles.infoDetail}>WiFi: SmartFit_Guest</Text>
        </View>
      </View>
    </ScrollView>
  );
}
