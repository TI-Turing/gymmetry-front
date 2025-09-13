import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';

// Tipos para métricas de performance
interface PerformanceMetrics {
  renderTime: number;
  componentMounts: number;
  reRenders: number;
  memoryUsage?: number;
  interactionTime?: number;
  scrollPerformance?: {
    fps: number;
    jankyFrames: number;
    totalFrames: number;
  };
}

interface PerformanceEntry {
  componentName: string;
  timestamp: number;
  metrics: PerformanceMetrics;
  props?: Record<string, unknown>;
}

// Store global para métricas
class PerformanceMonitor {
  private entries: PerformanceEntry[] = [];
  private maxEntries = 1000;
  private listeners: ((entry: PerformanceEntry) => void)[] = [];

  addEntry(entry: PerformanceEntry) {
    this.entries.push(entry);

    // Limitar número de entradas para evitar memory leaks
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Notificar listeners
    this.listeners.forEach((listener) => listener(entry));
  }

  getEntries(componentName?: string): PerformanceEntry[] {
    if (componentName) {
      return this.entries.filter(
        (entry) => entry.componentName === componentName
      );
    }
    return [...this.entries];
  }

  getAverageMetrics(componentName: string): Partial<PerformanceMetrics> {
    const entries = this.getEntries(componentName);
    if (entries.length === 0) return {};

    const avg = entries.reduce(
      (acc, entry) => ({
        renderTime: acc.renderTime + entry.metrics.renderTime,
        componentMounts: acc.componentMounts + entry.metrics.componentMounts,
        reRenders: acc.reRenders + entry.metrics.reRenders,
      }),
      { renderTime: 0, componentMounts: 0, reRenders: 0 }
    );

    return {
      renderTime: avg.renderTime / entries.length,
      componentMounts: avg.componentMounts / entries.length,
      reRenders: avg.reRenders / entries.length,
    };
  }

  subscribe(listener: (entry: PerformanceEntry) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  clear() {
    this.entries = [];
  }

  exportData() {
    return {
      timestamp: Date.now(),
      entries: this.entries,
      summary: this.getSummary(),
    };
  }

  private getSummary() {
    const componentNames = [
      ...new Set(this.entries.map((e) => e.componentName)),
    ];
    return componentNames.map((name) => ({
      componentName: name,
      averageMetrics: this.getAverageMetrics(name),
      totalEntries: this.getEntries(name).length,
    }));
  }
}

const performanceMonitor = new PerformanceMonitor();

// Hook principal para monitoreo de performance
export const usePerformanceMonitor = (
  componentName: string,
  enabled = true
) => {
  const _mountTimeRef = useRef<number>(Date.now());
  const renderCountRef = useRef(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    componentMounts: 0,
    reRenders: 0,
  });

  // Medir tiempo de render
  const measureRenderTime = useCallback(() => {
    if (!enabled) return;

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      renderCountRef.current += 1;

      const newMetrics: PerformanceMetrics = {
        renderTime,
        componentMounts: renderCountRef.current === 1 ? 1 : 0,
        reRenders: renderCountRef.current - 1,
      };

      setMetrics(newMetrics);

      performanceMonitor.addEntry({
        componentName,
        timestamp: Date.now(),
        metrics: newMetrics,
      });
    };
  }, [componentName, enabled]);

  // Medir interacciones
  const measureInteraction = useCallback(
    (interactionName: string) => {
      if (!enabled) return () => undefined;

      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const interactionTime = endTime - startTime;

        performanceMonitor.addEntry({
          componentName: `${componentName}_${interactionName}`,
          timestamp: Date.now(),
          metrics: {
            ...metrics,
            interactionTime,
          },
        });
      };
    },
    [componentName, enabled, metrics]
  );

  return {
    metrics,
    measureRenderTime,
    measureInteraction,
    getAverageMetrics: () =>
      performanceMonitor.getAverageMetrics(componentName),
  };
};

// HOC para monitorear componentes automáticamente
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const MonitoredComponent = React.forwardRef<unknown, P>((props, ref) => {
    const name =
      componentName ||
      WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Unknown';
    const { measureRenderTime } = usePerformanceMonitor(name);

    useEffect(() => {
      const endMeasure = measureRenderTime();
      return endMeasure;
    });

    return React.createElement(WrappedComponent, { ...props } as P & {
      ref: typeof ref;
    });
  });

  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;

  return MonitoredComponent;
};

// Hook para monitorear scroll performance
export const useScrollPerformanceMonitor = (enabled = true) => {
  const [scrollMetrics, setScrollMetrics] = useState({
    fps: 0,
    jankyFrames: 0,
    totalFrames: 0,
  });

  const frameTimesRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const measureScrollPerformance = useCallback(() => {
    if (!enabled) return;

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let jankyFrames = 0;

    const measureFrame = () => {
      const currentTime = performance.now();
      const frameDuration = currentTime - lastFrameTime;

      frameTimesRef.current.push(frameDuration);
      frameCount++;

      // Considerar frame "janky" si toma más de 16.67ms (60fps)
      if (frameDuration > 16.67) {
        jankyFrames++;
      }

      // Mantener solo los últimos 60 frames (1 segundo a 60fps)
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      // Calcular FPS basado en los últimos frames
      const avgFrameTime =
        frameTimesRef.current.reduce((a, b) => a + b, 0) /
        frameTimesRef.current.length;
      const fps = 1000 / avgFrameTime;

      setScrollMetrics({
        fps: Math.round(fps),
        jankyFrames,
        totalFrames: frameCount,
      });

      lastFrameTime = currentTime;
      animationFrameRef.current = requestAnimationFrame(measureFrame);
    };

    animationFrameRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  return {
    scrollMetrics,
    measureScrollPerformance,
  };
};

// Hook para detectar memory leaks
export const useMemoryMonitor = (componentName: string, enabled = true) => {
  const [memoryUsage, setMemoryUsage] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      // En React Native, no tenemos acceso directo a memory API
      // Podemos usar performance.memory en web o hacer estimaciones
      if (typeof window !== 'undefined' && window.performance) {
        try {
          const memory = (
            window.performance as unknown as {
              memory?: { usedJSHeapSize: number };
            }
          ).memory;
          if (memory) {
            setMemoryUsage(memory.usedJSHeapSize);
          }
        } catch {
          // Memory API not available
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [enabled]);

  return { memoryUsage };
};

// Utilidades para reportes
export const generatePerformanceReport = () => {
  const data = performanceMonitor.exportData();

  const report = {
    ...data,
    deviceInfo: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      scale: Dimensions.get('window').scale,
    },
    recommendations: generateRecommendations(data.summary),
  };

  return report;
};

const generateRecommendations = (summary: unknown[]) => {
  const recommendations: string[] = [];

  void summary; // TODO: Implement recommendations logic

  return recommendations;
};

// Exportar monitor global para acceso directo
export { performanceMonitor };

// Configuración global
export const configurePerformanceMonitoring = (options: {
  maxEntries?: number;
  enabledInProduction?: boolean;
}) => {
  if (options.maxEntries) {
    // TODO: Implement maxEntries configuration
    void options.maxEntries;
  }

  // En producción, desactivar por defecto a menos que se especifique
  const isProduction = process.env.NODE_ENV === 'production';
  return !isProduction || options.enabledInProduction;
};
