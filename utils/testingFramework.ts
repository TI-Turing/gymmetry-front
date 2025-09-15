// Framework central de testing para ejecutar todos los casos del plan de pruebas
import { logger } from '@/utils/logger';
import { jwtValidationUtils } from '@/utils/jwtValidationUtils';
import { environmentValidationUtils } from '@/utils/environmentValidationUtils';
import { tokenTestUtils } from '@/utils/tokenTestUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService';

/**
 * Resultado de un test individual
 */
export interface TestResult {
  id: string;
  name: string;
  phase: string;
  status: 'passed' | 'failed' | 'skipped' | 'running';
  duration: number;
  error?: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Suite de tests agrupados
 */
export interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: TestResult[];
  status: 'passed' | 'failed' | 'running' | 'pending';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
}

/**
 * Reporte completo de testing
 */
export interface TestingReport {
  timestamp: Date;
  environment: string;
  totalSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  suites: TestSuite[];
  summary: {
    configurationTests: TestSuite;
    authenticationTests: TestSuite;
    routineTests: TestSuite;
    socialTests: TestSuite;
    paymentTests: TestSuite;
    performanceTests: TestSuite;
    securityTests: TestSuite;
    compatibilityTests: TestSuite;
  };
}

/**
 * Configuración de testing
 */
export interface TestingConfig {
  skipSlowTests: boolean;
  skipManualTests: boolean;
  skipSecurityTests: boolean;
  verbose: boolean;
  environment: 'local' | 'development' | 'production';
  timeoutMs: number;
}

class TestingFramework {
  private config: TestingConfig;
  private currentReport: TestingReport | null = null;
  private testListeners: ((result: TestResult) => void)[] = [];
  private suiteListeners: ((suite: TestSuite) => void)[] = [];

  constructor(config?: Partial<TestingConfig>) {
    this.config = {
      skipSlowTests: false,
      skipManualTests: true,
      skipSecurityTests: false,
      verbose: true,
      environment: 'local',
      timeoutMs: 30000,
      ...config,
    };
  }

