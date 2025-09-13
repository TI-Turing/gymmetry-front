import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useColorScheme } from '../useColorScheme';
import { NotificationsList } from './NotificationsListSimple';
import type { NotificationData } from '../../services/notificationServiceSimple';

interface NotificationButtonProps {
  unreadCount?: number;
  onNotificationPress?: (notification: NotificationData) => void;
  size?: number;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  unreadCount = 3,
  onNotificationPress,
  size = 24,
}) => {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const styles = createStyles(colorScheme, size);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleNotificationPress = (notification: NotificationData) => {
    onNotificationPress?.(notification);
    handleCloseModal();
  };

  return (
    <>
      {/* Botón de notificaciones */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenModal}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? '99+' : unreadCount.toString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal de notificaciones */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notificaciones</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <NotificationsList
            onNotificationPress={handleNotificationPress}
            maxHeight={600}
          />
        </View>
      </Modal>
    </>
  );
};

const createStyles = (colorScheme: 'light' | 'dark', size: number) => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    button: {
      position: 'relative',
      width: size + 8,
      height: size + 8,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: (size + 8) / 2,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
    },
    icon: {
      fontSize: size,
      color: isDark ? '#fff' : '#000',
    },
    badge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4,
      borderWidth: 2,
      borderColor: isDark ? '#000' : '#fff',
    },
    badgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
      backgroundColor: isDark ? '#111' : '#fff',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    closeButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
    },
    closeText: {
      color: '#FF6B35',
      fontSize: 16,
      fontWeight: '500',
    },
  });
};
