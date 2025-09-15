// Utilidades para simular condiciones de red y testing de performance
import { logger } from '@/utils/logger';

/**
 * Configuración de simulación de red
 */
export interface NetworkSimulationConfig {
  enabled: boolean;
  latency: number; // ms
  bandwidth: 'slow-3g' | 'fast-3g' | '4g' | 'wifi' | 'offline';
  packetLoss: number; // 0-1 (porcentaje)
  jitter: number; // variación en latency (ms)
}

/**
 * Métricas de performance de red
 */
export interface NetworkPerformanceMetrics {
  requestTime: number;
  responseTime: number;
  totalTime: number;
  bytesTransferred: number;
  success: boolean;
  error?: string;
  retries: number;
}

/**
 * Resultado de test de red
 */
export interface NetworkTestResult {
  endpoint: string;
  method: string;
  config: NetworkSimulationConfig;
  metrics: NetworkPerformanceMetrics;
  timestamp: Date;
}

/**
 * Bandwidths en KB/s
 */
const BANDWIDTH_LIMITS = {
  'slow-3g': 50, // 50 KB/s
  'fast-3g': 150, // 150 KB/s
  '4g': 500, // 500 KB/s
  wifi: 1000, // 1 MB/s
  offline: 0,
};

let currentNetworkConfig: NetworkSimulationConfig = {
  enabled: false,
  latency: 0,
  bandwidth: 'wifi',
  packetLoss: 0,
  jitter: 0,
};