  /**
   * Ejecuta todos los tests del plan
   */
  async runAllTests(): Promise<TestingReport> {
    logger.info('🧪 ========== INICIANDO TESTING FRAMEWORK ==========');

    const startTime = Date.now();
    this.currentReport = {
      timestamp: new Date(),
      environment: this.config.environment,
      totalSuites: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      totalDuration: 0,
      suites: [],
      summary: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    try {
      // FASE 1: Configuración y Ambiente
      const configSuite = await this.runConfigurationTests();
      this.currentReport.summary.configurationTests = configSuite;

      // FASE 2: Autenticación (solo si configuración pasa)
      const authSuite =
        configSuite.status === 'passed'
          ? await this.runAuthenticationTests()
          : this.createSkippedSuite('authentication', 'Configuración falló');
      this.currentReport.summary.authenticationTests = authSuite;

      // FASE 3: Rutinas y Ejercicios (solo si auth pasa)
      const routineSuite =
        authSuite.status === 'passed'
          ? await this.runRoutineTests()
          : this.createSkippedSuite('routines', 'Autenticación falló');
      this.currentReport.summary.routineTests = routineSuite;

      // FASE 4: Red Social
      const socialSuite = await this.runSocialTests();
      this.currentReport.summary.socialTests = socialSuite;

      // FASE 5: Sistema de Pagos
      const paymentSuite = await this.runPaymentTests();
      this.currentReport.summary.paymentTests = paymentSuite;

      // FASE 7: Performance
      const performanceSuite = this.config.skipSlowTests
        ? this.createSkippedSuite('performance', 'Tests lentos deshabilitados')
        : await this.runPerformanceTests();
      this.currentReport.summary.performanceTests = performanceSuite;

      // FASE 9: Seguridad
      const securitySuite = this.config.skipSecurityTests
        ? this.createSkippedSuite(
            'security',
            'Tests de seguridad deshabilitados'
          )
        : await this.runSecurityTests();
      this.currentReport.summary.securityTests = securitySuite;

      // FASE 8: Compatibilidad
      const compatibilitySuite = await this.runCompatibilityTests();
      this.currentReport.summary.compatibilityTests = compatibilitySuite;

      // Calcular totales
      this.calculateTotals();
      this.currentReport.totalDuration = Date.now() - startTime;

      logger.info('🎉 ========== TESTING FRAMEWORK COMPLETADO ==========');
      this.logSummary();

      return this.currentReport;
    } catch (error) {
      logger.error('🚨 Error en Testing Framework:', error);
      throw error;
    }
  }

  /**
   * FASE 1: Tests de Configuración y Ambiente
   */
  async runConfigurationTests(): Promise<TestSuite> {
    logger.info('🚀 Ejecutando FASE 1: Configuración y Ambiente');

    const suite: TestSuite = {
      id: 'configuration',
      name: 'Configuración y Ambiente',
      description: 'Validación de variables de entorno y configuración inicial',
      tests: [],
      status: 'running',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
    };

    const startTime = Date.now();

    // Test 1: Validación de Variables de Entorno
    suite.tests.push(
      await this.runTest(
        'config-001',
        'Validación de Variables de Entorno',
        'configuration',
        async () => {
          const validation =
            environmentValidationUtils.validateCurrentEnvironment();

          if (!validation.isValid) {
            throw new Error(
              `Variables inválidas: ${validation.missingRequired.join(', ')}`
            );
          }

          return {
            environment: validation.environment,
            missingRequired: validation.missingRequired.length,
            missingOptional: validation.missingOptional.length,
            invalidValues: validation.invalidValues.length,
          };
        }
      )
    );

    // Test 2: Consistencia de Environment Object
    suite.tests.push(
      await this.runTest(
        'config-002',
        'Consistencia Environment Object vs process.env',
        'configuration',
        async () => {
          const validation =
            environmentValidationUtils.validateCurrentEnvironment();

          if (!validation.isValid) {
            throw new Error(
              `Configuración no válida: ${validation.missingRequired.length} requeridas faltantes`
            );
          }

          return { missingRequired: validation.missingRequired.length };
        }
      )
    );

    // Test 3: Archivo .env Correcto
    suite.tests.push(
      await this.runTest(
        'config-003',
        'Validación de Archivo .env Correcto',
        'configuration',
        async () => {
          const report = environmentValidationUtils.generateEnvironmentReport();

          if (!report.isValid) {
            throw new Error(
              `Reporte muestra problemas: ${report.warnings.length} warnings`
            );
          }

          return {
            environment: report.environment,
            warnings: report.warnings.length,
          };
        }
      )
    );

    suite.duration = Date.now() - startTime;
    suite.status = this.calculateSuiteStatus(suite);
    this.updateSuiteStats(suite);

    this.notifySuiteComplete(suite);
    return suite;
  }

  /**
   * FASE 2: Tests de Autenticación
   */
  async runAuthenticationTests(): Promise<TestSuite> {
    logger.info('🔐 Ejecutando FASE 2: Autenticación y Autorización');

    const suite: TestSuite = {
      id: 'authentication',
      name: 'Autenticación y Autorización',
      description: 'Validación de login, JWT, tokens y persistencia de sesión',
      tests: [],
      status: 'running',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
    };

    const startTime = Date.now();

    // Test 1: Estado de Autenticación Actual
    suite.tests.push(
      await this.runTest(
        'auth-001',
        'Verificar Estado de Autenticación Actual',
        'authentication',
        async () => {
          const isAuthenticated = authService.isAuthenticated();
          const userData = await authService.getUserData();

          return {
            isAuthenticated,
            hasUserData: !!userData,
            userId: userData?.id || null,
            email: userData?.email || null,
          };
        }
      )
    );

    // Test 2: Validación JWT
    suite.tests.push(
      await this.runTest(
        'auth-002',
        'Validación Completa de JWT',
        'authentication',
        async () => {
          const validation = await jwtValidationUtils.validateStoredJWT();

          if (!validation.isValid && authService.isAuthenticated()) {
            throw new Error(
              `JWT inválido pero usuario autenticado: ${validation.errors.join(', ')}`
            );
          }

          return {
            isValid: validation.isValid,
            isExpired: validation.isExpired,
            timeUntilExpiry: validation.timeUntilExpiry,
            errorsCount: validation.errors.length,
          };
        }
      )
    );

    // Test 3: Consistencia AuthService vs JWT
    suite.tests.push(
      await this.runTest(
        'auth-003',
        'Consistencia AuthService vs JWT',
        'authentication',
        async () => {
          const consistency =
            await jwtValidationUtils.validateAuthServiceConsistency();

          if (!consistency.isConsistent) {
            throw new Error(
              `Inconsistencias: ${consistency.issues.join(', ')}`
            );
          }

          return {
            isConsistent: consistency.isConsistent,
            issuesCount: consistency.issues.length,
          };
        }
      )
    );

    // Test 4: Datos en AsyncStorage
    suite.tests.push(
      await this.runTest(
        'auth-004',
        'Validación de Datos en AsyncStorage',
        'authentication',
        async () => {
          const requiredKeys = ['@auth_token', '@refresh_token', '@user_data'];
          const results: Record<string, boolean> = {};

          for (const key of requiredKeys) {
            const value = await AsyncStorage.getItem(key);
            results[key] = !!value;
          }

          const missingKeys = Object.entries(results)
            .filter(([_, exists]) => !exists)
            .map(([key]) => key);

          if (missingKeys.length > 0 && authService.isAuthenticated()) {
            throw new Error(
              `Claves faltantes en AsyncStorage: ${missingKeys.join(', ')}`
            );
          }

          return results;
        }
      )
    );

    // Test 5: Test de Refresh Token (si está autenticado)
    if (authService.isAuthenticated()) {
      suite.tests.push(
        await this.runTest(
          'auth-005',
          'Test de Refresh Token',
          'authentication',
          async () => {
            const result = await tokenTestUtils.testRefreshToken();

            if (!result) {
              throw new Error('Refresh token falló');
            }

            return { refreshSuccess: result };
          }
        )
      );
    }

    suite.duration = Date.now() - startTime;
    suite.status = this.calculateSuiteStatus(suite);
    this.updateSuiteStats(suite);

    this.notifySuiteComplete(suite);
    return suite;
  }

  /**
   * FASE 3: Tests de Rutinas (Placeholder - se expandirá)
   */
  async runRoutineTests(): Promise<TestSuite> {
    logger.info('🏋️‍♂️ Ejecutando FASE 3: Rutinas y Ejercicios (Básico)');

    const suite: TestSuite = {
      id: 'routines',
      name: 'Rutinas y Ejercicios',
      description: 'Validación básica de sistema de rutinas',
      tests: [],
      status: 'running',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      duration: 0,
    };

    const startTime = Date.now();

    // Test básico de conexión a servicios de rutinas
    suite.tests.push(
      await this.runTest(
        'routine-001',
        'Servicios de Rutinas Disponibles',
        'routines',
        async () => {
          // Verificar que los servicios están importados correctamente
          const { routineTemplateService, exerciseService } = await import(
            '@/services'
          );

          return {
            routineTemplateServiceAvailable: !!routineTemplateService,
            exerciseServiceAvailable: !!exerciseService,
          };
        }
      )
    );

    suite.duration = Date.now() - startTime;
    suite.status = this.calculateSuiteStatus(suite);
    this.updateSuiteStats(suite);

    this.notifySuiteComplete(suite);
    return suite;
  }

  /**
   * Crea suite placeholder para tests no implementados
   */
  private createSkippedSuite(id: string, reason: string): TestSuite {
    return {
      id,
      name: `${id} (Omitido)`,
      description: `Suite omitida: ${reason}`,
      tests: [],
      status: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 1,
      duration: 0,
    };
  }

  /**
   * Suites placeholder que se implementarán después
   */
  async runSocialTests(): Promise<TestSuite> {
    return this.createSkippedSuite('social', 'No implementado aún');
  }

  async runPaymentTests(): Promise<TestSuite> {
    return this.createSkippedSuite('payments', 'No implementado aún');
  }

  async runPerformanceTests(): Promise<TestSuite> {
    return this.createSkippedSuite('performance', 'No implementado aún');
  }

  async runSecurityTests(): Promise<TestSuite> {
    return this.createSkippedSuite('security', 'No implementado aún');
  }

  async runCompatibilityTests(): Promise<TestSuite> {
    return this.createSkippedSuite('compatibility', 'No implementado aún');
  }

  /**
   * Ejecuta un test individual con manejo de errores y timing
   */
  private async runTest(
    id: string,
    name: string,
    phase: string,
    testFn: () => Promise<Record<string, unknown>>
  ): Promise<TestResult> {
    const startTime = Date.now();
    const result: TestResult = {
      id,
      name,
      phase,
      status: 'running',
      duration: 0,
      timestamp: new Date(),
    };

    this.notifyTestStart(result);

    try {
      if (this.config.verbose) {
        logger.info(`  🧪 Ejecutando: ${name}`);
      }

      const details = (await Promise.race([
        testFn(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Test timeout')),
            this.config.timeoutMs
          )
        ),
      ])) as Record<string, unknown>;

      result.status = 'passed';
      result.details = details;
      result.duration = Date.now() - startTime;

      if (this.config.verbose) {
        logger.info(`  ✅ ${name} - ${result.duration}ms`);
      }
    } catch (error) {
      result.status = 'failed';
      result.error = String(error);
      result.duration = Date.now() - startTime;

      if (this.config.verbose) {
        logger.error(`  ❌ ${name} - ${error}`);
      }
    }

    this.notifyTestComplete(result);
    return result;
  }

