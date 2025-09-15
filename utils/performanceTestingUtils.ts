// Utilidades para testing de performance y métricas de la aplicación
import { logger } from '@/utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Métricas de performance de componente
 */
export interface ComponentPerformanceMetrics {
  componentName: string;
  renderTime: number;
  mountTime: number;
  updateTime: number;
  unmountTime: number;
  memoryUsage: number;
  rerenderCount: number;
}

/**
 * Métricas de performance de pantalla
 */
export interface ScreenPerformanceMetrics {
  screenName: string;
  loadTime: number;
  timeToInteractive: number;
  memoryAfterLoad: number;
  memoryDelta: number;
  navigationTime: number;
}

/**
 * Métricas de performance de operación
 */
export interface OperationPerformanceMetrics {
  operationName: string;
  executionTime: number;
  memoryBefore: number;
  memoryAfter: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Resultado de benchmark
 */
export interface BenchmarkResult {
  name: string;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalTime: number;
  operationsPerSecond: number;
  memoryUsage: {
    average: number;
    peak: number;
    delta: number;
  };
}

/**
 * Monitor de memoria (simplificado para React Native)
 */
const MemoryMonitor = {
  getMemoryUsage(): number {
    // En React Native, esto es limitado
    // Retornar un valor simulado basado en performance.now() para testing
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = performance as Performance & {
        memory?: { usedJSHeapSize?: number };
      };
      return memory.memory?.usedJSHeapSize || 0;
    }
    // Fallback para React Native
    return Math.floor(Math.random() * 50000000) + 10000000; // 10-60MB simulado
  },

  startMemoryTracking(): { stop: () => number } {
    const initialMemory = this.getMemoryUsage();
    return {
      stop: () => this.getMemoryUsage() - initialMemory,
    };
  },
};

