import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface RoutineData {
  dailyStartKeys: string[];
  exerciseProgressKeys: string[];
  exerciseRepsKeys: string[];
  timersData: string[];
  routineState: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface AsyncStorageItem {
  key: string;
  value: string;
  parsedValue?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  category: 'daily' | 'exercise' | 'timer' | 'settings' | 'other';
  timestamp?: number;
}

interface RoutinesInspectorProps {
  visible: boolean;
  onClose: () => void;
}

export function RoutinesInspector({
  visible,
  onClose,
}: RoutinesInspectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [routineData, setRoutineData] = useState<RoutineData>({
    dailyStartKeys: [],
    exerciseProgressKeys: [],
    exerciseRepsKeys: [],
    timersData: [],
    routineState: {},
  });

  const [asyncStorageItems, setAsyncStorageItems] = useState<
    AsyncStorageItem[]
  >([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const monitoringIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Categorizar claves de AsyncStorage
  const categorizeKey = (key: string): AsyncStorageItem['category'] => {
    if (key.startsWith('@daily_start_') || key.includes('daily'))
      return 'daily';
    if (
      key.startsWith('exercise_') &&
      (key.includes('_progress') || key.includes('_reps'))
    )
      return 'exercise';
    if (key.includes('timer') || key.includes('interval')) return 'timer';
    if (key.includes('settings') || key.includes('config')) return 'settings';
    return 'other';
  };

  // Obtener todos los items de AsyncStorage
  const getAllAsyncStorageItems = React.useCallback(async (): Promise<
    AsyncStorageItem[]
  > => {
    try {
      const items: AsyncStorageItem[] = [];

      if (Platform.OS === 'web') {
        // Web localStorage
        const storage = window.localStorage;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key) {
            const value = storage.getItem(key) || '';
            let parsedValue;
            try {
              parsedValue = JSON.parse(value);
            } catch {
              parsedValue = value;
            }

            items.push({
              key,
              value,
              parsedValue,
              category: categorizeKey(key),
              timestamp: Date.now(),
            });
          }
        }
      } else {
        // React Native AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        const keyValuePairs = await AsyncStorage.multiGet(keys);

        keyValuePairs.forEach(([key, value]: [string, string | null]) => {
          if (value) {
            let parsedValue;
            try {
              parsedValue = JSON.parse(value);
            } catch {
              parsedValue = value;
            }

            items.push({
              key,
              value,
              parsedValue,
              category: categorizeKey(key),
              timestamp: Date.now(),
            });
          }
        });
      }

      return items.sort((a, b) => a.key.localeCompare(b.key));
    } catch (error) {
      // Development console log for debugging
      // eslint-disable-next-line no-console
      // eslint-disable-next-line no-console
      console.error('Error getting AsyncStorage items:', error);
      return [];
    }
  }, []);

  // Analizar datos de rutinas específicos
  const analyzeRoutineData = (items: AsyncStorageItem[]): RoutineData => {
    const data: RoutineData = {
      dailyStartKeys: [],
      exerciseProgressKeys: [],
      exerciseRepsKeys: [],
      timersData: [],
      routineState: {},
    };

    items.forEach((item) => {
      if (item.key.startsWith('@daily_start_')) {
        data.dailyStartKeys.push(item.key);
        data.routineState[item.key] = item.parsedValue;
      } else if (
        item.key.startsWith('exercise_') &&
        item.key.includes('_progress')
      ) {
        data.exerciseProgressKeys.push(item.key);
        data.routineState[item.key] = item.parsedValue;
      } else if (
        item.key.startsWith('exercise_') &&
        item.key.includes('_reps')
      ) {
        data.exerciseRepsKeys.push(item.key);
        data.routineState[item.key] = item.parsedValue;
      } else if (item.key.includes('timer') || item.key.includes('interval')) {
        data.timersData.push(item.key);
        data.routineState[item.key] = item.parsedValue;
      }
    });

    return data;
  };

  // Refrescar datos
  const refreshData = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const items = await getAllAsyncStorageItems();
      setAsyncStorageItems(items);
      const analyzedData = analyzeRoutineData(items);
      setRoutineData(analyzedData);
    } catch (error) {
      // Development console log for debugging
      // eslint-disable-next-line no-console
      console.error('Error refreshing data:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    } finally {
      setRefreshing(false);
    }
  }, [getAllAsyncStorageItems]);

  // Monitoreo automático
  useEffect(() => {
    if (isMonitoring && autoRefresh) {
      const interval = setInterval(refreshData, 3000); // Cada 3 segundos
      monitoringIntervalRef.current = interval as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      return () => {
        if (monitoringIntervalRef.current) {
          clearInterval(monitoringIntervalRef.current);
        }
      };
    }
    return undefined;
  }, [isMonitoring, autoRefresh, refreshData]);

  // Cargar datos iniciales
  useEffect(() => {
    if (visible) {
      refreshData();
    }
  }, [visible, refreshData]);

  // Limpiar datos de rutina específicos
  const clearRoutineData = async () => {
    Alert.alert(
      'Confirmar Limpieza',
      '¿Deseas limpiar todos los datos de rutinas almacenados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            try {
              const keysToDelete = [
                ...routineData.dailyStartKeys,
                ...routineData.exerciseProgressKeys,
                ...routineData.exerciseRepsKeys,
                ...routineData.timersData,
              ];

              if (Platform.OS === 'web') {
                keysToDelete.forEach((key) =>
                  window.localStorage.removeItem(key)
                );
              } else {
                await AsyncStorage.multiRemove(keysToDelete);
              }

              await refreshData();
              Alert.alert('Éxito', 'Datos de rutinas limpiados correctamente');
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error clearing routine data:', error);
              Alert.alert('Error', 'No se pudieron limpiar los datos');
            }
          },
        },
      ]
    );
  };

  // Simular progreso de ejercicio
  const simulateExerciseProgress = async () => {
    try {
      const testExerciseId = 'test-exercise-' + Date.now();
      const progressKey = `exercise_${testExerciseId}_progress`;
      const repsKey = `exercise_${testExerciseId}_reps`;

      const progressData = {
        currentSet: 2,
        totalSets: 3,
        completedSets: 1,
        timestamp: Date.now(),
      };

      const repsData = '12,10,8';

      if (Platform.OS === 'web') {
        window.localStorage.setItem(progressKey, JSON.stringify(progressData));
        window.localStorage.setItem(repsKey, repsData);
      } else {
        await AsyncStorage.setItem(progressKey, JSON.stringify(progressData));
        await AsyncStorage.setItem(repsKey, repsData);
      }

      await refreshData();
      Alert.alert(
        'Simulación Creada',
        `Ejercicio de prueba: ${testExerciseId}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error simulating exercise:', error);
      Alert.alert('Error', 'No se pudo crear la simulación');
    }
  };

  // Simular inicio de rutina diaria
  const simulateDailyStart = async () => {
    try {
      const testRoutineId = 'routine-' + Date.now();
      const dayNumber = 1;
      const dailyKey = `@daily_start_${testRoutineId}_${dayNumber}`;

      const dailyData = {
        routineId: testRoutineId,
        dayNumber,
        startTime: Date.now(),
        exercises: ['ex1', 'ex2', 'ex3'],
        currentExercise: 0,
      };

      if (Platform.OS === 'web') {
        window.localStorage.setItem(dailyKey, JSON.stringify(dailyData));
      } else {
        await AsyncStorage.setItem(dailyKey, JSON.stringify(dailyData));
      }

      await refreshData();
      Alert.alert(
        'Rutina Simulada',
        `Rutina diaria iniciada: ${testRoutineId}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error simulating daily:', error);
      Alert.alert('Error', 'No se pudo simular la rutina diaria');
    }
  };

  // Filtrar items por categoría
  const filteredItems = asyncStorageItems.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  // Obtener color por categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily':
        return '#4CAF50';
      case 'exercise':
        return '#FF9800';
      case 'timer':
        return '#2196F3';
      case 'settings':
        return '#9C27B0';
      default:
        return colors.text;
    }
  };

  // Formatear valor para mostrar
  const formatValue = (item: AsyncStorageItem) => {
    if (showRawData) return item.value;

    if (typeof item.parsedValue === 'object') {
      return JSON.stringify(item.parsedValue, null, 2);
    }
    return String(item.parsedValue);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              💪 Routines Inspector
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
            }
          >
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
                  Auto Refresh (3s)
                </Text>
                <Switch
                  value={autoRefresh}
                  onValueChange={setAutoRefresh}
                  trackColor={{ false: colors.border, true: '#4CAF50' }}
                />
              </View>

              <View style={styles.controlRow}>
                <Text style={[styles.controlLabel, { color: colors.text }]}>
                  Mostrar Datos Raw
                </Text>
                <Switch
                  value={showRawData}
                  onValueChange={setShowRawData}
                  trackColor={{ false: colors.border, true: '#2196F3' }}
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  onPress={simulateDailyStart}
                >
                  <Text style={styles.actionButtonText}>Simular Daily</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                  onPress={simulateExerciseProgress}
                >
                  <Text style={styles.actionButtonText}>Simular Exercise</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.clearButton, { borderColor: colors.border }]}
                onPress={clearRoutineData}
              >
                <Text style={[styles.clearButtonText, { color: colors.text }]}>
                  Limpiar Datos de Rutinas
                </Text>
              </TouchableOpacity>
            </View>

            {/* Resumen de Rutinas */}
            <View
              style={[styles.section, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Resumen de Rutinas
              </Text>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Rutinas Iniciadas: {routineData.dailyStartKeys.length}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Ejercicios en Progreso:{' '}
                  {routineData.exerciseProgressKeys.length}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Ejercicios con Reps: {routineData.exerciseRepsKeys.length}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  Timers Activos: {routineData.timersData.length}
                </Text>
              </View>
            </View>

            {/* Filtros */}
            <View
              style={[styles.section, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Filtros
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterRow}>
                  {[
                    'all',
                    'daily',
                    'exercise',
                    'timer',
                    'settings',
                    'other',
                  ].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.filterButton,
                        {
                          backgroundColor:
                            filterCategory === category
                              ? colors.tint
                              : 'transparent',
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={() => setFilterCategory(category)}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          {
                            color:
                              filterCategory === category
                                ? 'white'
                                : colors.text,
                          },
                        ]}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {category !== 'all' &&
                          ` (${asyncStorageItems.filter((i) => i.category === category).length})`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Lista de AsyncStorage Items */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                AsyncStorage Items ({filteredItems.length})
              </Text>

              {filteredItems.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.storageItem,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <Text
                      style={[
                        styles.itemKey,
                        { color: getCategoryColor(item.category) },
                      ]}
                      numberOfLines={1}
                    >
                      {item.key}
                    </Text>
                    <Text style={[styles.itemCategory, { color: colors.text }]}>
                      {item.category}
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.valueContainer}
                  >
                    <Text
                      style={[styles.itemValue, { color: colors.text }]}
                      selectable
                    >
                      {formatValue(item)}
                    </Text>
                  </ScrollView>
                </View>
              ))}

              {filteredItems.length === 0 && (
                <Text style={[styles.emptyText, { color: colors.text }]}>
                  No hay items en esta categoría
                </Text>
              )}
            </View>
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
    width: '95%',
    maxHeight: '95%',
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
    maxHeight: 700,
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
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  controlLabel: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
  summaryRow: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  storageItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemKey: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  itemCategory: {
    fontSize: 10,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  valueContainer: {
    maxHeight: 100,
  },
  itemValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    paddingRight: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
    marginTop: 20,
  },
});
