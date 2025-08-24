import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function SignalRList() {
  type SignalRItem = {
    id?: string;
    status?: string;
    connectionId?: string;
    userId?: string;
    connectedAt?: string | number | Date;
  };
  const loadSignalRItems = useCallback(async () => {
    // SignalR es un servicio de comunicación en tiempo real, no tiene listado
    return [];
  }, []);

  const renderSignalRItem = useCallback(
    ({ item }: { item: SignalRItem }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Conexión {item.id?.slice(0, 8) || 'N/A'}
          </Text>
          <Text style={styles.statusText}>{item.status || 'Conectado'}</Text>
        </View>

        <Text style={styles.connectionId}>
          ID: {item.connectionId || 'N/A'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{item.userId || 'Anónimo'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Conectado:</Text>
          <Text style={styles.value}>
            {item.connectedAt
              ? new Date(item.connectedAt).toLocaleString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: SignalRItem) => item.connectionId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Conexiones SignalR"
      loadFunction={loadSignalRItems}
      renderItem={renderSignalRItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay conexiones activas"
      emptyMessage="No se encontraron conexiones SignalR"
      loadingMessage="Cargando conexiones..."
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
  connectionId: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    fontFamily: 'monospace',
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
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
  },
});

export default SignalRList;
