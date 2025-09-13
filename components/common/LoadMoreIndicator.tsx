import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from '../useColorScheme';

export interface LoadMoreIndicatorProps {
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore?: () => void;
}

export const LoadMoreIndicator: React.FC<LoadMoreIndicatorProps> = ({
  loading,
  hasMore,
  error,
  onRetry,
  onLoadMore,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);

  if (!hasMore && !loading && !error) {
    return (
      <View style={styles.container}>
        <View style={styles.endContainer}>
          <Text style={styles.endIcon}>🎉</Text>
          <Text style={styles.endTitle}>¡Has llegado al final!</Text>
          <Text style={styles.endText}>
            No hay más contenido para mostrar en este momento
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#FF6B35"
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>Cargando más contenido...</Text>
        </View>
      </View>
    );
  }

  // Estado idle - mostrar botón para cargar más
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={onLoadMore}
        activeOpacity={0.7}
      >
        <Text style={styles.loadMoreIcon}>⬇️</Text>
        <Text style={styles.loadMoreText}>Cargar más contenido</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    container: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    spinner: {
      marginBottom: 12,
    },
    loadingText: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      textAlign: 'center',
    },
    errorContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 32,
    },
    errorIcon: {
      fontSize: 32,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      color: isDark ? '#ff6b6b' : '#e74c3c',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
    },
    retryButton: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    endContainer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 32,
    },
    endIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    endTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
      textAlign: 'center',
    },
    endText: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      textAlign: 'center',
      lineHeight: 20,
    },
    loadMoreButton: {
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      paddingHorizontal: 24,
      paddingVertical: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#e0e0e0',
    },
    loadMoreIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    loadMoreText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FF6B35',
    },
  });
};
