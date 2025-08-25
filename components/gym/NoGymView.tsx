import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useCustomAlert } from '@/components/common/CustomAlert';
import QRScannerOption from './QRScannerOption';
import SearchGymsOption from './SearchGymsOption';
import RegisterGymOption from './RegisterGymOption';
import GymSearchModal from './GymSearchModal';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeNoGymViewStyles } from './styles/noGymView';
import { useI18n } from '@/i18n';

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
  const styles = useThemedStyles(makeNoGymViewStyles);
  const { t } = useI18n();

  const handleScanQR = () => {
    showSuccess(t('qr_scanner'), {
      confirmText: t('open_scanner'),
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

  const handleGymSelected = (_gym: unknown) => {
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
        <Text style={styles.headerTitle}>{t('connect_gym_title')}</Text>
        <Text style={styles.headerSubtitle}>{t('connect_gym_subtitle')}</Text>
      </View>

      {/* QR Scanner Option */}
      <QRScannerOption onPress={handleScanQR} />

      {/* Search Gyms Option */}
      <SearchGymsOption onPress={handleSearchGyms} />

      {/* Register Gym Option */}
      <RegisterGymOption onPress={handleRegisterGym} />

      {/* Info Card */}
      <View style={styles.infoCard}>
        <FontAwesome name="info-circle" size={24} color={styles.colors.info} />
        <Text style={styles.infoText}>{t('connect_gym_info')}</Text>
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
