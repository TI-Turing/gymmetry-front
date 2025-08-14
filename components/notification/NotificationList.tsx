import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const NotificationList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadNotifications = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {return [];
  }
  }, []);

  const renderNotificationItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || item.subject || 'Notificación'}
          </Text>
          <Text style={styles.statusText}>
            {item.isRead ? 'Leída' : 'Nueva'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.message || item.body || 'Sin mensaje'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>
            {item.type || item.category || 'General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Prioridad:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.priority === 'high'
                    ? '#FF6B35'
                    : item.priority === 'medium'
                      ? '#ffa726'
                      : Colors.light.text
  },
            ]}
          >
            {item.priority === 'high'
              ? 'Alta'
              : item.priority === 'medium'
                ? 'Media'
                : 'Baja'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Remitente:</Text>
          <Text style={styles.value}>
            {item.sender || item.from || 'Sistema'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Destinatario:</Text>
          <Text style={styles.value}>{item.recipient || item.to || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Canal:</Text>
          <Text style={styles.value}>{item.channel || 'App'}</Text>
        </View>

        {item.actionRequired && (
          <View style={styles.actionSection}>
            <Text style={styles.actionText}>⚠️ Acción requerida</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.notificationId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Notificaciones'
      loadFunction={loadNotifications}
      renderItem={renderNotificationItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay notificaciones'
      emptyMessage='No se encontraron notificaciones'
      loadingMessage='Cargando notificaciones...'
    />
  );
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 100
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1
  },
  actionSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: '#FF6B35',
    fontWeight: '600',
    textAlign: 'center'

}});

NotificationList.displayName = 'NotificationList';

export default NotificationList;
