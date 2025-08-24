import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { paymentMethodService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePaymentMethodStyles } from './styles.themed';

const PaymentMethodList = React.memo(() => {
  const loadPaymentMethods = useCallback(async () => {
    const response = await paymentMethodService.getAllPaymentMethods();
    return response || [];
  }, []);

  const styles = useThemedStyles(makePaymentMethodStyles);

  type PaymentMethodItem = {
    id?: string;
    methodId?: string;
    name?: string;
    methodName?: string;
    isActive?: boolean;
    description?: string;
    type?: string;
    paymentType?: string;
    provider?: string;
    gateway?: string;
    fee?: number;
    supportedCurrencies?: string[];
    currency?: string;
    transactionCount?: number;
    minAmount?: number;
  };
  const renderPaymentMethodItem = useCallback(
    ({ item }: { item: unknown }) => {
      const it = (item || {}) as PaymentMethodItem;
      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {it.name || it.methodName || 'Método sin nombre'}
            </Text>
            <Text style={styles.statusText}>
              {it.isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>

          <Text style={styles.description}>
            {it.description || 'Sin descripción disponible'}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>
              {it.type || it.paymentType || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Proveedor:</Text>
            <Text style={styles.value}>
              {it.provider || it.gateway || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Comisión:</Text>
            <Text style={styles.value}>{it.fee || 0}% por transacción</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Monedas:</Text>
            <Text style={styles.value}>
              {it.supportedCurrencies?.join(', ') || it.currency || 'USD'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transacciones:</Text>
            <Text style={styles.value}>
              {it.transactionCount || 0} procesadas
            </Text>
          </View>

          {it.minAmount && (
            <View style={styles.row}>
              <Text style={styles.label}>Monto mínimo:</Text>
              <Text style={styles.value}>${it.minAmount}</Text>
            </View>
          )}
        </View>
      );
    },
    [styles]
  );

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as PaymentMethodItem;
    return it.id || it.methodId || String(Math.random());
  }, []);

  return (
    <EntityList
      title="Métodos de Pago"
      loadFunction={loadPaymentMethods}
      renderItem={renderPaymentMethodItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay métodos de pago"
      emptyMessage="No se encontraron métodos de pago configurados"
      loadingMessage="Cargando métodos de pago..."
    />
  );
});

PaymentMethodList.displayName = 'PaymentMethodList';

export default PaymentMethodList;
