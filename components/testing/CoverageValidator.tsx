import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CoverageValidatorProps {
  visible: boolean;
  onClose: () => void;
}

interface TestPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  testCases: TestCase[];
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'passed' | 'failed';
  automated: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function CoverageValidator({
  visible,
  onClose,
}: CoverageValidatorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  // Plan de Pruebas completo basado en el documento
  const testPlan: TestPhase[] = [
    {
      id: 'auth',
      name: 'FASE 1: Autenticación',
      description: 'Validación de login, registro y gestión de sesiones',
      status: 'completed',
      testCases: [
        {
          id: 'auth-1',
          name: 'Login válido',
          description: 'Usuario ingresa credenciales correctas',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'auth-2',
          name: 'Login inválido',
          description: 'Usuario ingresa credenciales incorrectas',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'auth-3',
          name: 'Registro nuevo usuario',
          description: 'Crear cuenta con datos válidos',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
        {
          id: 'auth-4',
          name: 'Persistencia de sesión',
          description: 'La sesión se mantiene al cerrar/reabrir app',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'auth-5',
          name: 'Token refresh',
          description: 'Renovación automática de tokens expirados',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
      ],
    },
    {
      id: 'navigation',
      name: 'FASE 2: Navegación',
      description: 'Flujos de navegación y routing con expo-router',
      status: 'completed',
      testCases: [
        {
          id: 'nav-1',
          name: 'Navegación entre pantallas',
          description: 'Transiciones suaves entre todas las pantallas',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
        {
          id: 'nav-2',
          name: 'Parámetros de rutas',
          description: 'Paso correcto de parámetros entre pantallas',
          status: 'passed',
          automated: true,
          priority: 'medium',
        },
        {
          id: 'nav-3',
          name: 'Deep linking',
          description: 'Navegación directa a pantallas específicas',
          status: 'pending',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'nav-4',
          name: 'Tabs navigation',
          description: 'Funcionamiento de tabs principales',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
      ],
    },
    {
      id: 'crud',
      name: 'FASE 3: Operaciones CRUD',
      description: 'Crear, leer, actualizar y eliminar entidades',
      status: 'in-progress',
      testCases: [
        {
          id: 'crud-1',
          name: 'Crear rutina',
          description: 'Crear nueva rutina de ejercicios',
          status: 'passed',
          automated: false,
          priority: 'critical',
        },
        {
          id: 'crud-2',
          name: 'Editar rutina',
          description: 'Modificar rutina existente',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
        {
          id: 'crud-3',
          name: 'Eliminar rutina',
          description: 'Borrar rutina con confirmación',
          status: 'pending',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'crud-4',
          name: 'Crear post',
          description: 'Publicar nuevo contenido en feed',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
        {
          id: 'crud-5',
          name: 'Gestión de ejercicios',
          description: 'CRUD completo de ejercicios personalizados',
          status: 'pending',
          automated: false,
          priority: 'high',
        },
      ],
    },
    {
      id: 'api',
      name: 'FASE 4: Integración API',
      description: 'Comunicación con servicios backend',
      status: 'completed',
      testCases: [
        {
          id: 'api-1',
          name: 'Manejo de errores HTTP',
          description: 'Respuesta apropiada a errores 4xx/5xx',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'api-2',
          name: 'Timeouts y retry',
          description: 'Reintentos automáticos en fallos de red',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'api-3',
          name: 'Normalización de datos',
          description: 'Manejo correcto de arrays $values',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'api-4',
          name: 'Interceptores de auth',
          description: 'Inyección automática de headers',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
      ],
    },
    {
      id: 'state',
      name: 'FASE 5: Gestión de Estado',
      description: 'Estado global, local y persistencia',
      status: 'completed',
      testCases: [
        {
          id: 'state-1',
          name: 'Context Auth',
          description: 'Estado de autenticación global',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'state-2',
          name: 'AsyncStorage',
          description: 'Persistencia de datos locales',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'state-3',
          name: 'Estado de formularios',
          description: 'Validaciones y estado de forms',
          status: 'passed',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'state-4',
          name: 'Cache de rutinas',
          description: 'Persistencia de progreso de rutinas',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
      ],
    },
    {
      id: 'ui',
      name: 'FASE 6: Interfaz de Usuario',
      description: 'Componentes, temas y responsividad',
      status: 'in-progress',
      testCases: [
        {
          id: 'ui-1',
          name: 'Modo oscuro/claro',
          description: 'Alternancia correcta de temas',
          status: 'passed',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'ui-2',
          name: 'Responsividad',
          description: 'Adaptación a diferentes tamaños de pantalla',
          status: 'pending',
          automated: false,
          priority: 'high',
        },
        {
          id: 'ui-3',
          name: 'Estados de carga',
          description: 'Loading states en todas las operaciones',
          status: 'passed',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'ui-4',
          name: 'Mensajes de error',
          description: 'CustomAlert en lugar de Alert nativo',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
      ],
    },
    {
      id: 'business',
      name: 'FASE 7: Lógica de Negocio',
      description: 'Flujos específicos del dominio gym',
      status: 'in-progress',
      testCases: [
        {
          id: 'biz-1',
          name: 'Cronómetro de ejercicios',
          description: 'Timer con fases ON/OFF/PREP',
          status: 'passed',
          automated: false,
          priority: 'critical',
        },
        {
          id: 'biz-2',
          name: 'Finalización de rutina',
          description: 'Creación de Daily al completar rutina',
          status: 'passed',
          automated: false,
          priority: 'critical',
        },
        {
          id: 'biz-3',
          name: 'Progreso de ejercicios',
          description: 'Tracking de repeticiones y tiempos',
          status: 'passed',
          automated: false,
          priority: 'high',
        },
        {
          id: 'biz-4',
          name: 'Validaciones de negocio',
          description: 'Reglas específicas de gym/fitness',
          status: 'pending',
          automated: false,
          priority: 'medium',
        },
      ],
    },
    {
      id: 'security',
      name: 'FASE 8: Seguridad',
      description: 'Protección de datos y validaciones',
      status: 'completed',
      testCases: [
        {
          id: 'sec-1',
          name: 'Sanitización de inputs',
          description: 'Limpieza de datos de usuario',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'sec-2',
          name: 'Validación de permisos',
          description: 'Acceso solo a recursos autorizados',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'sec-3',
          name: 'Protección de tokens',
          description: 'Storage seguro de credenciales',
          status: 'passed',
          automated: true,
          priority: 'critical',
        },
        {
          id: 'sec-4',
          name: 'Rate limiting',
          description: 'Prevención de spam/abuso',
          status: 'pending',
          automated: true,
          priority: 'medium',
        },
      ],
    },
    {
      id: 'offline',
      name: 'FASE 9: Modo Offline',
      description: 'Funcionalidad sin conexión',
      status: 'pending',
      testCases: [
        {
          id: 'off-1',
          name: 'Detección de conectividad',
          description: 'Monitoreo de estado de red',
          status: 'passed',
          automated: true,
          priority: 'medium',
        },
        {
          id: 'off-2',
          name: 'Cache offline',
          description: 'Datos disponibles sin conexión',
          status: 'pending',
          automated: false,
          priority: 'medium',
        },
        {
          id: 'off-3',
          name: 'Sincronización',
          description: 'Sync automática al reconnectar',
          status: 'pending',
          automated: false,
          priority: 'low',
        },
      ],
    },
    {
      id: 'integration',
      name: 'FASE 10: Pruebas de Integración',
      description: 'Flujos end-to-end completos',
      status: 'in-progress',
      testCases: [
        {
          id: 'int-1',
          name: 'Flujo completo de rutina',
          description: 'Desde creación hasta finalización',
          status: 'passed',
          automated: false,
          priority: 'critical',
        },
        {
          id: 'int-2',
          name: 'Flujo social completo',
          description: 'Crear post, like, comentario',
          status: 'pending',
          automated: false,
          priority: 'high',
        },
        {
          id: 'int-3',
          name: 'Onboarding completo',
          description: 'Registro → primer rutina → primer post',
          status: 'pending',
          automated: false,
          priority: 'medium',
        },
      ],
    },
    {
      id: 'performance',
      name: 'FASE 11: Performance',
      description: 'Rendimiento, memoria y optimización',
      status: 'completed',
      testCases: [
        {
          id: 'perf-1',
          name: 'FPS monitoring',
          description: 'Framerate estable >30fps',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'perf-2',
          name: 'Memory leaks',
          description: 'Sin crecimiento descontrolado de memoria',
          status: 'passed',
          automated: true,
          priority: 'high',
        },
        {
          id: 'perf-3',
          name: 'Bundle size',
          description: 'Tamaño optimizado de la app',
          status: 'pending',
          automated: true,
          priority: 'medium',
        },
        {
          id: 'perf-4',
          name: 'Render optimization',
          description: 'Re-renders innecesarios minimizados',
          status: 'passed',
          automated: true,
          priority: 'medium',
        },
      ],
    },
  ];

  // Calcular estadísticas
  const totalPhases = testPlan.length;
  const completedPhases = testPlan.filter(
    (p) => p.status === 'completed'
  ).length;
  const totalTestCases = testPlan.reduce(
    (sum, p) => sum + p.testCases.length,
    0
  );
  const passedTestCases = testPlan.reduce(
    (sum, p) => sum + p.testCases.filter((tc) => tc.status === 'passed').length,
    0
  );
  const failedTestCases = testPlan.reduce(
    (sum, p) => sum + p.testCases.filter((tc) => tc.status === 'failed').length,
    0
  );
  const automatedTestCases = testPlan.reduce(
    (sum, p) => sum + p.testCases.filter((tc) => tc.automated).length,
    0
  );

  const phaseProgress = Math.round((completedPhases / totalPhases) * 100);
  const testCaseProgress = Math.round((passedTestCases / totalTestCases) * 100);
  const automationCoverage = Math.round(
    (automatedTestCases / totalTestCases) * 100
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
        return '#4CAF50';
      case 'in-progress':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#F44336';
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#2196F3';
      case 'low':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            ✅ Validador de Cobertura
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: colors.tint }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Resumen general */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📊 Resumen de Cobertura
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.tint }]}>
                  {phaseProgress}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Fases Completadas
                </Text>
                <Text style={[styles.statDetail, { color: colors.text }]}>
                  {completedPhases}/{totalPhases}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.tint }]}>
                  {testCaseProgress}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Casos de Prueba
                </Text>
                <Text style={[styles.statDetail, { color: colors.text }]}>
                  {passedTestCases}/{totalTestCases}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: colors.tint }]}>
                  {automationCoverage}%
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Automatización
                </Text>
                <Text style={[styles.statDetail, { color: colors.text }]}>
                  {automatedTestCases}/{totalTestCases}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#F44336' }]}>
                  {failedTestCases}
                </Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>
                  Fallos
                </Text>
                <Text style={[styles.statDetail, { color: colors.text }]}>
                  Casos fallidos
                </Text>
              </View>
            </View>
          </View>

          {/* Lista de fases */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🧪 Plan de Pruebas
            </Text>

            {testPlan.map((phase) => (
              <View key={phase.id} style={styles.phaseContainer}>
                <TouchableOpacity
                  style={styles.phaseHeader}
                  onPress={() =>
                    setSelectedPhase(
                      selectedPhase === phase.id ? null : phase.id
                    )
                  }
                >
                  <View style={styles.phaseInfo}>
                    <Text
                      style={[
                        styles.phaseStatus,
                        { color: getStatusColor(phase.status) },
                      ]}
                    >
                      {getStatusIcon(phase.status)}
                    </Text>
                    <View style={styles.phaseText}>
                      <Text style={[styles.phaseName, { color: colors.text }]}>
                        {phase.name}
                      </Text>
                      <Text
                        style={[
                          styles.phaseDescription,
                          { color: colors.text },
                        ]}
                      >
                        {phase.description}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.expandIcon, { color: colors.text }]}>
                    {selectedPhase === phase.id ? '▼' : '▶'}
                  </Text>
                </TouchableOpacity>

                {selectedPhase === phase.id && (
                  <View style={styles.testCasesContainer}>
                    {phase.testCases.map((testCase) => (
                      <View key={testCase.id} style={styles.testCaseRow}>
                        <Text
                          style={[
                            styles.testCaseStatus,
                            { color: getStatusColor(testCase.status) },
                          ]}
                        >
                          {getStatusIcon(testCase.status)}
                        </Text>
                        <View style={styles.testCaseInfo}>
                          <Text
                            style={[
                              styles.testCaseName,
                              { color: colors.text },
                            ]}
                          >
                            {testCase.name}
                          </Text>
                          <Text
                            style={[
                              styles.testCaseDescription,
                              { color: colors.text },
                            ]}
                          >
                            {testCase.description}
                          </Text>
                        </View>
                        <View style={styles.testCaseMetadata}>
                          <Text
                            style={[
                              styles.testCasePriority,
                              { color: getPriorityColor(testCase.priority) },
                            ]}
                          >
                            {testCase.priority.toUpperCase()}
                          </Text>
                          {testCase.automated && (
                            <Text
                              style={[
                                styles.testCaseAutomated,
                                { color: colors.tint },
                              ]}
                            >
                              🤖
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Próximos pasos */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🎯 Próximos Pasos
            </Text>

            <Text style={[styles.nextStepText, { color: colors.text }]}>
              • Completar casos pendientes en FASE 9: Modo Offline
            </Text>
            <Text style={[styles.nextStepText, { color: colors.text }]}>
              • Finalizar integración completa FASE 10
            </Text>
            <Text style={[styles.nextStepText, { color: colors.text }]}>
              • Optimizar bundle size (FASE 11: Performance)
            </Text>
            <Text style={[styles.nextStepText, { color: colors.text }]}>
              • Incrementar cobertura de automatización a 80%+
            </Text>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statDetail: {
    fontSize: 10,
    marginTop: 2,
  },
  phaseContainer: {
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phaseStatus: {
    fontSize: 20,
    marginRight: 12,
  },
  phaseText: {
    flex: 1,
  },
  phaseName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  phaseDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  expandIcon: {
    fontSize: 16,
  },
  testCasesContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  testCaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  testCaseStatus: {
    fontSize: 16,
    marginRight: 8,
  },
  testCaseInfo: {
    flex: 1,
  },
  testCaseName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  testCaseDescription: {
    fontSize: 11,
    marginTop: 2,
  },
  testCaseMetadata: {
    alignItems: 'flex-end',
  },
  testCasePriority: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  testCaseAutomated: {
    fontSize: 12,
    marginTop: 2,
  },
  nextStepText: {
    fontSize: 14,
    marginBottom: 8,
  },
});
