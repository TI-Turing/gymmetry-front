import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services';
import { jwtValidationUtils } from '@/utils/jwtValidationUtils';

interface TokenInfo {
  isValid: boolean;
  expiresAt?: Date;
  timeLeft?: string;
  userData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  tokenValue?: string;
  lastValidation?: Date;
}

interface FloatingTokenInspectorProps {
  visible: boolean;
  onClose: () => void;
}

export function FloatingTokenInspector({
  visible,
  onClose,
}: FloatingTokenInspectorProps) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const inspectToken = async () => {
    try {
      // 1. Obtener token del storage
      const token = await AsyncStorage.getItem('@auth_token');

      if (!token) {
        setTokenInfo({
          isValid: false,
          lastValidation: new Date(),
        });
        return;
      }

      // 2. Validar token con nuestras utilidades
      const validation = await jwtValidationUtils.validateStoredJWT();

      // 3. Obtener datos del usuario actual
      const userData = await authService.getUserData();

      // 4. Calcular tiempo restante
      let timeLeft = 'No disponible';
      let expiresAt: Date | undefined;

      if (validation.payload?.exp) {
        expiresAt = new Date(validation.payload.exp * 1000);
        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          timeLeft = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          timeLeft = 'EXPIRADO';
        }
      }

      setTokenInfo({
        isValid: validation.isValid,
        expiresAt,
        timeLeft,
        userData,
        tokenValue: `${token.substring(0, 20)}...${token.substring(token.length - 10)}`,
        lastValidation: new Date(),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inspeccionando token:', error);
      setTokenInfo({
        isValid: false,
        lastValidation: new Date(),
      });
    }
  };

  useEffect(() => {
    if (visible) {
      // Inspección inicial
      inspectToken();

      // Auto-refresh cada 5 segundos
      const interval = setInterval(inspectToken, 5000);
      refreshIntervalRef.current = interval as unknown as NodeJS.Timeout;

      return () => {
        if (interval) {
          clearInterval(interval);
        }
        refreshIntervalRef.current = null;
      };
    } else {
      // Si no está visible, limpiar cualquier interval existente
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Cleanup function para cuando el componente se desmonte
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.inspector}>
          <View style={styles.header}>
            <Text style={styles.title}>🔐 Inspector de Token JWT</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Estado General */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado General</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: tokenInfo?.isValid ? '#00ff88' : '#ff6b6b',
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {tokenInfo?.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}
                </Text>
              </View>
            </View>

            {/* Información de Tiempo */}
            {tokenInfo?.timeLeft && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tiempo Restante</Text>
                <Text
                  style={[
                    styles.timeText,
                    {
                      color:
                        tokenInfo.timeLeft === 'EXPIRADO'
                          ? '#ff6b6b'
                          : '#ffffff',
                    },
                  ]}
                >
                  {tokenInfo.timeLeft}
                </Text>
                {tokenInfo.expiresAt && (
                  <Text style={styles.subText}>
                    Expira: {tokenInfo.expiresAt.toLocaleString()}
                  </Text>
                )}
              </View>
            )}

            {/* Datos del Usuario */}
            {tokenInfo?.userData && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos del Usuario</Text>
                <Text style={styles.userData}>
                  ID: {tokenInfo.userData.id || 'No disponible'}
                </Text>
                <Text style={styles.userData}>
                  Email: {tokenInfo.userData.email || 'No disponible'}
                </Text>
                <Text style={styles.userData}>
                  Nombre: {tokenInfo.userData.firstName || 'No disponible'}
                </Text>
              </View>
            )}

            {/* Token Value */}
            {tokenInfo?.tokenValue && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Token (Resumido)</Text>
                <Text style={styles.tokenValue}>{tokenInfo.tokenValue}</Text>
              </View>
            )}

            {/* Metadatos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Metadatos</Text>
              <Text style={styles.metadata}>
                Última validación:{' '}
                {tokenInfo?.lastValidation?.toLocaleTimeString() || 'Nunca'}
              </Text>
            </View>

            {/* Botón de Refresh Manual */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={inspectToken}
            >
              <Text style={styles.refreshText}>🔄 Actualizar Ahora</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inspector: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%' as unknown as number,
    borderWidth: 1,
    borderColor: '#404040',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#404040',
  },
  closeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statusBadge: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#cccccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  userData: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 4,
  },
  tokenValue: {
    color: '#00ff88',
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: '#2d2d2d',
    padding: 8,
    borderRadius: 4,
  },
  metadata: {
    color: '#cccccc',
    fontSize: 12,
  },
  refreshButton: {
    backgroundColor: '#2d2d2d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
