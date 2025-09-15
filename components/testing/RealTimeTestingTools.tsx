import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FloatingTokenInspector } from './FloatingTokenInspector';
import { SessionMonitor } from './SessionMonitor';
import { EnvironmentMonitor } from './EnvironmentMonitor';
import { NetworkInspector } from './NetworkInspector';
import { ScreenValidator } from './ScreenValidator';
import { ConnectivityInspector } from './ConnectivityInspector';
import { RoutinesInspector } from './RoutinesInspector';
import { PerformanceMonitor } from './PerformanceMonitor';
import { CoverageValidator } from './CoverageValidator';

export function RealTimeTestingTools() {
  // Debug temporal - development only
  // eslint-disable-next-line no-console
  console.log(
    '🔍 RealTimeTestingTools - EXPO_PUBLIC_TESTING_MODE:',
    process.env.EXPO_PUBLIC_TESTING_MODE
  );

  const [showTokenInspector, setShowTokenInspector] = useState(false);
  const [showSessionMonitor, setShowSessionMonitor] = useState(false);
  const [showEnvironmentMonitor, setShowEnvironmentMonitor] = useState(false);
  const [showNetworkInspector, setShowNetworkInspector] = useState(false);
  const [showScreenValidator, setShowScreenValidator] = useState(false);
  const [showConnectivityInspector, setShowConnectivityInspector] =
    useState(false);
  const [showRoutinesInspector, setShowRoutinesInspector] = useState(false);
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [showCoverageValidator, setShowCoverageValidator] = useState(false);

  const [currentTool, setCurrentTool] = useState<
    | 'menu'
    | 'token'
    | 'session'
    | 'environment'
    | 'network'
    | 'screen'
    | 'connectivity'
    | 'routines'
    | 'performance'
    | 'coverage'
  >('menu');

  const showTool = (
    tool:
      | 'token'
      | 'session'
      | 'environment'
      | 'network'
      | 'screen'
      | 'connectivity'
      | 'routines'
      | 'performance'
      | 'coverage'
  ) => {
    setCurrentTool(tool);
    if (tool === 'token') {
      setShowTokenInspector(true);
    } else if (tool === 'session') {
      setShowSessionMonitor(true);
    } else if (tool === 'environment') {
      setShowEnvironmentMonitor(true);
    } else if (tool === 'network') {
      setShowNetworkInspector(true);
    } else if (tool === 'screen') {
      setShowScreenValidator(true);
    } else if (tool === 'connectivity') {
      setShowConnectivityInspector(true);
    } else if (tool === 'routines') {
      setShowRoutinesInspector(true);
    } else if (tool === 'performance') {
      setShowPerformanceMonitor(true);
    } else if (tool === 'coverage') {
      setShowCoverageValidator(true);
    }
  };

  const hideTool = () => {
    setCurrentTool('menu');
    setShowTokenInspector(false);
    setShowSessionMonitor(false);
    setShowEnvironmentMonitor(false);
    setShowNetworkInspector(false);
    setShowScreenValidator(false);
    setShowConnectivityInspector(false);
    setShowRoutinesInspector(false);
    setShowPerformanceMonitor(false);
    setShowCoverageValidator(false);
  };

  // Solo mostrar si está habilitado el modo testing
  const isTestingEnabled = process.env.EXPO_PUBLIC_TESTING_MODE === 'true';

  if (!isTestingEnabled) {
    return null;
  }

  return (
    <>
      {currentTool === 'menu' && (
        <View style={styles.floatingButton}>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => setCurrentTool('token')}
          >
            <Text style={styles.debugText}>🔍</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentTool !== 'menu' && (
        <View style={styles.toolsMenu}>
          <Text style={styles.menuTitle}>🧪 Herramientas de Testing</Text>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('token')}
          >
            <Text style={styles.toolText}>🔐 JWT Token</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('session')}
          >
            <Text style={styles.toolText}>👤 Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('environment')}
          >
            <Text style={styles.toolText}>⚙️ Environment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('network')}
          >
            <Text style={styles.toolText}>🌐 Network</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('screen')}
          >
            <Text style={styles.toolText}>📱 Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('connectivity')}
          >
            <Text style={styles.toolText}>📡 Conectividad</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('routines')}
          >
            <Text style={styles.toolText}>🏃‍♂️ Rutinas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('performance')}
          >
            <Text style={styles.toolText}>📊 Performance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => showTool('coverage')}
          >
            <Text style={styles.toolText}>✅ Cobertura</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={hideTool}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <FloatingTokenInspector visible={showTokenInspector} onClose={hideTool} />

      <SessionMonitor visible={showSessionMonitor} onClose={hideTool} />

      <EnvironmentMonitor visible={showEnvironmentMonitor} onClose={hideTool} />

      <NetworkInspector visible={showNetworkInspector} onClose={hideTool} />

      <ScreenValidator visible={showScreenValidator} onClose={hideTool} />

      <ConnectivityInspector
        visible={showConnectivityInspector}
        onClose={hideTool}
      />

      <RoutinesInspector visible={showRoutinesInspector} onClose={hideTool} />

      <PerformanceMonitor visible={showPerformanceMonitor} onClose={hideTool} />

      <CoverageValidator visible={showCoverageValidator} onClose={hideTool} />
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    top: 100,
    right: 20,
    zIndex: 1000,
  },
  debugButton: {
    backgroundColor: '#FF6B35',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  debugText: {
    fontSize: 20,
    color: 'white',
  },
  toolsMenu: {
    position: 'absolute',
    top: 80,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    padding: 15,
    zIndex: 1000,
    maxWidth: 200,
  },
  menuTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  toolButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 5,
  },
  toolText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
