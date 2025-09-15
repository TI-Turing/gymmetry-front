/* eslint-disable @typescript-eslint/no-var-requires, expo/no-dynamic-env-var, unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface EnvironmentVariable {
  key: string;
  value: string | undefined;
  expected?: string;
  isValid: boolean;
  category: 'API' | 'CONFIG' | 'KEYS' | 'ENVIRONMENT';
}

const EXPECTED_VARIABLES: Record<
  string,
  { expected?: string; category: EnvironmentVariable['category'] }
> = {
  EXPO_PUBLIC_API_BASE_URL: { category: 'API' },
  EXPO_PUBLIC_CATALOGS_API_BASE_URL: { category: 'API' },
  EXPO_PUBLIC_API_FUNCTIONS_KEY: { category: 'KEYS' },
  EXPO_PUBLIC_API_MAIN_FUNCTIONS_KEY: { category: 'KEYS' },
  EXPO_PUBLIC_ENVIRONMENT: { category: 'ENVIRONMENT' },
  EXPO_PUBLIC_DEBUG: { category: 'CONFIG' },
  EXPO_PUBLIC_TESTING_MODE: { expected: 'true', category: 'CONFIG' },
  EXPO_PUBLIC_MP_PUBLIC_KEY: { category: 'KEYS' },
};

interface EnvironmentMonitorProps {
  visible: boolean;
  onClose: () => void;
}

export const EnvironmentMonitor: React.FC<EnvironmentMonitorProps> = ({
  visible,
  onClose,
}) => {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const colorScheme = useColorScheme();
  const styles = makeStyles(colorScheme ?? 'light');

  useEffect(() => {
    const inspectEnvironment = () => {
      const envVars: EnvironmentVariable[] = [];

      Object.entries(EXPECTED_VARIABLES).forEach(([key, config]) => {
        const value = process.env[key];
        const isValid = value !== undefined && value !== null && value !== '';

        envVars.push({
          key,
          value: value || 'UNDEFINED',
          expected: config.expected,
          isValid,
          category: config.category,
        });
      });

      setVariables(envVars);
      setLastUpdate(new Date());
    };

    // Inspección inicial
    inspectEnvironment();

    // Auto-refresh cada 10 segundos
    const interval = setInterval(inspectEnvironment, 10000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (
    category: EnvironmentVariable['category'],
    isValid: boolean
  ) => {
    if (!isValid) return '#ff4444';

    switch (category) {
      case 'API':
        return '#4CAF50';
      case 'KEYS':
        return '#FF9800';
      case 'CONFIG':
        return '#2196F3';
      case 'ENVIRONMENT':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const getValidationStatus = () => {
    const total = variables.length;
    const valid = variables.filter((v) => v.isValid).length;
    return {
      total,
      valid,
      percentage: total > 0 ? Math.round((valid / total) * 100) : 0,
    };
  };

  const status = getValidationStatus();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🔧 Environment Monitor</Text>
            <Text style={styles.subtitle}>
              Variables: {status.valid}/{status.total} ({status.percentage}%)
            </Text>
            <Text style={styles.timestamp}>
              Last Update: {lastUpdate.toLocaleTimeString()}
            </Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {['API', 'KEYS', 'CONFIG', 'ENVIRONMENT'].map((category) => {
              const categoryVars = variables.filter(
                (v) => v.category === category
              );
              if (categoryVars.length === 0) return null;

              return (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  {categoryVars.map((variable, index) => (
                    <View key={variable.key} style={styles.variableRow}>
                      <View style={styles.variableHeader}>
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: getCategoryColor(
                                variable.category,
                                variable.isValid
                              ),
                            },
                          ]}
                        />
                        <Text style={styles.variableKey}>{variable.key}</Text>
                      </View>

                      <Text
                        style={[
                          styles.variableValue,
                          !variable.isValid && styles.errorValue,
                        ]}
                      >
                        {variable.value}
                      </Text>

                      {variable.expected && (
                        <Text style={styles.expectedValue}>
                          Expected: {variable.expected}
                        </Text>
                      )}

                      {!variable.isValid && (
                        <Text style={styles.errorText}>
                          ⚠️ Variable not set or empty
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}

            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>🎯 Configuration Status</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Environment:</Text>
                <Text style={styles.summaryValue}>
                  {process.env.EXPO_PUBLIC_ENVIRONMENT || 'UNKNOWN'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Debug Mode:</Text>
                <Text style={styles.summaryValue}>
                  {process.env.EXPO_PUBLIC_DEBUG === 'true'
                    ? '✅ Enabled'
                    : '❌ Disabled'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Testing Mode:</Text>
                <Text style={styles.summaryValue}>
                  {process.env.EXPO_PUBLIC_TESTING_MODE === 'true'
                    ? '✅ Enabled'
                    : '❌ Disabled'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform:</Text>
                <Text style={styles.summaryValue}>
                  {require('react-native').Platform.OS}{' '}
                  {require('react-native').Platform.Version}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (themeMode: 'light' | 'dark') => {
  const theme = { colors: Colors[themeMode] };
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      maxHeight: Dimensions.get('window').height * 0.8,
      minWidth: 320,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      paddingBottom: 12,
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.8,
      marginBottom: 2,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.text,
      opacity: 0.6,
    },
    content: {
      flex: 1,
    },
    categorySection: {
      marginBottom: 16,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: theme.colors.card,
      borderRadius: 6,
    },
    variableRow: {
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#4CAF50',
    },
    variableHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    variableKey: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    variableValue: {
      fontSize: 13,
      color: theme.colors.text,
      fontFamily: 'monospace',
      backgroundColor: theme.colors.background,
      padding: 8,
      borderRadius: 4,
      marginVertical: 4,
    },
    errorValue: {
      color: '#ff4444',
      backgroundColor: '#ffebee',
    },
    expectedValue: {
      fontSize: 12,
      color: theme.colors.text,
      opacity: 0.7,
      fontStyle: 'italic',
    },
    errorText: {
      fontSize: 12,
      color: '#ff4444',
      marginTop: 4,
    },
    summarySection: {
      marginTop: 16,
      padding: 12,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 6,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.8,
    },
    summaryValue: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
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
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
};