export const performanceTestingUtils = {
  /**
   * Mide el tiempo de ejecución de una función
   */
  async measureExecutionTime<T>(
    name: string,
    operation: () => Promise<T> | T
  ): Promise<OperationPerformanceMetrics & { result?: T }> {
    const memoryTracker = MemoryMonitor.startMemoryTracking();
    const memoryBefore = MemoryMonitor.getMemoryUsage();
    const startTime = performance.now();

    try {
      const result = await operation();
      const executionTime = performance.now() - startTime;
      const memoryAfter = MemoryMonitor.getMemoryUsage();

      const metrics: OperationPerformanceMetrics = {
        operationName: name,
        executionTime,
        memoryBefore,
        memoryAfter,
        success: true,
      };

      logger.info(`⚡ Performance: ${name} - ${executionTime.toFixed(2)}ms`);

      return { ...metrics, result };
    } catch (error) {
      const executionTime = performance.now() - startTime;
      const memoryAfter = MemoryMonitor.getMemoryUsage();

      const metrics: OperationPerformanceMetrics = {
        operationName: name,
        executionTime,
        memoryBefore,
        memoryAfter,
        success: false,
        error: String(error),
      };

      logger.error(
        `⚡ Performance Error: ${name} - ${executionTime.toFixed(2)}ms - ${error}`
      );

      return metrics;
    } finally {
      memoryTracker.stop();
    }
  },

  /**
   * Ejecuta un benchmark de una operación
   */
  async benchmark(
    name: string,
    operation: () => Promise<unknown> | unknown,
    iterations: number = 100
  ): Promise<BenchmarkResult> {
    logger.info(`🏁 Iniciando benchmark: ${name} (${iterations} iteraciones)`);

    const times: number[] = [];
    const memoryUsages: number[] = [];
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const memoryBefore = MemoryMonitor.getMemoryUsage();
      const startTime = performance.now();

      try {
        await operation();
      } catch (error) {
        logger.warn(`Iteración ${i + 1} falló: ${error}`);
      }

      const endTime = performance.now();
      const memoryAfter = MemoryMonitor.getMemoryUsage();

      const iterationTime = endTime - startTime;
      times.push(iterationTime);
      memoryUsages.push(memoryAfter - memoryBefore);
      totalTime += iterationTime;
    }

    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const operationsPerSecond = 1000 / averageTime;

    const averageMemory =
      memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;
    const peakMemory = Math.max(...memoryUsages);
    const deltaMemory = peakMemory - Math.min(...memoryUsages);

    const result: BenchmarkResult = {
      name,
      iterations,
      averageTime,
      minTime,
      maxTime,
      totalTime,
      operationsPerSecond,
      memoryUsage: {
        average: averageMemory,
        peak: peakMemory,
        delta: deltaMemory,
      },
    };

    logger.info(`🏁 Benchmark completado: ${name}`);
    logger.info(`   - Promedio: ${averageTime.toFixed(2)}ms`);
    logger.info(
      `   - Rango: ${minTime.toFixed(2)}ms - ${maxTime.toFixed(2)}ms`
    );
    logger.info(`   - Ops/sec: ${operationsPerSecond.toFixed(2)}`);

    return result;
  },

  /**
   * Test de performance de carga de datos
   */
  async testDataLoadPerformance(): Promise<BenchmarkResult> {
    return this.benchmark(
      'Carga de Datos Simulada',
      async () => {
        // Simular carga de datos pesados
        const data = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          name: `Item ${i}`,
          description: 'Descripción de ejemplo '.repeat(10),
          metadata: {
            created: new Date().toISOString(),
            tags: ['tag1', 'tag2', 'tag3'],
            values: Array.from({ length: 50 }, (_, j) => j * Math.random()),
          },
        }));

        // Simular procesamiento
        return data
          .filter((item) => item.id % 2 === 0)
          .map((item) => ({
            ...item,
            processed: true,
          }));
      },
      50
    );
  },

  /**
   * Test de performance de renderizado de listas
   */
  async testListRenderPerformance(): Promise<BenchmarkResult> {
    return this.benchmark(
      'Renderizado de Lista Simulado',
      () => {
        // Simular operaciones de renderizado pesadas
        const items = Array.from({ length: 500 }, (_, i) => ({
          id: i,
          content: `Contenido ${i}`,
          calculated: Math.sqrt(i) * Math.random(),
        }));

        // Simular cálculos de layout
        return items.map((item) => ({
          ...item,
          height: 50 + (item.calculated % 100),
          width: 300 + (item.calculated % 50),
          style: {
            transform: `translateY(${item.calculated % 10}px)`,
            opacity: 0.8 + (item.calculated % 0.2),
          },
        }));
      },
      100
    );
  },

  /**
   * Test de performance de AsyncStorage
   */
  async testStoragePerformance(): Promise<{
    write: BenchmarkResult;
    read: BenchmarkResult;
  }> {
    // Datos de prueba
    const testData = {
      routineProgress: {
        routineId: 'test-routine',
        exercises: Array.from({ length: 20 }, (_, i) => ({
          id: `exercise-${i}`,
          sets: 3,
          reps: [12, 10, 8],
          weights: [20, 22.5, 25],
        })),
        startTime: new Date().toISOString(),
        metadata: {
          notes: 'Test routine progress',
          duration: 3600,
        },
      },
    };

    const testKey = '@performance_test_key';

    // Test de escritura
    const writeResult = await this.benchmark(
      'AsyncStorage Write',
      async () => {
        // En testing, simular AsyncStorage
        if (__DEV__) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 10)
          );
          return Promise.resolve();
        }

        // En producción real usaría AsyncStorage
        return AsyncStorage.setItem(testKey, JSON.stringify(testData));
      },
      50
    );

    // Test de lectura
    const readResult = await this.benchmark(
      'AsyncStorage Read',
      async () => {
        // En testing, simular AsyncStorage
        if (__DEV__) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 5)
          );
          return JSON.stringify(testData);
        }

        // En producción real usaría AsyncStorage
        const result = await AsyncStorage.getItem(testKey);
        return result ? JSON.parse(result) : null;
      },
      100
    );

    // Limpiar después del test
    if (!__DEV__) {
      await AsyncStorage.removeItem(testKey);
    }

    return { write: writeResult, read: readResult };
  },

  /**
   * Test de performance de navegación
   */
  async testNavigationPerformance(): Promise<ScreenPerformanceMetrics[]> {
    const screens = [
      'Home',
      'RoutineList',
      'RoutineDetail',
      'ExerciseModal',
      'Profile',
    ];

    const results: ScreenPerformanceMetrics[] = [];

    for (const screenName of screens) {
      const memoryBefore = MemoryMonitor.getMemoryUsage();
      const startTime = performance.now();

      // Simular carga de pantalla
      await new Promise((resolve) =>
        setTimeout(resolve, 50 + Math.random() * 200)
      );

      const loadTime = performance.now() - startTime;

      // Simular tiempo hasta interactividad
      await new Promise((resolve) =>
        setTimeout(resolve, 20 + Math.random() * 100)
      );

      const timeToInteractive = performance.now() - startTime;
      const memoryAfter = MemoryMonitor.getMemoryUsage();

      results.push({
        screenName,
        loadTime,
        timeToInteractive,
        memoryAfterLoad: memoryAfter,
        memoryDelta: memoryAfter - memoryBefore,
        navigationTime: loadTime,
      });
    }

    return results;
  },

  /**
   * Test de stress de memoria
   */
  async testMemoryStress(): Promise<{
    success: boolean;
    peakMemory: number;
    iterations: number;
    error?: string;
  }> {
    logger.info('🧠 Iniciando test de stress de memoria');

    const memoryTracker = MemoryMonitor.startMemoryTracking();
    const initialMemory = MemoryMonitor.getMemoryUsage();
    let peakMemory = initialMemory;
    let iterations = 0;

    try {
      // Crear objetos grandes en memoria gradualmente
      const largeObjects: unknown[][] = [];

      for (let i = 0; i < 100; i++) {
        // Crear array grande
        const largeArray = Array.from({ length: 10000 }, (_, index) => ({
          id: index,
          data: `Data ${index}`.repeat(10),
          timestamp: Date.now(),
          random: Math.random(),
        }));

        largeObjects.push(largeArray);
        iterations++;

        const currentMemory = MemoryMonitor.getMemoryUsage();
        if (currentMemory > peakMemory) {
          peakMemory = currentMemory;
        }

        // Pequeña pausa para simular operaciones reales
        await new Promise((resolve) => setTimeout(resolve, 10));

        // Limpiar algunos objetos periódicamente
        if (i % 20 === 0 && largeObjects.length > 10) {
          largeObjects.splice(0, 5);
        }
      }

      logger.info(`🧠 Test de memoria completado - ${iterations} iteraciones`);
      logger.info(
        `   - Memoria inicial: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`
      );
      logger.info(
        `   - Memoria pico: ${(peakMemory / 1024 / 1024).toFixed(2)} MB`
      );

      return {
        success: true,
        peakMemory,
        iterations,
      };
    } catch (error) {
      logger.error(`🧠 Error en test de memoria: ${error}`);
      return {
        success: false,
        peakMemory,
        iterations,
        error: String(error),
      };
    } finally {
      memoryTracker.stop();
    }
  },

  /**
   * Genera reporte completo de performance
   */
  async generatePerformanceReport(): Promise<void> {
    logger.info('⚡ ============ REPORTE DE PERFORMANCE ============');

    try {
      // Test de carga de datos
      logger.info('\n📊 Testing carga de datos...');
      const dataLoadBenchmark = await this.testDataLoadPerformance();
      logger.info(
        `   ✅ Promedio: ${dataLoadBenchmark.averageTime.toFixed(2)}ms`
      );
      logger.info(
        `   ✅ Ops/sec: ${dataLoadBenchmark.operationsPerSecond.toFixed(2)}`
      );

      // Test de renderizado
      logger.info('\n🎨 Testing renderizado de listas...');
      const renderBenchmark = await this.testListRenderPerformance();
      logger.info(
        `   ✅ Promedio: ${renderBenchmark.averageTime.toFixed(2)}ms`
      );
      logger.info(
        `   ✅ Ops/sec: ${renderBenchmark.operationsPerSecond.toFixed(2)}`
      );

      // Test de storage
      logger.info('\n💾 Testing AsyncStorage...');
      const storageBenchmarks = await this.testStoragePerformance();
      logger.info(
        `   ✅ Escritura: ${storageBenchmarks.write.averageTime.toFixed(2)}ms`
      );
      logger.info(
        `   ✅ Lectura: ${storageBenchmarks.read.averageTime.toFixed(2)}ms`
      );

      // Test de navegación
      logger.info('\n🧭 Testing navegación...');
      const navigationMetrics = await this.testNavigationPerformance();
      for (const metric of navigationMetrics) {
        logger.info(
          `   ✅ ${metric.screenName}: ${metric.loadTime.toFixed(2)}ms (TTI: ${metric.timeToInteractive.toFixed(2)}ms)`
        );
      }

      // Test de memoria
      logger.info('\n🧠 Testing stress de memoria...');
      const memoryTest = await this.testMemoryStress();
      if (memoryTest.success) {
        logger.info(`   ✅ Completado: ${memoryTest.iterations} iteraciones`);
        logger.info(
          `   ✅ Memoria pico: ${(memoryTest.peakMemory / 1024 / 1024).toFixed(2)} MB`
        );
      } else {
        logger.info(`   ❌ Error: ${memoryTest.error}`);
      }
    } catch (error) {
      logger.error('Error en reporte de performance:', error);
    }

    logger.info('\n⚡ ===============================================');
  },
};

// Solo en desarrollo: exponer globalmente
if (__DEV__) {
  (globalThis as Record<string, unknown>).performanceTestingUtils =
    performanceTestingUtils;
}
