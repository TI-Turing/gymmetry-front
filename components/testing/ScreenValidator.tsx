import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useSegments, usePathname } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';

interface ScreenState {
  route: string;
  timestamp: Date;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  dataStatus: 'empty' | 'partial' | 'complete' | 'unknown';
  loadTime?: number;
  authRequired: boolean;
  components: ComponentState[];
}

interface ComponentState {
  name: string;
  status: 'loading' | 'success' | 'error' | 'empty';
  dataCount?: number;
  errorDetails?: string;
}

interface ScreenValidatorProps {
  visible: boolean;
  onClose: () => void;
}

// Hook para monitorear el estado de las pantallas
const useScreenStateMonitor = () => {
  const [screenStates, setScreenStates] = useState<ScreenState[]>([]);
  const [currentScreen, setCurrentScreen] = useState<ScreenState | null>(null);
  const segments = useSegments();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  // Analizar componentes cargados en la pantalla actual
  const analyzeScreenComponents = useMemo(() => {
    const components: ComponentState[] = [];

    // Análisis específico por ruta
    const route = pathname || '/';

    if (route.includes('(tabs)')) {
      // Pantallas de tabs principales
      if (route.includes('index')) {
        components.push({
          name: 'HomeScreen',
          status: 'success',
          dataCount: user ? 1 : 0,
        });
      } else if (route.includes('two')) {
        components.push({
          name: 'TabTwoScreen',
          status: 'success',
        });
      }
    } else if (route.includes('login')) {
      components.push({
        name: 'LoginScreen',
        status: isAuthenticated ? 'success' : 'loading',
      });
    } else if (route.includes('register')) {
      components.push({
        name: 'RegisterScreen',
        status: 'success',
      });
    } else if (route.includes('routine-day')) {
      components.push(
        {
          name: 'RoutineDayScreen',
          status: 'success',
          dataCount: 1,
        },
        {
          name: 'RoutineExercises',
          status: 'success',
          dataCount: Math.floor(Math.random() * 10) + 1, // Simular ejercicios
        }
      );
    } else if (route.includes('plans')) {
      components.push({
        name: 'PlansScreen',
        status: 'success',
        dataCount: Math.floor(Math.random() * 5) + 1,
      });
    } else if (route.includes('settings')) {
      components.push({
        name: 'SettingsScreen',
        status: user ? 'success' : 'error',
        errorDetails: !user ? 'User data not loaded' : undefined,
      });
    }

    return components;
  }, [pathname, isAuthenticated, user]);

  useEffect(() => {
    const startTime = Date.now();

    // Crear estado de pantalla actual
    const newScreenState: ScreenState = {
      route: pathname || 'unknown',
      timestamp: new Date(),
      isLoading: false,
      hasError: false,
      dataStatus: 'unknown',
      authRequired:
        segments.some((segment) => segment === '(tabs)') ||
        pathname?.includes('user-profile'),
      components: analyzeScreenComponents,
    };

    // Simular tiempo de carga
    setTimeout(
      () => {
        const loadTime = Date.now() - startTime;
        newScreenState.loadTime = loadTime;
        newScreenState.isLoading = false;

        // Determinar estado de datos basado en componentes
        const hasData = analyzeScreenComponents.some(
          (c) => (c.dataCount || 0) > 0
        );
        const hasErrors = analyzeScreenComponents.some(
          (c) => c.status === 'error'
        );

        if (hasErrors) {
          newScreenState.hasError = true;
          newScreenState.dataStatus = 'empty';
          newScreenState.errorMessage = 'Some components failed to load';
        } else if (hasData) {
          newScreenState.dataStatus = 'complete';
        } else {
          newScreenState.dataStatus = 'empty';
        }

        setCurrentScreen(newScreenState);
        setScreenStates((prev) => [newScreenState, ...prev.slice(0, 19)]); // Máximo 20 pantallas
      },
      Math.random() * 500 + 100
    ); // 100-600ms de carga simulada
  }, [pathname, segments, analyzeScreenComponents]);

  return { screenStates, currentScreen };
};

