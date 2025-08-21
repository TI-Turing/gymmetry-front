import React, { useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToken: (token: string) => void;
  publicKey?: string | null;
  buyerEmail?: string | null;
  amount?: number | null;
};

export default function CardPaymentModalWeb({ visible, onClose, onToken, publicKey, buyerEmail, amount }: Props) {
  useEffect(() => {
    if (visible && publicKey) {
      // Inicializar SDK React
      initMercadoPago(publicKey, { locale: 'es-CO' });
    }
  }, [visible, publicKey]);

  const initialization = {
    amount: Math.max(1, Number(amount || 0)),
    payer: { email: buyerEmail || undefined },
  } as any;

  const onSubmit = async (formData: any) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const token = (formData as any)?.token;
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
    console.error('MP brick error', err);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Tarjeta (web)</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.close}>Cerrar</Text></TouchableOpacity>
          </View>
          {!publicKey ? (
            <View style={{ padding: 12 }}>
              <Text>Falta la clave pública de Mercado Pago. Configura EXPO_PUBLIC_MP_PUBLIC_KEY.</Text>
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

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { height: '80%', backgroundColor: '#1a1a1a', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  close: { color: '#ff6b35', fontWeight: '600' },
});
