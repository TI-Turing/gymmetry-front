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
    [styles]
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.methodId || String(Math.random()),
    []
  );

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
