import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { paymentMethodService } from '@/services';

const PaymentMethodList = React.memo(() => {
  const loadPaymentMethods = useCallback(async () => {
    const response = await paymentMethodService.getAllPaymentMethods();
    return response.Data || [];
  }, []);

PaymentMethodList.displayName = 'PaymentMethodList';



  const renderPaymentMethodItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.methodName || 'Método sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>
            {item.type || item.paymentType || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Proveedor:</Text>
          <Text style={styles.value}>
            {item.provider || item.gateway || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Comisión:</Text>
          <Text style={styles.value}>{item.fee || 0}% por transacción</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Monedas:</Text>
          <Text style={styles.value}>
            {item.supportedCurrencies?.join(', ') || item.currency || 'USD'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transacciones:</Text>
          <Text style={styles.value}>
            {item.transactionCount || 0} procesadas
          </Text>
        </View>

        {item.minAmount && (
          <View style={styles.row}>
            <Text style={styles.label}>Monto mínimo:</Text>
            <Text style={styles.value}>${item.minAmount}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.methodId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Métodos de Pago'
      loadFunction={loadPaymentMethods}
      renderItem={renderPaymentMethodItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay métodos de pago'
      emptyMessage='No se encontraron métodos de pago configurados'
      loadingMessage='Cargando métodos de pago...'
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
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

export default PaymentMethodList;