export const networkSimulationUtils = {
  /**
   * Configura la simulación de red
   */
  setNetworkConditions(config: Partial<NetworkSimulationConfig>): void {
    currentNetworkConfig = { ...currentNetworkConfig, ...config };

    if (currentNetworkConfig.enabled) {
      logger.info('🌐 Simulación de red activada:', currentNetworkConfig);
    } else {
      logger.info('🌐 Simulación de red desactivada');
    }
  },

  /**
   * Obtiene la configuración actual de red
   */
  getCurrentNetworkConfig(): NetworkSimulationConfig {
    return { ...currentNetworkConfig };
  },

  /**
   * Simula delay de red basado en configuración
   */
  async simulateNetworkDelay(): Promise<void> {
    if (!currentNetworkConfig.enabled) return;

    const baseLatency = currentNetworkConfig.latency;
    const jitter = Math.random() * currentNetworkConfig.jitter;
    const totalDelay = baseLatency + jitter;

    if (totalDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  },

  /**
   * Simula fallo de paquetes
   */
  shouldSimulatePacketLoss(): boolean {
    if (!currentNetworkConfig.enabled) return false;
    return Math.random() < currentNetworkConfig.packetLoss;
  },

  /**
   * Simula condiciones de offline
   */
  isOfflineSimulated(): boolean {
    return (
      currentNetworkConfig.enabled &&
      currentNetworkConfig.bandwidth === 'offline'
    );
  },

  /**
   * Envuelve una función fetch con simulación de red
   */
  async simulatedFetch<T>(
    url: string,
    options: RequestInit = {},
    dataSize: number = 1024 // bytes estimados
  ): Promise<{
    data?: T;
    metrics: NetworkPerformanceMetrics;
  }> {
    const startTime = Date.now();
    let retries = 0;
    const maxRetries = 3;

    const metrics: NetworkPerformanceMetrics = {
      requestTime: 0,
      responseTime: 0,
      totalTime: 0,
      bytesTransferred: dataSize,
      success: false,
      retries: 0,
    };

    try {
      // Simular offline
      if (this.isOfflineSimulated()) {
        throw new Error('Simulando condición offline');
      }

      while (retries <= maxRetries) {
        try {
          // Simular pérdida de paquetes
          if (this.shouldSimulatePacketLoss()) {
            retries++;
            if (retries > maxRetries) {
              throw new Error(
                'Máximo de reintentos alcanzado por pérdida de paquetes'
              );
            }
            logger.warn(
              `🌐 Simulando pérdida de paquetes, reintento ${retries}`
            );
            continue;
          }

          // Simular delay de red
          const requestStart = Date.now();
          await this.simulateNetworkDelay();
          metrics.requestTime = Date.now() - requestStart;

          // Simular bandwidth - delay adicional basado en tamaño de datos
          if (currentNetworkConfig.enabled) {
            const bandwidthLimit =
              BANDWIDTH_LIMITS[currentNetworkConfig.bandwidth];
            if (bandwidthLimit > 0) {
              const transferTime = (dataSize / 1024 / bandwidthLimit) * 1000; // ms
              await new Promise((resolve) => setTimeout(resolve, transferTime));
            }
          }

          const responseStart = Date.now();

          // Hacer la petición real (en testing, simular respuesta)
          let data: T;
          if (__DEV__) {
            // En desarrollo, simular respuesta
            data = { success: true, message: 'Respuesta simulada' } as T;
          } else {
            // En producción, hacer fetch real
            const response = await fetch(url, options);
            data = (await response.json()) as T;
          }

          metrics.responseTime = Date.now() - responseStart;
          metrics.totalTime = Date.now() - startTime;
          metrics.success = true;
          metrics.retries = retries;

          return { data, metrics };
        } catch (error) {
          retries++;
          if (retries > maxRetries) {
            metrics.error = `Error después de ${retries} intentos: ${error}`;
            throw error;
          }

          // Delay antes del siguiente intento
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        }
      }

      throw new Error('Máximo de reintentos alcanzado');
    } catch (error) {
      metrics.totalTime = Date.now() - startTime;
      metrics.error = String(error);
      metrics.retries = retries;

      return { metrics };
    }
  },

  /**
   * Test de conectividad básica
   */
  async testConnectivity(): Promise<NetworkTestResult> {
    const config = this.getCurrentNetworkConfig();

    try {
      const result = await this.simulatedFetch(
        'https://api.gymmetry.com/health',
        { method: 'GET' },
        512 // 512 bytes estimados para health check
      );

      return {
        endpoint: '/health',
        method: 'GET',
        config,
        metrics: result.metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        endpoint: '/health',
        method: 'GET',
        config,
        metrics: {
          requestTime: 0,
          responseTime: 0,
          totalTime: 0,
          bytesTransferred: 0,
          success: false,
          error: String(error),
          retries: 0,
        },
        timestamp: new Date(),
      };
    }
  },

  /**
   * Test de carga de datos grandes
   */
  async testLargeDataLoad(): Promise<NetworkTestResult> {
    const config = this.getCurrentNetworkConfig();

    try {
      const result = await this.simulatedFetch(
        'https://api.gymmetry.com/routines/templates',
        { method: 'GET' },
        50 * 1024 // 50KB estimados para lista de rutinas
      );

      return {
        endpoint: '/routines/templates',
        method: 'GET',
        config,
        metrics: result.metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        endpoint: '/routines/templates',
        method: 'GET',
        config,
        metrics: {
          requestTime: 0,
          responseTime: 0,
          totalTime: 5000, // timeout simulado
          bytesTransferred: 0,
          success: false,
          error: String(error),
          retries: 3,
        },
        timestamp: new Date(),
      };
    }
  },

  /**
   * Test de subida de datos
   */
  async testDataUpload(): Promise<NetworkTestResult> {
    const config = this.getCurrentNetworkConfig();

    try {
      const result = await this.simulatedFetch(
        'https://api.gymmetry.com/daily',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            /* datos simulados de rutina */
          }),
        },
        2 * 1024 // 2KB para datos de rutina completada
      );

      return {
        endpoint: '/daily',
        method: 'POST',
        config,
        metrics: result.metrics,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        endpoint: '/daily',
        method: 'POST',
        config,
        metrics: {
          requestTime: 0,
          responseTime: 0,
          totalTime: 0,
          bytesTransferred: 0,
          success: false,
          error: String(error),
          retries: 0,
        },
        timestamp: new Date(),
      };
    }
  },

  /**
   * Presets de condiciones de red comunes
   */
  presets: {
    /**
     * Condiciones ideales
     */
    perfect(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 10,
        bandwidth: 'wifi',
        packetLoss: 0,
        jitter: 5,
      });
    },

    /**
     * Conexión móvil rápida
     */
    mobile4g(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 50,
        bandwidth: '4g',
        packetLoss: 0.01,
        jitter: 20,
      });
    },

    /**
     * Conexión móvil lenta
     */
    mobile3g(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 200,
        bandwidth: 'fast-3g',
        packetLoss: 0.05,
        jitter: 50,
      });
    },

    /**
     * Conexión muy lenta
     */
    slow(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 500,
        bandwidth: 'slow-3g',
        packetLoss: 0.1,
        jitter: 100,
      });
    },

    /**
     * Conexión inestable
     */
    unstable(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 100,
        bandwidth: 'fast-3g',
        packetLoss: 0.15,
        jitter: 200,
      });
    },

    /**
     * Sin conexión
     */
    offline(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: true,
        latency: 0,
        bandwidth: 'offline',
        packetLoss: 1,
        jitter: 0,
      });
    },

    /**
     * Desactivar simulación
     */
    disable(): void {
      networkSimulationUtils.setNetworkConditions({
        enabled: false,
        latency: 0,
        bandwidth: 'wifi',
        packetLoss: 0,
        jitter: 0,
      });
    },
  },

  /**
   * Genera reporte de tests de red
   */
  async generateNetworkTestReport(): Promise<void> {
    logger.info('🌐 ============ REPORTE DE TESTING DE RED ============');

    const testScenarios = [
      { name: 'WiFi Perfecto', preset: 'perfect' },
      { name: 'Móvil 4G', preset: 'mobile4g' },
      { name: 'Móvil 3G', preset: 'mobile3g' },
      { name: 'Conexión Lenta', preset: 'slow' },
      { name: 'Conexión Inestable', preset: 'unstable' },
    ] as const;

    for (const scenario of testScenarios) {
      logger.info(`\n📡 Probando: ${scenario.name}`);

      // Configurar preset
      (this.presets as Record<string, () => void>)[scenario.preset]();

      // Test de conectividad
      const connectivityTest = await this.testConnectivity();
      logger.info(
        `   🔍 Conectividad: ${connectivityTest.metrics.success ? '✅' : '❌'}`
      );
      if (connectivityTest.metrics.success) {
        logger.info(
          `      - Tiempo total: ${connectivityTest.metrics.totalTime}ms`
        );
      } else {
        logger.info(`      - Error: ${connectivityTest.metrics.error}`);
      }

      // Test de carga de datos
      const dataLoadTest = await this.testLargeDataLoad();
      logger.info(
        `   📥 Carga de datos: ${dataLoadTest.metrics.success ? '✅' : '❌'}`
      );
      if (dataLoadTest.metrics.success) {
        logger.info(`      - Tiempo: ${dataLoadTest.metrics.totalTime}ms`);
        logger.info(`      - Reintentos: ${dataLoadTest.metrics.retries}`);
      }

      // Test de subida
      const uploadTest = await this.testDataUpload();
      logger.info(
        `   📤 Subida de datos: ${uploadTest.metrics.success ? '✅' : '❌'}`
      );
      if (uploadTest.metrics.success) {
        logger.info(`      - Tiempo: ${uploadTest.metrics.totalTime}ms`);
      }

      // Pequeña pausa entre escenarios
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Volver a condiciones normales
    this.presets.disable();

    logger.info('\n🌐 ===================================================');
  },
};

// Solo en desarrollo: exponer globalmente y configurar simulación ligera por defecto
if (__DEV__) {
  (globalThis as Record<string, unknown>).networkSimulationUtils =
    networkSimulationUtils;

  // Configurar simulación ligera por defecto en desarrollo
  networkSimulationUtils.setNetworkConditions({
    enabled: true,
    latency: 50,
    bandwidth: '4g',
    packetLoss: 0.01,
    jitter: 20,
  });
}