  /**
   * Calcula el estado de una suite basado en sus tests
   */
  private calculateSuiteStatus(
    suite: TestSuite
  ): 'passed' | 'failed' | 'running' | 'pending' {
    if (suite.tests.some((t) => t.status === 'running')) return 'running';
    if (suite.tests.some((t) => t.status === 'failed')) return 'failed';
    if (suite.tests.every((t) => t.status === 'passed')) return 'passed';
    return 'pending';
  }

  /**
   * Actualiza las estadísticas de una suite
   */
  private updateSuiteStats(suite: TestSuite): void {
    suite.totalTests = suite.tests.length;
    suite.passedTests = suite.tests.filter((t) => t.status === 'passed').length;
    suite.failedTests = suite.tests.filter((t) => t.status === 'failed').length;
    suite.skippedTests = suite.tests.filter(
      (t) => t.status === 'skipped'
    ).length;
  }

  /**
   * Calcula totales del reporte
   */
  private calculateTotals(): void {
    if (!this.currentReport) return;

    const allSuites = Object.values(this.currentReport.summary);

    this.currentReport.totalSuites = allSuites.length;
    this.currentReport.totalTests = allSuites.reduce(
      (sum, suite) => sum + suite.totalTests,
      0
    );
    this.currentReport.passedTests = allSuites.reduce(
      (sum, suite) => sum + suite.passedTests,
      0
    );
    this.currentReport.failedTests = allSuites.reduce(
      (sum, suite) => sum + suite.failedTests,
      0
    );
    this.currentReport.skippedTests = allSuites.reduce(
      (sum, suite) => sum + suite.skippedTests,
      0
    );

    this.currentReport.suites = allSuites;
  }

