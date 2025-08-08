import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const OtpList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadOtps = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (error) {return [];
    }
  }, []);

OtpList.displayName = 'OtpList';



  const renderOtpItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.code || 'Código OTP'}</Text>
          <Text
            style={[
              styles.statusText,
              {
                backgroundColor: item.isUsed
                  ? '#ff6b6b'
                  : item.isExpired
                    ? '#ffa726'
                    : Colors.light.tabIconSelected,
              },
            ]}
          >
            {item.isUsed ? 'Usado' : item.isExpired ? 'Expirado' : 'Activo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.purpose || 'Código de verificación temporal'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>
            {item.userEmail || item.phone || 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>
            {item.type === 'email'
              ? '📧 Email'
              : item.type === 'sms'
                ? '📲 SMS'
                : item.type === 'call'
                  ? '📞 Llamada'
                  : 'Desconocido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Propósito:</Text>
          <Text style={styles.value}>
            {item.purpose === 'registration'
              ? 'Registro'
              : item.purpose === 'login'
                ? 'Inicio de sesión'
                : item.purpose === 'password_reset'
                  ? 'Recuperar contraseña'
                  : item.purpose === 'verification'
                    ? 'Verificación'
                    : 'Otro'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Creado:</Text>
          <Text style={styles.value}>
            {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Expira:</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.isExpired ? '#ff6b6b' : Colors.light.text,
              },
            ]}
          >
            {item.expiresAt ? new Date(item.expiresAt).toLocaleString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Intentos:</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.attempts >= 3 ? '#ff6b6b' : Colors.light.text,
              },
            ]}
          >
            {item.attempts || 0} / {item.maxAttempts || 3}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>IP origen:</Text>
          <Text style={styles.value}>{item.originIp || 'N/A'}</Text>
        </View>

        {item.isUsed && item.usedAt && (
          <View style={styles.usageSection}>
            <Text style={styles.usageLabel}>Usado el:</Text>
            <Text style={styles.usageDate}>
              {new Date(item.usedAt).toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.otpId || item.code || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Códigos OTP'
      loadFunction={loadOtps}
      renderItem={renderOtpItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay códigos'
      emptyMessage='No se encontraron códigos OTP'
      loadingMessage='Cargando códigos OTP...'
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
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
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
  usageSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  usageLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  usageDate: {
    fontSize: FONT_SIZES.sm,
    color: '#ff6b6b',
    fontWeight: '600',
  },
});

export default OtpList;
