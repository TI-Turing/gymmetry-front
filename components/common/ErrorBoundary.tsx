import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import { UI_CONSTANTS } from '@/constants/AppConstants';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | undefined;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <DefaultErrorFallback
          onRetry={this.handleRetry}
          error={this.state.error}
        />
      );
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  onRetry: () => void;
  error?: Error | undefined;
}

const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  onRetry,
  error,
}) => {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        ¡Oops! Algo salió mal
      </Text>

      <Text style={[styles.message, { color: Colors[colorScheme].text }]}>
        Ha ocurrido un error inesperado. Puedes intentar recargar la aplicación.
      </Text>

      {__DEV__ && error && (
        <Text
          style={[styles.errorDetails, { color: Colors[colorScheme].text }]}
        >
          {error.toString()}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.retryButton,
          { backgroundColor: Colors[colorScheme].tint },
        ]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Reintentar"
      >
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: UI_CONSTANTS.SPACING.XL,
  },
  title: {
    fontSize: UI_CONSTANTS.FONT_SIZE.XL,
    fontWeight: UI_CONSTANTS.FONT_WEIGHT.BOLD,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.MD,
  },
  message: {
    fontSize: UI_CONSTANTS.FONT_SIZE.MD,
    textAlign: 'center',
    marginBottom: UI_CONSTANTS.SPACING.XL,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: UI_CONSTANTS.FONT_SIZE.SM,
    fontFamily: 'monospace',
    marginBottom: UI_CONSTANTS.SPACING.LG,
    padding: UI_CONSTANTS.SPACING.MD,
    backgroundColor: '#f5f5f5',
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MEDIUM,
  },
  retryButton: {
    paddingHorizontal: UI_CONSTANTS.SPACING.XL,
    paddingVertical: UI_CONSTANTS.SPACING.MD,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.MEDIUM,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: UI_CONSTANTS.FONT_SIZE.MD,
    fontWeight: UI_CONSTANTS.FONT_WEIGHT.SEMIBOLD,
  },
});

export default ErrorBoundary;
