import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useCustomAlert } from '@/components/common/CustomAlert';
import QRScannerOption from './QRScannerOption';
import SearchGymsOption from './SearchGymsOption';
import RegisterGymOption from './RegisterGymOption';
import GymSearchModal from './GymSearchModal';

interface NoGymViewProps {
  onConnect: (connected: boolean) => void;
  onRegisterGym?: () => void;
}

export default function NoGymView({
  onConnect,
  onRegisterGym,
}: NoGymViewProps) {
  const { showSuccess } = useCustomAlert();
  const [showGymSearchModal, setShowGymSearchModal] = useState(false);

  const handleScanQR = () => {
    showSuccess('Escáner QR', {
      confirmText: 'Abrir Escáner',
      onConfirm: () => {
        // Aquí abrir escáner QR
        onConnect(true);
      },
    });
  };

  const handleSearchGyms = () => {
    setShowGymSearchModal(true);
  };

  const handleRegisterGym = () => {
    if (onRegisterGym) {
      onRegisterGym();
    }
  };

  const handleGymSelected = (gym: any) => {
    // Aquí se podría manejar la selección del gym
    // Por ejemplo, actualizar el estado del usuario
    onConnect(true);
  };

  return (
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
      <QRScannerOption onPress={handleScanQR} />

      {/* Search Gyms Option */}
      <SearchGymsOption onPress={handleSearchGyms} />

      {/* Register Gym Option */}
      <RegisterGymOption onPress={handleRegisterGym} />

      {/* Info Card */}
      <View style={styles.infoCard}>
        <FontAwesome name='info-circle' size={24} color='#2196F3' />
        <Text style={styles.infoText}>
          Una vez vinculado, podrás ver información en tiempo real del gimnasio,
          horarios, ocupación y mucho más.
        </Text>
      </View>

      {/* Gym Search Modal */}
      <GymSearchModal
        visible={showGymSearchModal}
        onClose={() => setShowGymSearchModal(false)}
        onGymSelected={handleGymSelected}
      />
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
});
