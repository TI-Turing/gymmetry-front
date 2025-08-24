import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const NotificationOptionList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadNotificationOptions = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, []);

  const renderNotificationOptionItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.optionName || 'Opción de notificación'}
          </Text>
          <Text style={styles.statusText}>
            {item.isEnabled ? 'Habilitada' : 'Deshabilitada'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Configuración de notificaciones'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{item.type || 'General'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Canal:</Text>
          <Text style={styles.value}>
            {item.channel === 'email'
              ? '📧 Email'
              : item.channel === 'push'
                ? '📱 Push'
                : item.channel === 'sms'
                  ? '📲 SMS'
                  : 'App'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Frecuencia:</Text>
          <Text style={styles.value}>
            {item.frequency === 'immediate'
              ? 'Inmediata'
              : item.frequency === 'daily'
                ? 'Diaria'
                : item.frequency === 'weekly'
                  ? 'Semanal'
                  : 'Personalizada'}
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
                      : '#ff6300',
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
          <Text style={styles.label}>Usuarios activos:</Text>
          <Text style={styles.value}>
            {item.activeUsers || item.subscribedUsers || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hora preferida:</Text>
          <Text style={styles.value}>
            {item.preferredTime || 'Cualquier hora'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Días activos:</Text>
          <Text style={styles.value}>
            {item.activeDays?.join(', ') || 'Todos los días'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Creada:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        {item.template && (
          <View style={styles.templateSection}>
            <Text style={styles.templateLabel}>Plantilla:</Text>
            <Text style={styles.template} numberOfLines={2}>
              {item.template}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.optionId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Opciones de Notificación"
      loadFunction={loadNotificationOptions}
      renderItem={renderNotificationOptionItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay opciones"
      emptyMessage="No se encontraron opciones de notificación"
      loadingMessage="Cargando opciones..."
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
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  templateSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  templateLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  template: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    backgroundColor: Colors.light.tabIconDefault + '10',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
});

NotificationOptionList.displayName = 'NotificationOptionList';

export default NotificationOptionList;
