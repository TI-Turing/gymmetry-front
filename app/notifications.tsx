import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from '../components/useColorScheme';
import { NotificationsList } from '../components/notification/NotificationsListSimple';
import { NotificationSettingsPanel } from '../components/notification/NotificationSettings';
import { notificationService } from '../services/notificationServiceSimple';
import type { NotificationData } from '../services/notificationServiceSimple';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const [currentView, setCurrentView] = useState<'list' | 'settings'>('list');
  const [unreadCount, setUnreadCount] = useState(0);

  const styles = createStyles(colorScheme);

  // Cargar contador de no leídas al montar
  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Error loading notification count - handled silently
    }
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    // Marcar como leída si no lo está
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Navegar según el tipo de notificación
    switch (notification.type) {
      case 'like':
      case 'comment':
        // Navegar al post
        Alert.alert(
          'Navegación',
          `Navegar al post: ${notification.postTitle || 'Post'}`
        );
        break;
      case 'mention':
        // Navegar al comentario específico
        Alert.alert(
          'Navegación',
          `Navegar al comentario: ${notification.commentText || 'Comentario'}`
        );
        break;
      case 'follow':
        // Navegar al perfil del usuario
        Alert.alert(
          'Navegación',
          `Navegar al perfil de: ${notification.userName}`
        );
        break;
      case 'post':
        // Navegar al nuevo post
        Alert.alert(
          'Navegación',
          `Ver nueva publicación: ${notification.postTitle || 'Post'}`
        );
        break;
      default:
        Alert.alert('Info', 'Navegación no implementada para este tipo');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await loadUnreadCount();
    } catch (error) {
      Alert.alert('Error', 'No se pudo marcar como leída');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      Alert.alert(
        'Éxito',
        'Todas las notificaciones fueron marcadas como leídas'
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron marcar todas como leídas');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsSave = async (settings: any) => {
    try {
      await notificationService.updatePreferences(settings);
      Alert.alert('Éxito', 'Configuración guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la configuración');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header con navegación */}
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, currentView === 'list' && styles.activeTab]}
            onPress={() => setCurrentView('list')}
          >
            <Text
              style={[
                styles.tabText,
                currentView === 'list' && styles.activeTabText,
              ]}
            >
              Notificaciones
            </Text>
            {unreadCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentView === 'settings' && styles.activeTab]}
            onPress={() => setCurrentView('settings')}
          >
            <Text
              style={[
                styles.tabText,
                currentView === 'settings' && styles.activeTabText,
              ]}
            >
              Configuración
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        {currentView === 'list' ? (
          <NotificationsList
            onNotificationPress={handleNotificationPress}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        ) : (
          <NotificationSettingsPanel onSave={handleSettingsSave} />
        )}
      </View>
    </View>
  );
}

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    header: {
      backgroundColor: isDark ? '#111' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
      paddingTop: 50, // Para status bar
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#FF6B35',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#999' : '#666',
    },
    activeTabText: {
      color: '#FF6B35',
      fontWeight: '600',
    },
    tabBadge: {
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      paddingHorizontal: 4,
    },
    tabBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
  });
};
