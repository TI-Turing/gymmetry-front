import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  jsHeapSize: number;
  renderCount: number;
  timestamp: number;
}

interface ComponentRenderData {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

interface PerformanceMonitorProps {
  visible: boolean;
  onClose: () => void;
}

export function PerformanceMonitor({
  visible,
  onClose,
}: PerformanceMonitorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [performanceHistory, setPerformanceHistory] = useState<
    PerformanceMetrics[]
  >([]);
  const [renderData, setRenderData] = useState<ComponentRenderData[]>([]);
  const [monitorRenders, setMonitorRenders] = useState(false);

  const [alertThresholds] = useState({
    lowFPS: 30,
    highMemory: 100,
  });

  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const renderCounterRef = useRef<Map<string, ComponentRenderData>>(new Map());
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() });

  // Obtener métricas de performance
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const now = performance.now();
    const timeDiff = now - fpsCounterRef.current.lastTime;

    // Calcular FPS
    let fps = 0;
    if (timeDiff > 0) {
      fps = Math.min(60, (fpsCounterRef.current.frames * 1000) / timeDiff);
      fpsCounterRef.current = { frames: 0, lastTime: now };
    }

    // Obtener memoria
    let memoryUsage = 0;
    let jsHeapSize = 0;

    if (
      typeof window !== 'undefined' &&
      (window as unknown as { performance?: { memory?: unknown } }).performance
        ?.memory
    ) {
      const memory = (
        window as unknown as {
          performance: {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
            };
          };
        }
      ).performance.memory;
      memoryUsage = memory.usedJSHeapSize / (1024 * 1024); // MB
      jsHeapSize = memory.totalJSHeapSize / (1024 * 1024); // MB
    }

    return {
      fps: Math.round(fps),
      memoryUsage: Math.round(memoryUsage * 100) / 100,
      jsHeapSize: Math.round(jsHeapSize * 100) / 100,
      renderCount: renderCounterRef.current.size,
      timestamp: now,
    };
  }, []);

  // Función para registrar render de componente
  const recordComponentRender = useCallback(
    (componentName: string, renderTime: number) => {
      if (!monitorRenders) return;

      const current = renderCounterRef.current.get(componentName) || {
        componentName,
        renderCount: 0,
        lastRenderTime: 0,
        averageRenderTime: 0,
        totalRenderTime: 0,
      };

      const newData: ComponentRenderData = {
        ...current,
        renderCount: current.renderCount + 1,
        lastRenderTime: renderTime,
        totalRenderTime: current.totalRenderTime + renderTime,
        averageRenderTime:
          (current.totalRenderTime + renderTime) / (current.renderCount + 1),
      };

      renderCounterRef.current.set(componentName, newData);
      setRenderData(Array.from(renderCounterRef.current.values()));
    },
    [monitorRenders]
  );

  // Simular renders de componentes
  const simulateComponentRenders = useCallback(() => {
    const componentNames = [
      'ExerciseModal',
      'RoutineList',
      'UserProfile',
      'Navigation',
      'WorkoutTimer',
    ];

    componentNames.forEach((name) => {
      const renderTime = Math.random() * 20 + 5; // 5-25ms random render time
      recordComponentRender(name, renderTime);
    });
  }, [recordComponentRender]);

  // Monitoreo continuo
  useEffect(() => {
    if (isMonitoring && visible) {
      const collectMetrics = () => {
        const metrics = getPerformanceMetrics();

        setPerformanceHistory((prev) => {
          const newHistory = [metrics, ...prev].slice(0, 100); // Keep last 100 samples

          // Check thresholds and alert
          if (metrics.fps < alertThresholds.lowFPS) {
            // Performance warning - using devtools console for development
            // eslint-disable-next-line no-console
            console.warn(`Low FPS detected: ${metrics.fps}`);
          }
          if (metrics.memoryUsage > alertThresholds.highMemory) {
            // Performance warning - using devtools console for development
            // eslint-disable-next-line no-console
            console.warn(`High memory usage: ${metrics.memoryUsage}MB`);
          }

          return newHistory;
        });
      };

      // Collect metrics every 1 second
      monitoringIntervalRef.current = setInterval(
        collectMetrics,
        1000
      ) as unknown as NodeJS.Timeout;

      // Initial collection
      collectMetrics();

      return () => {
        if (monitoringIntervalRef.current) {
          clearInterval(monitoringIntervalRef.current);
        }
      };
    }
    return undefined;
  }, [isMonitoring, visible, getPerformanceMetrics, alertThresholds]);

  // Limpiar datos
  const clearMetrics = () => {
    setPerformanceHistory([]);
    setRenderData([]);
    renderCounterRef.current.clear();
  };

  // Simular carga alta
  const simulateHighCPULoad = () => {
    const startTime = Date.now();
    while (Date.now() - startTime < 2000) {
      // Busy wait for 2 seconds
      Math.random();
    }
  };

  // Generar reporte de performance
  const generatePerformanceReport = () => {
    if (performanceHistory.length === 0) {
      Alert.alert('Sin Datos', 'No hay datos de performance para reportar');
      return;
    }

    const avgFPS =
      performanceHistory.reduce((sum, m) => sum + m.fps, 0) /
      performanceHistory.length;
    const avgMemory =
      performanceHistory.reduce((sum, m) => sum + m.memoryUsage, 0) /
      performanceHistory.length;
    const minFPS = Math.min(...performanceHistory.map((m) => m.fps));
    const maxMemory = Math.max(...performanceHistory.map((m) => m.memoryUsage));

    const report = `📊 REPORTE DE PERFORMANCE

🖼️ FPS:
  • Promedio: ${avgFPS.toFixed(1)} fps
  • Mínimo: ${minFPS} fps
  • Estado: ${avgFPS >= 50 ? '✅ Bueno' : avgFPS >= 30 ? '⚠️ Regular' : '❌ Malo'}

💾 MEMORIA:
  • Promedio: ${avgMemory.toFixed(1)} MB
  • Máximo: ${maxMemory.toFixed(1)} MB
  • Estado: ${maxMemory < 50 ? '✅ Bueno' : maxMemory < 100 ? '⚠️ Regular' : '❌ Alto'}

📈 RENDERS:
  • Componentes monitoreados: ${renderData.length}
  • Total renders: ${renderData.reduce((sum, r) => sum + r.renderCount, 0)}

⏱️ DURACIÓN:
  • Muestras: ${performanceHistory.length}
  • Tiempo: ${Math.round((performanceHistory.length * 1000) / 60)} min`;

    Alert.alert('📊 Reporte de Performance', report);
  };

  // Estadísticas actuales
  const currentStats = performanceHistory[0];
  const averageStats = performanceHistory.length
    ? {
        fps:
          performanceHistory.reduce((sum, m) => sum + m.fps, 0) /
          performanceHistory.length,
        memory:
          performanceHistory.reduce((sum, m) => sum + m.memoryUsage, 0) /
          performanceHistory.length,
      }
    : null;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            📊 Monitor de Performance
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.tint }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Controles principales */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🎮 Controles
            </Text>

            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>
                Monitoreo Activo
              </Text>
              <Switch
                value={isMonitoring}
                onValueChange={setIsMonitoring}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </View>

            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>
                Monitor Renders
              </Text>
              <Switch
                value={monitorRenders}
                onValueChange={setMonitorRenders}
                trackColor={{ false: colors.border, true: colors.tint }}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={clearMetrics}
              >
                <Text style={styles.buttonText}>🗑️ Limpiar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.tint }]}
                onPress={generatePerformanceReport}
              >
                <Text style={styles.buttonText}>📊 Reporte</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Métricas actuales */}
          {currentStats && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📈 Métricas Actuales
              </Text>

              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={[styles.metricValue, { color: colors.tint }]}>
                    {currentStats.fps}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.text }]}>
                    FPS
                  </Text>
                  <Text
                    style={[
                      styles.metricStatus,
                      {
                        color:
                          currentStats.fps >= 50
                            ? '#4CAF50'
                            : currentStats.fps >= 30
                              ? '#FF9800'
                              : '#F44336',
                      },
                    ]}
                  >
                    {currentStats.fps >= 50
                      ? '✅ Óptimo'
                      : currentStats.fps >= 30
                        ? '⚠️ Regular'
                        : '❌ Bajo'}
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={[styles.metricValue, { color: colors.tint }]}>
                    {currentStats.memoryUsage.toFixed(1)}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.text }]}>
                    MB RAM
                  </Text>
                  <Text
                    style={[
                      styles.metricStatus,
                      {
                        color:
                          currentStats.memoryUsage < 50
                            ? '#4CAF50'
                            : currentStats.memoryUsage < 100
                              ? '#FF9800'
                              : '#F44336',
                      },
                    ]}
                  >
                    {currentStats.memoryUsage < 50
                      ? '✅ Bueno'
                      : currentStats.memoryUsage < 100
                        ? '⚠️ Alto'
                        : '❌ Crítico'}
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={[styles.metricValue, { color: colors.tint }]}>
                    {currentStats.jsHeapSize.toFixed(1)}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.text }]}>
                    MB Heap
                  </Text>
                  <Text style={[styles.metricStatus, { color: colors.text }]}>
                    JS Memory
                  </Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={[styles.metricValue, { color: colors.tint }]}>
                    {renderData.length}
                  </Text>
                  <Text style={[styles.metricLabel, { color: colors.text }]}>
                    Componentes
                  </Text>
                  <Text style={[styles.metricStatus, { color: colors.text }]}>
                    Monitoreados
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Promedios */}
          {averageStats && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📊 Promedios ({performanceHistory.length} muestras)
              </Text>

              <View style={styles.statsRow}>
                <Text style={[styles.statText, { color: colors.text }]}>
                  📱 FPS Promedio: {averageStats.fps.toFixed(1)}
                </Text>
                <Text style={[styles.statText, { color: colors.text }]}>
                  💾 RAM Promedio: {averageStats.memory.toFixed(1)} MB
                </Text>
              </View>
            </View>
          )}

          {/* Datos de renders */}
          {renderData.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                🔄 Renders de Componentes
              </Text>

              {renderData.slice(0, 5).map((render) => (
                <View key={render.componentName} style={styles.renderRow}>
                  <Text style={[styles.componentName, { color: colors.text }]}>
                    {render.componentName}
                  </Text>
                  <Text style={[styles.renderStats, { color: colors.text }]}>
                    {render.renderCount} renders |{' '}
                    {render.averageRenderTime.toFixed(1)}ms avg
                  </Text>
                </View>
              ))}

              {renderData.length > 5 && (
                <Text style={[styles.moreText, { color: colors.text }]}>
                  ... y {renderData.length - 5} componentes más
                </Text>
              )}
            </View>
          )}

          {/* Herramientas de simulación */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🧪 Herramientas de Simulación
            </Text>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.tint }]}
              onPress={simulateHighCPULoad}
            >
              <Text style={styles.buttonText}>⚡ Simular Carga CPU</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.tint }]}
              onPress={simulateComponentRenders}
            >
              <Text style={styles.buttonText}>🔄 Simular Renders</Text>
            </TouchableOpacity>
          </View>

          {/* Historial reciente */}
          {performanceHistory.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                📈 Historial Reciente
              </Text>

              {performanceHistory.slice(0, 10).map((metric) => (
                <View key={metric.timestamp} style={styles.historyRow}>
                  <Text style={[styles.historyText, { color: colors.text }]}>
                    {new Date(metric.timestamp).toLocaleTimeString()} |{' '}
                    {metric.fps}fps | {metric.memoryUsage.toFixed(1)}MB
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  controlLabel: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    margin: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  metricStatus: {
    fontSize: 10,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'column',
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
  renderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  componentName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  renderStats: {
    fontSize: 12,
  },
  moreText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  historyRow: {
    paddingVertical: 2,
  },
  historyText: {
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
