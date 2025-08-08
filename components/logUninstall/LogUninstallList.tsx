import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const LogUninstallList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadLogUninstalls = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (error) {return [];
    }
  }, []);

LogUninstallList.displayName = 'LogUninstallList';



  const renderLogUninstallItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Desinstalación #{item.id || 'N/A'}</Text>
          <Text style={styles.statusText}>
            {item.status === 'completed'
              ? 'Completado'
              : item.status === 'failed'
                ? 'Fallido'
                : 'En proceso'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.reason || 'Registro de desinstalación de la aplicación'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>
            {item.userName || item.userId || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dispositivo:</Text>
          <Text style={styles.value}>
            {item.device === 'android'
              ? '🤖 Android'
              : item.device === 'ios'
                ? '🍎 iOS'
                : item.device === 'web'
                  ? '🌐 Web'
                  : item.device || 'Desconocido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Versión app:</Text>
          <Text style={styles.value}>{item.appVersion || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.uninstallDate || item.createdAt
              ? new Date(item.uninstallDate || item.createdAt).toLocaleString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Motivo principal:</Text>
          <Text style={styles.value}>
            {item.primaryReason === 'bugs'
              ? '🐛 Errores/Bugs'
              : item.primaryReason === 'performance'
                ? '⚡ Rendimiento'
                : item.primaryReason === 'features'
                  ? '🔧 Faltan funciones'
                  : item.primaryReason === 'design'
                    ? '🎨 Diseño'
                    : item.primaryReason === 'price'
                      ? '💰 Precio'
                      : item.primaryReason === 'competitor'
                        ? '🏆 Competencia'
                        : item.primaryReason || 'Otro'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tiempo de uso:</Text>
          <Text style={styles.value}>
            {item.usageDays
              ? `${item.usageDays} días`
              : item.usageHours
                ? `${item.usageHours} horas`
                : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Valoración:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.rating >= 4
                    ? '#4caf50'
                    : item.rating >= 2
                      ? '#ffa726'
                      : '#ff6b6b',
              },
            ]}
          >
            {item.rating
              ? `${'⭐'.repeat(item.rating)} (${item.rating}/5)`
              : 'Sin valorar'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Plataforma:</Text>
          <Text style={styles.value}>{item.platform || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>IP origen:</Text>
          <Text style={styles.value}>{item.ipAddress || 'N/A'}</Text>
        </View>

        {item.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackLabel}>Comentarios:</Text>
            <Text style={styles.feedback} numberOfLines={3}>
              {item.feedback}
            </Text>
          </View>
        )}

        {item.suggestions && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsLabel}>Sugerencias:</Text>
            <Text style={styles.suggestions} numberOfLines={2}>
              {item.suggestions}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.logId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Logs de Desinstalación'
      loadFunction={loadLogUninstalls}
      renderItem={renderLogUninstallItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay logs'
      emptyMessage='No se encontraron logs de desinstalación'
      loadingMessage='Cargando logs...'
    />
  );
}

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
    minWidth: 120,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  feedbackSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  feedbackLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  feedback: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    backgroundColor: Colors.light.tabIconDefault + '10',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  suggestionsSection: {
    marginTop: SPACING.sm,
  },
  suggestionsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  suggestions: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontStyle: 'italic',
    backgroundColor: '#e3f2fd',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
});

export default LogUninstallList;
