import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logger } from '@/utils/logger';
import { jwtValidationUtils } from '@/utils/jwtValidationUtils';
import { networkSimulationUtils } from '@/utils/networkSimulationUtils';
import { performanceTestingUtils } from '@/utils/performanceTestingUtils';
import { routineTestingUtils } from '@/utils/routineTestingUtils';
import { CustomAlert } from '@/components/common';
import { testingDashboardStyles } from './styles/testingDashboard';
import Colors from '@/constants/Colors';

interface TestResult {
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  result?: string;
  error?: string;
  duration?: number;
}

export function TestingDashboardScreen() {
  // Forzamos tema oscuro para el dashboard de testing
  const colorScheme = 'dark';
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    {}
  );
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [networkSimEnabled, setNetworkSimEnabled] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const updateTestResult = (testName: string, result: Partial<TestResult>) => {
    setTestResults((prev) => ({
      ...prev,
      [testName]: { ...prev[testName], name: testName, ...result },
    }));
  };

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const runTest = async (
    testName: string,
    testFunction: () => Promise<unknown>
  ) => {
    updateTestResult(testName, { status: 'running' });
    const startTime = Date.now();

    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;

      updateTestResult(testName, {
        status: 'success',
        result: typeof result === 'string' ? result : 'Completado exitosamente',
        duration,
      });

      logger.info(`✅ Test completado: ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTestResult(testName, {
        status: 'error',
        error: String(error),
        duration,
      });

      logger.error(`❌ Test falló: ${testName} (${duration}ms)`, error);
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    showAlertMessage('Ejecutando todos los tests...');

    try {
      // Tests básicos
      await runTest('JWT Validation', async () => {
        await jwtValidationUtils.generateAuthReport();
        return 'JWT validation completado - revisar logs';
      });

      await runTest('Environment Validation', async () => {
        const currentEnv = process.env.EXPO_PUBLIC_ENV || 'local';
        return `Entorno actual detectado: ${currentEnv}`;
      }); // Tests de red
      await runTest('Network Connectivity', async () => {
        const result = await networkSimulationUtils.testConnectivity();
        return `Conectividad: ${result.metrics.success ? 'OK' : 'Error'} (${result.metrics.totalTime}ms)`;
      });

      await runTest('Network Large Data', async () => {
        const result = await networkSimulationUtils.testLargeDataLoad();
        return `Carga de datos: ${result.metrics.success ? 'OK' : 'Error'} (${result.metrics.totalTime}ms)`;
      });

      // Tests de performance
      await runTest('Performance Data Load', async () => {
        const result = await performanceTestingUtils.testDataLoadPerformance();
        return `Carga: ${result.averageTime.toFixed(2)}ms promedio (${result.operationsPerSecond.toFixed(2)} ops/sec)`;
      });

      await runTest('Performance Storage', async () => {
        const result = await performanceTestingUtils.testStoragePerformance();
        return `Storage Write: ${result.write.averageTime.toFixed(2)}ms, Read: ${result.read.averageTime.toFixed(2)}ms`;
      });

      // Tests de rutinas
      await runTest('Routine Load', async () => {
        const result = await routineTestingUtils.testRoutineLoad();
        return result.success
          ? `Rutina cargada: ${result.exercises?.length || 0} ejercicios (${result.timing?.loadTime}ms)`
          : `Error: ${result.error}`;
      });

      await runTest('Exercise Timer', async () => {
        const result = await routineTestingUtils.testExerciseTimer(15);
        return result.success
          ? `Timer completado: ${result.phases.length} fases (${result.totalTime}ms)`
          : `Error: ${result.error}`;
      });

      await runTest('Storage Cleanup', async () => {
        const result =
          await routineTestingUtils.testStorageCleanup('test-routine');
        return result.success
          ? `Limpieza exitosa: ${result.cleanedKeys.length} keys eliminadas`
          : `Error: ${result.error}`;
      });

      showAlertMessage('Todos los tests completados exitosamente');
    } catch (error) {
      showAlertMessage(`Error ejecutando tests: ${error}`);
    } finally {
      setIsRunningAll(false);
    }
  };

  const toggleNetworkSimulation = (enabled: boolean) => {
    setNetworkSimEnabled(enabled);

    if (enabled) {
      networkSimulationUtils.presets.mobile4g();
      showAlertMessage('Simulación de red activada (4G móvil)');
    } else {
      networkSimulationUtils.presets.disable();
      showAlertMessage('Simulación de red desactivada');
    }
  };

  const setNetworkPreset = (presetName: string) => {
    const presets = networkSimulationUtils.presets as Record<
      string,
      () => void
    >;
    if (presets[presetName]) {
      presets[presetName]();
      showAlertMessage(`Preset de red aplicado: ${presetName}`);
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return Colors[colorScheme ?? 'light'].warning;
      case 'success':
        return Colors[colorScheme ?? 'light'].success;
      case 'error':
        return Colors[colorScheme ?? 'light'].danger;
      default:
        return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⚪';
    }
  };

  useEffect(() => {
    // Inicializar tests con estado idle
    const initialTests = [
      'JWT Validation',
      'Environment Validation',
      'Network Connectivity',
      'Network Large Data',
      'Performance Data Load',
      'Performance Storage',
      'Routine Load',
      'Exercise Timer',
      'Storage Cleanup',
    ];

    const initialState: Record<string, TestResult> = {};
    initialTests.forEach((testName) => {
      initialState[testName] = { name: testName, status: 'idle' };
    });

    setTestResults(initialState);
  }, []);

  return (
    <SafeAreaView style={testingDashboardStyles.container}>
      <ScrollView style={testingDashboardStyles.scrollView}>
        {/* Header */}
        <View style={testingDashboardStyles.header}>
          <Text
            style={[
              testingDashboardStyles.title,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            🧪 Testing Dashboard
          </Text>
          <Text
            style={[
              testingDashboardStyles.subtitle,
              { color: Colors[colorScheme ?? 'light'].textMuted },
            ]}
          >
            Framework de testing integral de Gymmetry
          </Text>
        </View>

        {/* Controls */}
        <View style={testingDashboardStyles.controlsSection}>
          <TouchableOpacity
            style={[
              testingDashboardStyles.runAllButton,
              {
                backgroundColor: isRunningAll
                  ? Colors[colorScheme ?? 'light'].warning
                  : Colors[colorScheme ?? 'light'].tint,
              },
            ]}
            onPress={runAllTests}
            disabled={isRunningAll}
          >
            <Text style={testingDashboardStyles.runAllButtonText}>
              {isRunningAll
                ? '⏳ Ejecutando...'
                : '🚀 Ejecutar Todos los Tests'}
            </Text>
          </TouchableOpacity>

          {/* Network Simulation Controls */}
          <View style={testingDashboardStyles.networkControls}>
            <View style={testingDashboardStyles.networkToggle}>
              <Text
                style={[
                  testingDashboardStyles.networkLabel,
                  { color: Colors[colorScheme ?? 'light'].text },
                ]}
              >
                Simulación de Red
              </Text>
              <Switch
                value={networkSimEnabled}
                onValueChange={toggleNetworkSimulation}
                trackColor={{
                  false: Colors[colorScheme ?? 'light'].border,
                  true: Colors[colorScheme ?? 'light'].tint,
                }}
              />
            </View>

            {networkSimEnabled && (
              <View style={testingDashboardStyles.networkPresets}>
                {['perfect', 'mobile4g', 'mobile3g', 'slow', 'unstable'].map(
                  (preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        testingDashboardStyles.presetButton,
                        { borderColor: '#666666' },
                      ]} // Borde gris para tema oscuro
                      onPress={() => setNetworkPreset(preset)}
                    >
                      <Text style={testingDashboardStyles.presetButtonText}>
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>
        </View>

        {/* Test Results */}
        <View style={testingDashboardStyles.resultsSection}>
          <Text
            style={[
              testingDashboardStyles.sectionTitle,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            📊 Resultados de Tests
          </Text>

          {Object.entries(testResults).map(([testName, result]) => (
            <View
              key={testName}
              style={[
                testingDashboardStyles.testResult,
                { borderColor: Colors[colorScheme ?? 'light'].border },
              ]}
            >
              <View style={testingDashboardStyles.testHeader}>
                <Text style={testingDashboardStyles.testIcon}>
                  {getStatusIcon(result.status)}
                </Text>
                <Text
                  style={[
                    testingDashboardStyles.testName,
                    { color: Colors[colorScheme ?? 'light'].text },
                  ]}
                >
                  {testName}
                </Text>
                {result.duration && (
                  <Text
                    style={[
                      testingDashboardStyles.testDuration,
                      { color: Colors[colorScheme ?? 'light'].textMuted },
                    ]}
                  >
                    {result.duration}ms
                  </Text>
                )}
              </View>

              {result.result && (
                <Text
                  style={[
                    testingDashboardStyles.testResult,
                    { color: getStatusColor(result.status) },
                  ]}
                >
                  {result.result}
                </Text>
              )}

              {result.error && (
                <Text
                  style={[
                    testingDashboardStyles.testError,
                    { color: Colors[colorScheme ?? 'light'].danger },
                  ]}
                >
                  Error: {result.error}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  testingDashboardStyles.runSingleButton,
                  { borderColor: Colors[colorScheme ?? 'light'].tint },
                ]}
                onPress={() => {
                  // Función individual para cada test
                  const testFunctions: Record<string, () => Promise<unknown>> =
                    {
                      'JWT Validation': () =>
                        jwtValidationUtils.generateAuthReport(),
                      'Environment Validation': async () => {
                        const env = process.env.EXPO_PUBLIC_ENV || 'local';
                        return Promise.resolve(`Entorno: ${env}`);
                      },
                      'Network Connectivity': () =>
                        networkSimulationUtils.testConnectivity(),
                      'Network Large Data': () =>
                        networkSimulationUtils.testLargeDataLoad(),
                      'Performance Data Load': () =>
                        performanceTestingUtils.testDataLoadPerformance(),
                      'Performance Storage': () =>
                        performanceTestingUtils.testStoragePerformance(),
                      'Routine Load': () =>
                        routineTestingUtils.testRoutineLoad(),
                      'Exercise Timer': () =>
                        routineTestingUtils.testExerciseTimer(15),
                      'Storage Cleanup': () =>
                        routineTestingUtils.testStorageCleanup('test-routine'),
                    };

                  const testFunction = testFunctions[testName];
                  if (testFunction) {
                    runTest(testName, testFunction);
                  }
                }}
                disabled={result.status === 'running'}
              >
                <Text
                  style={[
                    testingDashboardStyles.runSingleButtonText,
                    { color: Colors[colorScheme ?? 'light'].tint },
                  ]}
                >
                  {result.status === 'running' ? '⏳' : '▶️'} Ejecutar
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={testingDashboardStyles.quickActions}>
          <Text
            style={[
              testingDashboardStyles.sectionTitle,
              { color: Colors[colorScheme ?? 'light'].text },
            ]}
          >
            ⚡ Acciones Rápidas
          </Text>

          <TouchableOpacity
            style={[
              testingDashboardStyles.quickActionButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            ]}
            onPress={() => {
              logger.info('📊 Generando reporte completo de performance...');
              performanceTestingUtils.generatePerformanceReport();
              showAlertMessage(
                'Reporte de performance generado - revisar logs'
              );
            }}
          >
            <Text style={testingDashboardStyles.quickActionButtonText}>
              📊 Generar Reporte de Performance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              testingDashboardStyles.quickActionButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            ]}
            onPress={() => {
              logger.info('🌐 Generando reporte completo de red...');
              networkSimulationUtils.generateNetworkTestReport();
              showAlertMessage('Reporte de red generado - revisar logs');
            }}
          >
            <Text style={testingDashboardStyles.quickActionButtonText}>
              🌐 Generar Reporte de Red
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              testingDashboardStyles.quickActionButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            ]}
            onPress={() => {
              logger.info('🏋️‍♂️ Generando reporte completo de rutinas...');
              routineTestingUtils.generateRoutineTestReport();
              showAlertMessage('Reporte de rutinas generado - revisar logs');
            }}
          >
            <Text style={testingDashboardStyles.quickActionButtonText}>
              🏋️‍♂️ Generar Reporte de Rutinas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              testingDashboardStyles.quickActionButton,
              { backgroundColor: Colors[colorScheme ?? 'light'].warning },
            ]}
            onPress={() => {
              // Limpiar todos los resultados
              setTestResults((prev) => {
                const cleaned: Record<string, TestResult> = {};
                Object.keys(prev).forEach((key) => {
                  cleaned[key] = { name: key, status: 'idle' };
                });
                return cleaned;
              });
              showAlertMessage('Todos los resultados han sido limpiados');
            }}
          >
            <Text style={testingDashboardStyles.quickActionButtonText}>
              🧹 Limpiar Resultados
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={showAlert}
        type="info"
        title="Testing Dashboard"
        message={alertMessage}
        onClose={() => setShowAlert(false)}
        confirmText="OK"
        onConfirm={() => setShowAlert(false)}
      />
    </SafeAreaView>
  );
}
