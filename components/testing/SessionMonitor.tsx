/* eslint-disable @typescript-eslint/no-explicit-any, expo/no-dynamic-env-var */
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
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services';

interface SessionVariable {
  key: string;
  value: any;
  type: string;
  lastUpdated?: Date;
  isValid: boolean;
  source: 'AsyncStorage' | 'Context' | 'Service' | 'Environment';
}

interface SessionMonitorProps {
  visible: boolean;
  onClose: () => void;
}

export function SessionMonitor({ visible, onClose }: SessionMonitorProps) {
  const [sessionVars, setSessionVars] = useState<SessionVariable[]>([]);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user, isAuthenticated } = useAuth();

  const inspectSessionVariables = React.useCallback(async () => {
    try {
      const variables: SessionVariable[] = [];

      // 1. Variables de Auth Context
      variables.push({
        key: 'Auth Context - isAuthenticated',
        value: isAuthenticated,
        type: 'boolean',
        lastUpdated: new Date(),
        isValid: typeof isAuthenticated === 'boolean',
        source: 'Context',
      });

      variables.push({
        key: 'Auth Context - user',
        value: user ? `ID: ${user.id}, Email: ${user.email}` : 'null',
        type: 'object',
        lastUpdated: new Date(),
        isValid: user !== null && user !== undefined,
        source: 'Context',
      });

      // 2. Variables de AsyncStorage críticas
      const criticalKeys = [
        '@auth_token',
        '@user_data',
        '@refresh_token',
        '@user_preferences',
        '@gym_selected',
        '@last_sync',
      ];

      for (const key of criticalKeys) {
        try {
          const value = await AsyncStorage.getItem(key);
          variables.push({
            key: `AsyncStorage - ${key}`,
            value: value
              ? value.length > 100
                ? `${value.substring(0, 100)}...`
                : value
              : 'null',
            type: value ? 'string' : 'null',
            lastUpdated: new Date(),
            isValid: key === '@auth_token' ? value !== null : true, // Token es crítico
            source: 'AsyncStorage',
          });
        } catch (error) {
          variables.push({
            key: `AsyncStorage - ${key}`,
            value: `Error: ${error}`,
            type: 'error',
            lastUpdated: new Date(),
            isValid: false,
            source: 'AsyncStorage',
          });
        }
      }

      // 3. Variables de AuthService
      try {
        const userData = await authService.getUserData();
        variables.push({
          key: 'AuthService - getUserData()',
          value: userData ? `ID: ${userData.id}` : 'null',
          type: 'object',
          lastUpdated: new Date(),
          isValid: userData !== null,
          source: 'Service',
        });
      } catch (error) {
        variables.push({
          key: 'AuthService - getUserData()',
          value: `Error: ${error}`,
          type: 'error',
          lastUpdated: new Date(),
          isValid: false,
          source: 'Service',
        });
      }

      // 4. Variables de Entorno críticas
      const envVars = [
        'EXPO_PUBLIC_ENV',
        'EXPO_PUBLIC_API_BASE_URL',
        'EXPO_PUBLIC_TESTING_MODE',
        'EXPO_PUBLIC_DEBUG_MODE',
      ];

      for (const key of envVars) {
        const value = process.env[key];
        variables.push({
          key: `Environment - ${key}`,
          value: value || 'undefined',
          type: 'string',
          lastUpdated: new Date(),
          isValid: value !== undefined,
          source: 'Environment',
        });
      }

      setSessionVars(variables);
    } catch (error) {
      // Development console log for debugging
      // eslint-disable-next-line no-console
      console.error('Error inspeccionando variables de sesión:', error);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (visible) {
      // Inspección inicial
      inspectSessionVariables();

      // Auto-refresh cada 3 segundos
      const interval = setInterval(inspectSessionVariables, 3000);
      refreshIntervalRef.current = interval as unknown as NodeJS.Timeout;

      return () => {
        if (interval) {
          clearInterval(interval);
        }
        refreshIntervalRef.current = null;
      };
    } else {
      // Limpiar interval existente cuando no esté visible
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    }

    // Cleanup general al desmontar
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [visible, inspectSessionVariables]);

  if (!visible) return null;

  const validVars = sessionVars.filter((v) => v.isValid);
  const invalidVars = sessionVars.filter((v) => !v.isValid);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.monitor}>
          <View style={styles.header}>
            <Text style={styles.title}>📊 Monitor de Variables de Sesión</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Resumen General */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Resumen</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Total: {sessionVars.length}
                </Text>
                <Text style={[styles.summaryValue, { color: '#00ff88' }]}>
                  Válidas: {validVars.length}
                </Text>
                <Text style={[styles.summaryValue, { color: '#ff6b6b' }]}>
                  Inválidas: {invalidVars.length}
                </Text>
              </View>
            </View>

            {/* Variables Inválidas/Críticas */}
            {invalidVars.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: '#ff6b6b' }]}>
                  ⚠️ Variables Críticas/Inválidas
                </Text>
                {invalidVars.map((variable, index) => (
                  <View
                    key={index}
                    style={[styles.variableCard, styles.invalidCard]}
                  >
                    <Text style={styles.variableName}>{variable.key}</Text>
                    <Text style={styles.variableValue}>
                      {String(variable.value)}
                    </Text>
                    <Text style={styles.variableMeta}>
                      Fuente: {variable.source} | Tipo: {variable.type}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Variables por Fuente */}
            {['Context', 'AsyncStorage', 'Service', 'Environment'].map(
              (source) => {
                const sourceVars = sessionVars.filter(
                  (v) => v.source === source
                );
                if (sourceVars.length === 0) return null;

                return (
                  <View key={source} style={styles.section}>
                    <Text style={styles.sectionTitle}>
                      {source === 'Context' && '🏠'}
                      {source === 'AsyncStorage' && '💾'}
                      {source === 'Service' && '🌐'}
                      {source === 'Environment' && '⚙️'}
                      {source}
                    </Text>
                    {sourceVars.map((variable, index) => (
                      <View key={index} style={styles.variableCard}>
                        <View style={styles.variableHeader}>
                          <Text style={styles.variableName}>
                            {variable.key.replace(`${source} - `, '')}
                          </Text>
                          <View
                            style={[
                              styles.statusIndicator,
                              {
                                backgroundColor: variable.isValid
                                  ? '#00ff88'
                                  : '#ff6b6b',
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.variableValue}>
                          {String(variable.value)}
                        </Text>
                        <Text style={styles.variableMeta}>
                          Tipo: {variable.type} | Actualizado:{' '}
                          {variable.lastUpdated?.toLocaleTimeString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              }
            )}

            {/* Botón de Refresh Manual */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={inspectSessionVariables}
            >
              <Text style={styles.refreshText}>🔄 Actualizar Variables</Text>
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
  monitor: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    width: '100%',
    maxHeight: '85%',
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
  summarySection: {
    marginBottom: 20,
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: '#cccccc',
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  variableCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#404040',
  },
  invalidCard: {
    borderColor: '#ff6b6b',
    backgroundColor: '#2d1a1a',
  },
  variableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  variableName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  variableValue: {
    color: '#00ff88',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  variableMeta: {
    color: '#888888',
    fontSize: 10,
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
