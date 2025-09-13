import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';

// Tipos de notificaciones
type NotificationType = 'like' | 'comment' | 'mention' | 'follow' | 'post';

interface NotificationItem {
  id: string;
  type: NotificationType;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  postTitle?: string;
  commentText?: string;
}

interface NotificationsListProps {
  onNotificationPress?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  maxHeight?: number;
}

// Mock data para notificaciones
const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'like',
    userId: 'user1',
    userName: 'Ana García',
    targetType: 'post',
    targetId: 'post1',
    message: 'le dio like a tu publicación',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
    isRead: false,
    postTitle: 'Mi rutina de piernas 🔥',
  },
  {
    id: '2',
    type: 'comment',
    userId: 'user2',
    userName: 'Carlos Ruiz',
    targetType: 'post',
    targetId: 'post2',
    message: 'comentó en tu publicación',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    isRead: false,
    postTitle: 'Entrenamiento de pecho',
    commentText: '¡Excelente rutina! ¿Cuántas series recomiendas?',
  },
  {
    id: '3',
    type: 'mention',
    userId: 'user3',
    userName: 'María López',
    targetType: 'comment',
    targetId: 'comment1',
    message: 'te mencionó en un comentario',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
    isRead: true,
    commentText: '@tuUsuario mira esta rutina increíble',
  },
  {
    id: '4',
    type: 'follow',
    userId: 'user4',
    userName: 'Pedro Martín',
    targetType: 'user',
    targetId: 'currentUser',
    message: 'comenzó a seguirte',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: true,
  },
  {
    id: '5',
    type: 'post',
    userId: 'user5',
    userName: 'Laura Sánchez',
    targetType: 'post',
    targetId: 'post3',
    message: 'publicó una nueva rutina',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    postTitle: 'Rutina HIIT para quemar grasa',
  },
];

export const NotificationsList: React.FC<NotificationsListProps> = ({
  onNotificationPress,
  onMarkAsRead,
  onMarkAllAsRead,
  maxHeight = 400,
}) => {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(mockNotifications);
  const [_isLoading, _setIsLoading] = useState(false);

  const styles = createStyles(colorScheme);

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Formatear tiempo relativo
  const formatTimeAgo = useCallback((date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
    });
  }, []);

  // Obtener icono por tipo de notificación
  const getNotificationIcon = useCallback((type: NotificationType): string => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'mention':
        return '@';
      case 'follow':
        return '👤';
      case 'post':
        return '📝';
      default:
        return '🔔';
    }
  }, []);

  // Marcar como leída
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      onMarkAsRead?.(notificationId);
    },
    [onMarkAsRead]
  );

  // Marcar todas como leídas
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  // Manejar tap en notificación
  const handleNotificationPress = useCallback(
    (notification: NotificationItem) => {
      if (!notification.isRead) {
        handleMarkAsRead(notification.id);
      }
      onNotificationPress?.(notification);
    },
    [onNotificationPress, handleMarkAsRead]
  );

  // Renderizar item de notificación
  const renderNotificationItem = useCallback(
    ({ item }: { item: NotificationItem }) => {
      const icon = getNotificationIcon(item.type);
      const timeAgo = formatTimeAgo(item.timestamp);

      return (
        <TouchableOpacity
          style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
          onPress={() => handleNotificationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.notificationContent}>
            {/* Icono y indicador no leída */}
            <View style={styles.iconContainer}>
              <Text style={styles.notificationIcon}>{icon}</Text>
              {!item.isRead && <View style={styles.unreadDot} />}
            </View>

            {/* Contenido principal */}
            <View style={styles.textContainer}>
              <Text
                style={[
                  styles.notificationText,
                  !item.isRead && styles.unreadText,
                ]}
              >
                <Text style={styles.userName}>{item.userName}</Text>{' '}
                <Text style={styles.actionText}>{item.message}</Text>
              </Text>

              {/* Texto adicional según tipo */}
              {item.postTitle && (
                <Text style={styles.targetText} numberOfLines={1}>
                  "{item.postTitle}"
                </Text>
              )}
              {item.commentText && (
                <Text style={styles.commentPreview} numberOfLines={2}>
                  {item.commentText}
                </Text>
              )}

              {/* Timestamp */}
              <Text style={styles.timestamp}>{timeAgo}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [styles, getNotificationIcon, formatTimeAgo, handleNotificationPress]
  );

  return (
    <View style={[styles.container, { maxHeight }]}>
      {/* Header con contador y acciones */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Notificaciones</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de notificaciones */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No hay notificaciones</Text>
          <Text style={styles.emptyText}>
            Cuando tengas nuevas actividades aparecerán aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
    </View>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#000' : '#fff',
      borderRadius: 12,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginRight: 8,
    },
    badge: {
      backgroundColor: '#FF6B35',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 6,
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    markAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
    },
    markAllText: {
      color: '#FF6B35',
      fontSize: 14,
      fontWeight: '500',
    },
    notificationItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#222' : '#f8f8f8',
    },
    unreadItem: {
      backgroundColor: isDark ? '#111' : '#fafafa',
    },
    notificationContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      position: 'relative',
      marginRight: 12,
      alignItems: 'center',
    },
    notificationIcon: {
      fontSize: 20,
      width: 24,
      textAlign: 'center',
    },
    unreadDot: {
      position: 'absolute',
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FF6B35',
    },
    textContainer: {
      flex: 1,
    },
    notificationText: {
      fontSize: 14,
      lineHeight: 20,
      color: isDark ? '#ccc' : '#666',
      marginBottom: 4,
    },
    unreadText: {
      color: isDark ? '#fff' : '#000',
    },
    userName: {
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    actionText: {
      color: isDark ? '#ccc' : '#666',
    },
    targetText: {
      fontSize: 13,
      color: '#FF6B35',
      fontStyle: 'italic',
      marginBottom: 4,
    },
    commentPreview: {
      fontSize: 13,
      color: isDark ? '#999' : '#777',
      fontStyle: 'italic',
      marginBottom: 4,
      paddingLeft: 8,
      borderLeftWidth: 2,
      borderLeftColor: isDark ? '#444' : '#ddd',
    },
    timestamp: {
      fontSize: 12,
      color: isDark ? '#666' : '#999',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? '#999' : '#666',
      textAlign: 'center',
      lineHeight: 20,
    },
  });
};
