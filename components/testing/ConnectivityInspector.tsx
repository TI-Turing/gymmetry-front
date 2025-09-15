/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ConnectivityState {
  isConnected: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  timestamp: number;
}

interface LatencyTest {
  url: string;
  startTime: number;
  endTime: number;
  latency: number;
  success: boolean;
  error?: string;
  timestamp: number;
}

interface ConnectivityInspectorProps {
  visible: boolean;
  onClose: () => void;
}

export function ConnectivityInspector({
  visible,
  onClose,
}: ConnectivityInspectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [connectivityHistory, setConnectivityHistory] = useState<
    ConnectivityState[]
  >([]);
  const [latencyTests, setLatencyTests] = useState<LatencyTest[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [slowConnectionMode, setSlowConnectionMode] = useState(false);
  const [autoLatencyTest, setAutoLatencyTest] = useState(false);

  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latencyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const originalFetch = useRef<typeof fetch | null>(null);

  // Detectar conexión usando Navigator API
  const detectConnection = (): ConnectivityState => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      isConnected: navigator.onLine,
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false,
      timestamp: Date.now(),
    };
  };

  // Ejecutar test de latencia
  const runLatencyTest = async (
    url: string = process.env.EXPO_PUBLIC_API_BASE_URL ||
      'https://jsonplaceholder.typicode.com/posts/1'
  ): Promise<LatencyTest> => {
    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache',
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      return {
        url,
        startTime,
        endTime,
        latency,
        success: response.ok,
        timestamp: Date.now(),
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        url,
        startTime,
        endTime,
        latency: endTime - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
      };
    }
  };

  // Simular conexión lenta
  const simulateSlowConnection = React.useCallback(() => {
    if (!originalFetch.current) {
      originalFetch.current = global.fetch;
    }

    if (slowConnectionMode) {
      global.fetch = async (...args) => {
        // Delay de 3-8 segundos para simular conexión lenta
        const delay = Math.random() * 5000 + 3000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return originalFetch.current!(...args);
      };
    } else {
      if (originalFetch.current) {
        global.fetch = originalFetch.current;
      }
    }
  }, [slowConnectionMode]);

  // Simular modo offline
  const simulateOfflineMode = React.useCallback(() => {
    if (!originalFetch.current) {
      originalFetch.current = global.fetch;
    }

    if (offlineMode) {
      global.fetch = async (): Promise<Response> => {
        throw new Error('Network request failed - Offline mode simulation');
      };
    } else {
      if (originalFetch.current) {
        global.fetch = originalFetch.current;
      }
    }
  }, [offlineMode]);

  // Monitoreo continuo de conectividad
  useEffect(() => {
    if (isMonitoring) {
      const checkConnectivity = () => {
        const state = detectConnection();
        setConnectivityHistory((prev) => {
          const newHistory = [state, ...prev].slice(0, 50); // Mantener últimos 50 registros
          return newHistory;
        });
      };

      // Check inicial
      checkConnectivity();

      // Check cada 5 segundos
      monitoringIntervalRef.current = setInterval(
        checkConnectivity,
        5000
      ) as any;

      // Listeners para cambios de conectividad
      const handleOnline = () => checkConnectivity();
      const handleOffline = () => checkConnectivity();

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        if (monitoringIntervalRef.current) {
          clearInterval(monitoringIntervalRef.current);
        }
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    // Si no está monitoring, no necesita cleanup
    return undefined;
  }, [isMonitoring]);

  // Auto latency testing
  useEffect(() => {
    if (autoLatencyTest && isMonitoring) {
      const runAutoTest = async () => {
        try {
          const result = await runLatencyTest();
          setLatencyTests((prev) => [result, ...prev].slice(0, 20)); // Últimos 20 tests
        } catch (error) {
          console.error('Auto latency test failed:', error);
        }
      };

      // Test inicial
      runAutoTest();

      // Test cada 30 segundos
      latencyIntervalRef.current = setInterval(runAutoTest, 30000) as any;

      return () => {
        if (latencyIntervalRef.current) {
          clearInterval(latencyIntervalRef.current);
        }
      };
    }
    return undefined;
  }, [autoLatencyTest, isMonitoring]);

  // Aplicar simulaciones
  useEffect(() => {
    simulateOfflineMode();
  }, [offlineMode, simulateOfflineMode]);

  useEffect(() => {
    simulateSlowConnection();
  }, [slowConnectionMode, simulateSlowConnection]);

  // Cleanup al cerrar
  useEffect(() => {
    if (!visible) {
      // Restaurar fetch original si existe
      if (originalFetch.current) {
        global.fetch = originalFetch.current;
      }
    }
  }, [visible]);

  const handleManualLatencyTest = async () => {
    try {
      const result = await runLatencyTest();
      setLatencyTests((prev) => [result, ...prev].slice(0, 20));
      Alert.alert(
        'Test Completado',
        `Latencia: ${result.latency.toFixed(2)}ms\nÉxito: ${result.success ? 'Sí' : 'No'}`
      );
    } catch (error) {
      Alert.alert('Error en Test', 'No se pudo completar el test de latencia');
    }
  };

  const clearHistory = () => {
    setConnectivityHistory([]);
    setLatencyTests([]);
  };

  const getConnectionStatus = () => {
    const latest = connectivityHistory[0];
    if (!latest) return 'Sin datos';

    if (offlineMode) return '🔴 Offline (Simulado)';
    if (slowConnectionMode) return '🟡 Conexión Lenta (Simulado)';
    if (latest.isConnected) return '🟢 Conectado';
    return '🔴 Desconectado';
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return '#4CAF50'; // Verde
    if (latency < 300) return '#FF9800'; // Naranja
    return '#F44336'; // Rojo
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              📡 Connectivity Inspector
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Estado Actual */}
            <View
              style={[styles.section, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Estado Actual
              </Text>
              <Text style={[styles.status, { color: colors.text }]}>
                {getConnectionStatus()}
              </Text>

              {connectivityHistory[0] && (
                <View style={styles.detailsContainer}>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Tipo: {connectivityHistory[0].connectionType}
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Velocidad Efectiva: {connectivityHistory[0].effectiveType}
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    Downlink: {connectivityHistory[0].downlink} Mbps
                  </Text>
                  <Text style={[styles.detail, { color: colors.text }]}>
                    RTT: {connectivityHistory[0].rtt}ms
                  </Text>
                </View>
              )}
            </View>

            {/* Controles */}
            <View
              style={[styles.section, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Controles
              </Text>

              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { color: colors.text }]}>
                  Monitoreo Activo
                </Text>
                <Switch
                  value={isMonitoring}
                  onValueChange={setIsMonitoring}
                  trackColor={{ false: colors.border, true: '#4CAF50' }}
                />
              </View>

              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { color: colors.text }]}>
                  Auto Latency Test
                </Text>
                <Switch
                  value={autoLatencyTest}
                  onValueChange={setAutoLatencyTest}
                  trackColor={{ false: colors.border, true: '#4CAF50' }}
                />
              </View>

              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { color: colors.text }]}>
                  Simular Offline
                </Text>
                <Switch
                  value={offlineMode}
                  onValueChange={setOfflineMode}
                  trackColor={{ false: colors.border, true: '#F44336' }}
                />
              </View>

              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { color: colors.text }]}>
                  Simular Conexión Lenta
                </Text>
                <Switch
                  value={slowConnectionMode}
                  onValueChange={setSlowConnectionMode}
                  trackColor={{ false: colors.border, true: '#FF9800' }}
                />
              </View>

              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: colors.tint }]}
                onPress={handleManualLatencyTest}
              >
                <Text style={styles.testButtonText}>
                  Ejecutar Test de Latencia
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.clearButton, { borderColor: colors.border }]}
                onPress={clearHistory}
              >
                <Text style={[styles.clearButtonText, { color: colors.text }]}>
                  Limpiar Historial
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tests de Latencia */}
            {latencyTests.length > 0 && (
              <View
                style={[styles.section, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Tests de Latencia ({latencyTests.length})
                </Text>
                {latencyTests.slice(0, 5).map((test, index) => (
                  <View
                    key={index}
                    style={[
                      styles.testItem,
                      { borderBottomColor: colors.border },
                    ]}
                  >
                    <View style={styles.testHeader}>
                      <Text
                        style={[
                          styles.testLatency,
                          { color: getLatencyColor(test.latency) },
                        ]}
                      >
                        {test.latency.toFixed(2)}ms
                      </Text>
                      <Text
                        style={[
                          styles.testStatus,
                          { color: test.success ? '#4CAF50' : '#F44336' },
                        ]}
                      >
                        {test.success ? '✓' : '✗'}
                      </Text>
                      <Text style={[styles.testTime, { color: colors.text }]}>
                        {new Date(test.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    {test.error && (
                      <Text style={[styles.testError, { color: '#F44336' }]}>
                        Error: {test.error}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Historial de Conectividad */}
            {connectivityHistory.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Historial de Conectividad ({connectivityHistory.length})
                </Text>
                {connectivityHistory.slice(0, 10).map((state, index) => (
                  <View
                    key={index}
                    style={[
                      styles.historyItem,
                      { borderBottomColor: colors.border },
                    ]}
                  >
                    <View style={styles.historyHeader}>
                      <Text
                        style={[
                          styles.historyStatus,
                          { color: state.isConnected ? '#4CAF50' : '#F44336' },
                        ]}
                      >
                        {state.isConnected ? '🟢' : '🔴'}{' '}
                        {state.isConnected ? 'Conectado' : 'Desconectado'}
                      </Text>
                      <Text
                        style={[styles.historyTime, { color: colors.text }]}
                      >
                        {new Date(state.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.historyDetails, { color: colors.text }]}
                    >
                      {state.connectionType} | {state.effectiveType} | RTT:{' '}
                      {state.rtt}ms
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    maxHeight: 600,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsContainer: {
    marginLeft: 16,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 14,
  },
  testButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  clearButtonText: {
    fontWeight: 'bold',
  },
  testItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testLatency: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  testStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  testTime: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  testError: {
    fontSize: 12,
    marginTop: 4,
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  historyTime: {
    fontSize: 12,
  },
  historyDetails: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
});