export const ScreenValidator: React.FC<ScreenValidatorProps> = ({
  visible,
  onClose,
}) => {
  const { screenStates, currentScreen } = useScreenStateMonitor();
  const [selectedScreen, setSelectedScreen] = useState<ScreenState | null>(
    null
  );
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = makeStyles(colors);

  if (!visible) return null;

  const getDataStatusColor = (status: ScreenState['dataStatus']) => {
    switch (status) {
      case 'complete':
        return '#4CAF50';
      case 'partial':
        return '#FF9800';
      case 'empty':
        return '#f44336';
      case 'unknown':
        return '#666666';
      default:
        return '#666666';
    }
  };

  const getComponentStatusIcon = (status: ComponentState['status']) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'loading':
        return '⏳';
      case 'error':
        return '❌';
      case 'empty':
        return '📭';
      default:
        return '❓';
    }
  };

  const getScreenScore = (screen: ScreenState) => {
    const totalComponents = screen.components.length;
    if (totalComponents === 0) return 0;

    const successfulComponents = screen.components.filter(
      (c) => c.status === 'success'
    ).length;
    return Math.round((successfulComponents / totalComponents) * 100);
  };

  const getRouteDisplayName = (route: string) => {
    if (route.includes('(tabs)/index')) return '🏠 Home';
    if (route.includes('(tabs)/two')) return '📱 Tab Two';
    if (route.includes('login')) return '🔐 Login';
    if (route.includes('register')) return '📝 Register';
    if (route.includes('routine-day')) return '🏋️ Routine Day';
    if (route.includes('plans')) return '📋 Plans';
    if (route.includes('settings')) return '⚙️ Settings';
    return route.split('/').pop() || 'Unknown';
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🖥️ Screen Validator</Text>
            <Text style={styles.subtitle}>
              Current: {getRouteDisplayName(currentScreen?.route || '')}
              {currentScreen && ` (${getScreenScore(currentScreen)}% loaded)`}
            </Text>
          </View>

          {selectedScreen ? (
            // Vista detallada de pantalla
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedScreen(null)}
              >
                <Text style={styles.backButtonText}>← Back to List</Text>
              </TouchableOpacity>

              <View style={styles.screenDetail}>
                <View style={styles.screenHeader}>
                  <Text style={styles.screenTitle}>
                    {getRouteDisplayName(selectedScreen.route)}
                  </Text>
                  <Text style={styles.routePath}>{selectedScreen.route}</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Score</Text>
                    <Text
                      style={[
                        styles.statValue,
                        {
                          color: getDataStatusColor(selectedScreen.dataStatus),
                        },
                      ]}
                    >
                      {getScreenScore(selectedScreen)}%
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Load Time</Text>
                    <Text style={styles.statValue}>
                      {selectedScreen.loadTime || 0}ms
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Auth</Text>
                    <Text style={styles.statValue}>
                      {selectedScreen.authRequired ? '🔒' : '🔓'}
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📦 Components Status</Text>
                  {selectedScreen.components.length === 0 ? (
                    <Text style={styles.emptyText}>No components analyzed</Text>
                  ) : (
                    selectedScreen.components.map((component, index) => (
                      <View key={index} style={styles.componentRow}>
                        <View style={styles.componentHeader}>
                          <Text style={styles.componentIcon}>
                            {getComponentStatusIcon(component.status)}
                          </Text>
                          <Text style={styles.componentName}>
                            {component.name}
                          </Text>
                        </View>
                        <View style={styles.componentDetails}>
                          {component.dataCount !== undefined && (
                            <Text style={styles.componentData}>
                              Data: {component.dataCount} items
                            </Text>
                          )}
                          {component.errorDetails && (
                            <Text style={styles.componentError}>
                              Error: {component.errorDetails}
                            </Text>
                          )}
                        </View>
                      </View>
                    ))
                  )}
                </View>

                {selectedScreen.hasError && selectedScreen.errorMessage && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>❌ Errors</Text>
                    <Text style={styles.errorText}>
                      {selectedScreen.errorMessage}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            // Lista de pantallas
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {currentScreen && (
                <View style={styles.currentScreenBox}>
                  <Text style={styles.currentScreenTitle}>
                    📍 Current Screen
                  </Text>
                  <TouchableOpacity
                    style={styles.screenRow}
                    onPress={() => setSelectedScreen(currentScreen)}
                  >
                    <View style={styles.screenRowHeader}>
                      <Text style={styles.screenName}>
                        {getRouteDisplayName(currentScreen.route)}
                      </Text>
                      <Text style={styles.timestamp}>
                        {currentScreen.timestamp.toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={styles.routeText} numberOfLines={1}>
                      {currentScreen.route}
                    </Text>
                    <View style={styles.screenRowFooter}>
                      <Text
                        style={[
                          styles.dataStatus,
                          {
                            color: getDataStatusColor(currentScreen.dataStatus),
                          },
                        ]}
                      >
                        {currentScreen.dataStatus.toUpperCase()}
                      </Text>
                      <Text style={styles.loadTime}>
                        {getScreenScore(currentScreen)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.historyTitle}>📜 Screen History</Text>
              {screenStates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>🔍 No screen history yet</Text>
                  <Text style={styles.emptySubtext}>
                    Navigate through the app to see screen validations
                  </Text>
                </View>
              ) : (
                screenStates.map((screen) => (
                  <TouchableOpacity
                    key={`${screen.route}-${screen.timestamp.getTime()}`}
                    style={styles.screenRow}
                    onPress={() => setSelectedScreen(screen)}
                  >
                    <View style={styles.screenRowHeader}>
                      <Text style={styles.screenName}>
                        {getRouteDisplayName(screen.route)}
                      </Text>
                      <Text style={styles.timestamp}>
                        {screen.timestamp.toLocaleTimeString()}
                      </Text>
                    </View>
                    <Text style={styles.routeText} numberOfLines={1}>
                      {screen.route}
                    </Text>
                    <View style={styles.screenRowFooter}>
                      <Text
                        style={[
                          styles.dataStatus,
                          { color: getDataStatusColor(screen.dataStatus) },
                        ]}
                      >
                        {screen.dataStatus.toUpperCase()}
                      </Text>
                      <Text style={styles.loadTime}>
                        {getScreenScore(screen)}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (
  colors: any // eslint-disable-line @typescript-eslint/no-explicit-any
) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    container: {
      backgroundColor: colors.background,
      borderRadius: 12,
      width: '100%',
      maxHeight: Dimensions.get('window').height * 0.9,
      minHeight: Dimensions.get('window').height * 0.7,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    currentScreenBox: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: '#4CAF50',
    },
    currentScreenTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    historyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.6,
    },
    screenRow: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#2196F3',
    },
    screenRowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    screenRowFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    screenName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
    },
    routeText: {
      fontSize: 12,
      color: colors.text,
      fontFamily: 'monospace',
      opacity: 0.8,
    },
    dataStatus: {
      fontSize: 12,
      fontWeight: '600',
    },
    loadTime: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    // Estilos para vista detallada
    backButton: {
      marginBottom: 16,
      paddingVertical: 8,
    },
    backButtonText: {
      color: '#2196F3',
      fontSize: 14,
      fontWeight: '600',
    },
    screenDetail: {
      flex: 1,
    },
    screenHeader: {
      marginBottom: 16,
    },
    screenTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    routePath: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'monospace',
      opacity: 0.7,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    statBox: {
      alignItems: 'center',
      flex: 1,
    },
    statLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.8,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    componentRow: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    componentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    componentIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    componentName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    componentDetails: {
      marginLeft: 24,
    },
    componentData: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.8,
    },
    componentError: {
      fontSize: 12,
      color: '#f44336',
    },
    errorText: {
      fontSize: 14,
      color: '#f44336',
      backgroundColor: '#ffebee',
      padding: 12,
      borderRadius: 6,
    },
  });