  /**
   * Log del resumen final
   */
  private logSummary(): void {
    if (!this.currentReport) return;

    logger.info('📊 ========== RESUMEN DE TESTING ==========');
    logger.info(`🎯 Total Tests: ${this.currentReport.totalTests}`);
    logger.info(`✅ Passed: ${this.currentReport.passedTests}`);
    logger.info(`❌ Failed: ${this.currentReport.failedTests}`);
    logger.info(`⏭️ Skipped: ${this.currentReport.skippedTests}`);
    logger.info(`⏱️ Duration: ${this.currentReport.totalDuration}ms`);
    logger.info(`🌍 Environment: ${this.currentReport.environment}`);

    Object.values(this.currentReport.summary).forEach((suite) => {
      const icon =
        suite.status === 'passed'
          ? '✅'
          : suite.status === 'failed'
            ? '❌'
            : '⏭️';
      logger.info(
        `${icon} ${suite.name}: ${suite.passedTests}/${suite.totalTests}`
      );
    });
  }

  /**
   * Event listeners para notificaciones
   */
  onTestComplete(callback: (result: TestResult) => void): void {
    this.testListeners.push(callback);
  }

  onSuiteComplete(callback: (suite: TestSuite) => void): void {
    this.suiteListeners.push(callback);
  }

  private notifyTestStart(_result: TestResult): void {
    // Implementar si se necesita
  }

  private notifyTestComplete(result: TestResult): void {
    this.testListeners.forEach((callback) => {
      try {
        callback(result);
      } catch (error) {
        logger.error('Error in test listener:', error);
      }
    });
  }

  private notifySuiteComplete(suite: TestSuite): void {
    this.suiteListeners.forEach((callback) => {
      try {
        callback(suite);
      } catch (error) {
        logger.error('Error in suite listener:', error);
      }
    });
  }

  /**
   * Obtiene el reporte actual
   */
  getCurrentReport(): TestingReport | null {
    return this.currentReport;
  }

  /**
   * Genera reporte en formato JSON
   */
  exportReport(): string {
    return JSON.stringify(this.currentReport, null, 2);
  }
}

// Instancia global del framework
export const testingFramework = new TestingFramework();

// Solo en desarrollo: exponer globalmente
if (__DEV__) {
  (globalThis as Record<string, unknown>).testingFramework = testingFramework;
}
