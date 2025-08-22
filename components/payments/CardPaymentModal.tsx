import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToken: (token: string) => void;
  onFallbackToExternal?: () => void;
  publicKey?: string | null;
  buyerEmail?: string | null;
  amount?: number | null;
};

export default function CardPaymentModal({ visible, onClose, onFallbackToExternal }: Props) {
  const [mpUri, setMpUri] = React.useState<string | null>(null);
  const [ppUri, setPpUri] = React.useState<string | null>(null);
  const [stUri, setStUri] = React.useState<string | null>(null);
  const [pseUri, setPseUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
  const load = async () => {
      try {
  const mpMod = require('../../assets/icons/mercadoPago.svg');
  const ppMod = require('../../assets/icons/paypal.svg');
  const stMod = require('../../assets/icons/stripe.svg');
  const pseMod = require('../../assets/icons/pse.png');
  await Asset.loadAsync([mpMod, ppMod, stMod, pseMod]);
    const mp = Asset.fromModule(mpMod);
    const pp = Asset.fromModule(ppMod);
    const st = Asset.fromModule(stMod);
  const pse = Asset.fromModule(pseMod);
        if (!mounted) return;
        setMpUri(mp.localUri || mp.uri);
        setPpUri(pp.localUri || pp.uri);
        setStUri(st.localUri || st.uri);
  setPseUri(pse.localUri || pse.uri);
      } catch {}
    };
    if (visible) load();
    return () => { mounted = false; };
  }, [visible]);
  const handleMercadoPago = () => {
    if (onFallbackToExternal) {
      onClose();
      onFallbackToExternal();
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Pasarelas de pago</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {/* Mercado Pago - opción principal */}
            <TouchableOpacity activeOpacity={0.85} style={[styles.methodCard, styles.methodCardPrimary, styles.methodCardRow]} onPress={handleMercadoPago}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap} accessibilityLabel="Mercado Pago">
                  {mpUri ? (
                    <SvgUri uri={mpUri} width={24} height={24} />
                  ) : (
                    <FontAwesome name="credit-card" size={16} color="#000" />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitle}>Mercado Pago</Text>
                  <Text style={styles.methodSubtitle}>Tarjeta o PSE por redirección</Text>
                </View>
              </View>
              <View>
                <View style={styles.primaryPill}><Text style={styles.primaryButtonText}>Continuar</Text></View>
              </View>
            </TouchableOpacity>

            {/* PSE (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {pseUri ? (
                    <Image source={{ uri: pseUri }} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
                  ) : (
                    <FontAwesome name="university" size={16} color="#999" />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PSE</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
            </View>

            {/* PayU (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {/* PNG logo with Image as fallback when Svg not available */}
                  <Image
                    source={require('../../assets/icons/PAYU_GPO_white.png')}
                    style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: '#ccc' }}
                  />
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PayU</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
            </View>

            {/* PayPal (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap} accessibilityLabel="PayPal">
                  {ppUri ? (
                    <SvgUri uri={ppUri} width={24} height={24} />
                  ) : (
                    <FontAwesome name="cc-paypal" size={16} color="#999" />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PayPal</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
            </View>

            {/* Stripe (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {stUri ? (
                    <SvgUri uri={stUri} width={24} height={24} />
                  ) : (
                    <FontAwesome name="cc-stripe" size={16} color="#999" />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>Stripe</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}><Text style={styles.badgeText}>Pronto</Text></View>
            </View>

            <Text style={styles.footerNote}>El formulario embebido de tarjeta está disponible solo en Web por ahora.</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { height: '70%', backgroundColor: '#1a1a1a', borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600' },
  close: { color: '#ff6b35', fontWeight: '600' },
  body: { flex: 1, padding: 16, gap: 12 },
  methodCard: { backgroundColor: '#111', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 12 },
  methodCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  methodCardPrimary: { borderColor: Colors.light.tint },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  methodIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#222', alignItems: 'center', justifyContent: 'center' },
  brandMonogram: { color: '#fff', fontWeight: '900', fontSize: 12 },
  methodTexts: { flex: 1, flexShrink: 1, minWidth: 0 },
  methodTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  methodTitleDisabled: { color: '#999', fontSize: 15, fontWeight: '600' },
  methodSubtitle: { color: '#aaa', fontSize: 12, marginTop: 2, flexWrap: 'wrap', lineHeight: 16 },
  primaryButtonText: { color: '#000', fontWeight: '700' },
  primaryPill: { backgroundColor: Colors.light.tint, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  methodCardDisabled: { backgroundColor: '#0f0f0f', borderWidth: 1, borderColor: '#222', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  badge: { backgroundColor: '#222', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  badgeText: { color: '#bbb', fontSize: 12 },
  footerNote: { color: '#888', fontSize: 12, textAlign: 'center', marginTop: 8 }
});
