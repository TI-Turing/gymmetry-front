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
  }, [servicePlaceholder]);

  type NotificationOptionItem = {
    id?: string;
    optionId?: string;
    name?: string;
    optionName?: string;
    isEnabled?: boolean;
    description?: string;
    type?: string;
    channel?: 'email' | 'push' | 'sms' | 'app' | string;
    frequency?: 'immediate' | 'daily' | 'weekly' | string;
    priority?: 'high' | 'medium' | 'low' | string;
    activeUsers?: number | string;
    subscribedUsers?: number | string;
    preferredTime?: string;
    activeDays?: string[];
    createdAt?: string | number | Date;
    template?: string;
  };
  const renderNotificationOptionItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as NotificationOptionItem;
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {it.name || it.optionName || 'Opción de notificación'}
            </Text>
            <Text style={styles.statusText}>
              {it.isEnabled ? 'Habilitada' : 'Deshabilitada'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.description || 'Configuración de notificaciones'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{it.type || 'General'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Canal:</Text>
            <Text style={styles.value}>
              {it.channel === 'email'
                ? '📧 Email'
                : it.channel === 'push'
                  ? '📱 Push'
                  : it.channel === 'sms'
                    ? '📲 SMS'
                    : 'App'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Frecuencia:</Text>
            <Text style={styles.value}>
              {it.frequency === 'immediate'
                ? 'Inmediata'
                : it.frequency === 'daily'
                  ? 'Diaria'
                  : it.frequency === 'weekly'
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
                    it.priority === 'high'
                      ? '#FF6B35'
                      : it.priority === 'medium'
                        ? '#ffa726'
                        : '#ff6300',
                },
              ]}
            >
              {it.priority === 'high'
                ? 'Alta'
                : it.priority === 'medium'
                  ? 'Media'
                  : 'Baja'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Usuarios activos:</Text>
            <Text style={styles.value}>
              {it.activeUsers || it.subscribedUsers || '0'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Hora preferida:</Text>
            <Text style={styles.value}>
              {it.preferredTime || 'Cualquier hora'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Días activos:</Text>
            <Text style={styles.value}>
              {it.activeDays?.join(', ') || 'Todos los días'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Creada:</Text>
            <Text style={styles.value}>
              {it.createdAt
                ? new Date(it.createdAt).toLocaleDateString()
                : 'N/A'}
            </Text>
          </View>

          {it.template && (
            <View style={styles.templateSection}>
              <Text style={styles.templateLabel}>Plantilla:</Text>
              <Text style={styles.template} numberOfLines={2}>
                {it.template}
              </Text>
            </View>
          )}
        </View>
      );
    },
    []
  );

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as NotificationOptionItem;
    return it.id || it.optionId || String(Math.random());
  }, []);

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
