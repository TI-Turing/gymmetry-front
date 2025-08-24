import React from 'react';
import { Modal, View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import SmartImage from '@/components/common/SmartImage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePaymentModalStyles } from './styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onToken: (token: string) => void;
  onFallbackToExternal?: () => void;
  publicKey?: string | null;
  buyerEmail?: string | null;
  amount?: number | null;
};

export default function CardPaymentModal({
  visible,
  onClose,
  onFallbackToExternal,
}: Props) {
  const styles = useThemedStyles(makePaymentModalStyles);
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
    return () => {
      mounted = false;
    };
  }, [visible]);
  const handleMercadoPago = () => {
    if (onFallbackToExternal) {
      onClose();
      onFallbackToExternal();
    }
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
            <Text style={styles.title}>Pasarelas de pago</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            {/* Mercado Pago - opción principal */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.methodCard,
                styles.methodCardPrimary,
                styles.methodCardRow,
              ]}
              onPress={handleMercadoPago}
            >
              <View style={styles.methodLeft}>
                <View
                  style={styles.methodIconWrap}
                  accessibilityLabel="Mercado Pago"
                >
                  {mpUri ? (
                    <SvgUri uri={mpUri} width={24} height={24} />
                  ) : (
                    <FontAwesome
                      name="credit-card"
                      size={16}
                      color={styles.brandMonogram.color as string}
                    />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitle}>Mercado Pago</Text>
                  <Text style={styles.methodSubtitle}>
                    Tarjeta o PSE por redirección
                  </Text>
                </View>
              </View>
              <View>
                <View style={styles.primaryPill}>
                  <Text style={styles.primaryButtonText}>Continuar</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* PSE (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {pseUri ? (
                    <SmartImage
                      uri={pseUri}
                      style={{ width: 24, height: 24 }}
                      deferOnDataSaver
                    />
                  ) : (
                    <FontAwesome
                      name="university"
                      size={16}
                      color={Colors.light.tabIconDefault}
                    />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PSE</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pronto</Text>
              </View>
            </View>

            {/* PayU (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {/* PNG logo with Image as fallback when Svg not available */}
                  <Image
                    source={require('../../assets/icons/PAYU_GPO_white.png')}
                    style={{
                      width: 24,
                      height: 24,
                      resizeMode: 'contain',
                      tintColor: Colors.light.tabIconDefault,
                    }}
                  />
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PayU</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pronto</Text>
              </View>
            </View>

            {/* PayPal (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap} accessibilityLabel="PayPal">
                  {ppUri ? (
                    <SvgUri uri={ppUri} width={24} height={24} />
                  ) : (
                    <FontAwesome
                      name="cc-paypal"
                      size={16}
                      color={Colors.light.tabIconDefault}
                    />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>PayPal</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pronto</Text>
              </View>
            </View>

            {/* Stripe (deshabilitado) */}
            <View style={styles.methodCardDisabled}>
              <View style={styles.methodLeft}>
                <View style={styles.methodIconWrap}>
                  {stUri ? (
                    <SvgUri uri={stUri} width={24} height={24} />
                  ) : (
                    <FontAwesome
                      name="cc-stripe"
                      size={16}
                      color={Colors.light.tabIconDefault}
                    />
                  )}
                </View>
                <View style={styles.methodTexts}>
                  <Text style={styles.methodTitleDisabled}>Stripe</Text>
                  <Text style={styles.methodSubtitle}>Próximamente</Text>
                </View>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Pronto</Text>
              </View>
            </View>

            <Text style={styles.footerNote}>
              El formulario embebido de tarjeta está disponible solo en Web por
              ahora.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// styles via makePaymentModalStyles
