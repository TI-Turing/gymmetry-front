import React, { Suspense, lazy, ComponentType } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useThemedStyles } from '@/hooks/useThemedStyles';

// Tipos para configuración del lazy loading
interface LazyComponentProps {
  fallback?: React.ComponentType;
  errorBoundary?: React.ComponentType<{ error: Error; retry: () => void }>;
  retryDelay?: number;
  maxRetries?: number;
}

// Componente de loading por defecto
const DefaultFallback: React.FC = () => {
  const styles = useThemedStyles(makeFallbackStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={styles.color} />
      <Text style={styles.text}>Cargando...</Text>
    </View>
  );
};

const makeFallbackStyles = (theme: 'light' | 'dark') => ({
  container: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
    backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
  },
  text: {
    marginTop: 10,
    color: theme === 'dark' ? '#FFFFFF' : '#000000',
    fontSize: 16,
  },
  color: theme === 'dark' ? '#FF6B35' : '#007AFF',
});

// Error Boundary por defecto
class DefaultErrorBoundary extends React.Component<
  { error: Error; retry: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    error: Error;
    retry: () => void;
    children: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
            Error al cargar el componente
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {this.props.error.message}
          </Text>
          <Text
            style={{ color: '#007AFF', fontSize: 16 }}
            onPress={() => {
              this.setState({ hasError: false });
              this.props.retry();
            }}
          >
            Reintentar
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Función para crear componentes lazy con configuración
export const createLazyComponent = <P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentProps = {}
) => {
  const {
    fallback: Fallback = DefaultFallback,
    errorBoundary: ErrorBoundary = DefaultErrorBoundary,
    retryDelay = 1000,
    maxRetries = 3,
  } = options;

  const LazyComponent = lazy(componentImport);

  const LazyWrapper = React.forwardRef<unknown, P>((props, ref) => {
    const [retryCount, setRetryCount] = React.useState(0);
    const [error, setError] = React.useState<Error | null>(null);

    const retry = React.useCallback(() => {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          setError(null);
        }, retryDelay);
      }
    }, [retryCount]);

    if (error && retryCount >= maxRetries) {
      return (
        <ErrorBoundary error={error} retry={() => setRetryCount(0)}>
          <></>
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary error={error || new Error('Unknown error')} retry={retry}>
        <Suspense fallback={<Fallback />}>
          <LazyComponent {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    );
  });

  LazyWrapper.displayName = `LazyComponent(${LazyComponent.name || 'Component'})`;
  return LazyWrapper;
};

// Componentes lazy comunes pre-configurados

// Componente lazy para listas grandes
export const LazyFeedList = createLazyComponent(
  () => import('./UnifiedFeedList'),
  {
    fallback: DefaultFallback,
  }
);

// Componente lazy para modales de comentarios
export const LazyCommentsModal = createLazyComponent(
  () => import('../social/EnhancedCommentsModal'),
  {
    fallback: DefaultFallback,
  }
);

// Componente lazy para el composer de posts
export const LazyPostComposer = createLazyComponent(
  () => import('../social/PostComposer'),
  {
    fallback: DefaultFallback,
  }
);

// Componente lazy para configuraciones
export const LazySettingsScreen = createLazyComponent(
  () => import('../../app/settings'),
  {
    fallback: DefaultFallback,
  }
);

// Hook para lazy loading condicional
export const useLazyComponent = <P extends object>(
  condition: boolean,
  componentImport: () => Promise<{ default: ComponentType<P> }>,
  options?: LazyComponentProps
) => {
  const [Component, setComponent] = React.useState<ComponentType<P> | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (condition && !Component && !loading) {
      setLoading(true);
      setError(null);

      componentImport()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((err) => {
          setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [condition, Component, loading, componentImport]);

  const LazyComponent = React.useMemo(() => {
    if (!Component) return null;
    return createLazyComponent(
      () => Promise.resolve({ default: Component }),
      options
    );
  }, [Component, options]);

  return {
    Component: LazyComponent,
    loading,
    error,
  };
};

// Utilidad para precargar componentes
export const preloadComponent = async <P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>
): Promise<ComponentType<P>> => {
  try {
    const module = await componentImport();
    return module.default;
  } catch (error) {
    // Error preloading component
    throw error;
  }
};

// HOC para lazy loading basado en viewport
export const withLazyLoading = <P extends object>(
  componentImport: () => Promise<{ default: ComponentType<P> }>,
  options?: LazyComponentProps
) => {
  const LazyVisibilityWrapper = (props: P) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef<View>(null);

    React.useEffect(() => {
      // Simular intersection observer para React Native
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    const LazyComponent = React.useMemo(
      () => createLazyComponent(componentImport, options),
      []
    );

    return (
      <View ref={ref} style={{ flex: 1 }}>
        {isVisible ? (
          React.createElement(LazyComponent, props as never)
        ) : (
          <DefaultFallback />
        )}
      </View>
    );
  };

  LazyVisibilityWrapper.displayName = 'LazyVisibilityWrapper';
  return LazyVisibilityWrapper;
};
