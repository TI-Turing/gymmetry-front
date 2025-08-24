import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { billService } from '@/services';

export function BillList() {
  const loadBills = useCallback(async () => {
    const response = await billService.getAllBills();
    return response.Data || [];
  }, []);

  const renderBillItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Factura {item.id?.slice(0, 8) || 'N/A'}
          </Text>
          <Text style={styles.statusText}>{item.status || 'Pendiente'}</Text>
        </View>

        <Text style={styles.amount}>Monto: ${item.amount || '0.00'}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title="Facturas"
      loadFunction={loadBills}
      renderItem={renderBillItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay facturas"
      emptyMessage="No se encontraron facturas registradas"
      loadingMessage="Cargando facturas..."
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
    backgroundColor: Colors.light.tabIconDefault,
    color: Colors.light.background,
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: Colors.light.tabIconSelected,
    marginBottom: SPACING.sm,
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
  description: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});

export default BillList;
