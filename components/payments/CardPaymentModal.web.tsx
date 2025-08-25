import React, { useEffect } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { logger } from '@/utils';
import { makePaymentModalStyles } from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToken: (token: string) => void;
  publicKey?: string | null;
  buyerEmail?: string | null;
  amount?: number | null;
};

export default function CardPaymentModalWeb({
  visible,
  onClose,
  onToken,
  publicKey,
  buyerEmail,
  amount,
}: Props) {
  const styles = useThemedStyles(makePaymentModalStyles);
  useEffect(() => {
    if (visible && publicKey) {
      // Inicializar SDK React
      initMercadoPago(publicKey, { locale: 'es-CO' });
    }
  }, [visible, publicKey]);

  const initialization: { amount: number; payer: { email?: string } } = {
    amount: Math.max(1, Number(amount || 0)),
    payer: { email: buyerEmail || undefined },
  };

  const onSubmit = async (formData: unknown) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const fd = formData as Record<string, unknown> | null;
        const token =
          fd && typeof fd === 'object' && 'token' in fd
            ? (fd.token as unknown)
            : undefined;
        if (!token) {
          reject(new Error('No se generó token'));
          return;
        }
        onToken(String(token));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  const onReady = async () => {
    // opcional: ocultar loaders
  };

  const onError = async (err: unknown) => {
    logger.error('MP brick error', err);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Tarjeta (web)</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          {!publicKey ? (
            <View style={{ padding: 12 }}>
              <Text>
                Falta la clave pública de Mercado Pago. Configura
                EXPO_PUBLIC_MP_PUBLIC_KEY.
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1, padding: 16 }}>
              <CardPayment
                initialization={initialization}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onError}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
// styles via makePaymentModalStyles
