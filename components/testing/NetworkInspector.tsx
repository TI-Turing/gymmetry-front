/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
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

interface APIRequest {
  id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: Date;
  status?: number;
  responseTime?: number;
  responseData?: any;
  error?: string;
}

interface NetworkInspectorProps {
  visible: boolean;
  onClose: () => void;
}

// Hook simplificado para network inspector (versión sin interceptación por ahora)
const useNetworkInterceptor = () => {
  const [requests, setRequests] = useState<APIRequest[]>([]);

  // Por ahora, usar datos mock para evitar problemas con interceptación de fetch
  useEffect(() => {
    // Datos de ejemplo para testing
    const mockRequests: APIRequest[] = [
      {
        id: 'mock_1',
        method: 'GET',
        url: '/api/user',
        headers: { 'Content-Type': 'application/json' },
        timestamp: new Date(),
        status: 200,
        responseTime: 150,
        responseData: { id: 1, name: 'Test User' },
      },
      {
        id: 'mock_2',
        method: 'POST',
        url: '/api/auth/login',
        headers: { 'Content-Type': 'application/json' },
        body: { email: 'test@example.com' },
        timestamp: new Date(),
        status: 401,
        responseTime: 200,
        error: 'Invalid credentials',
      },
    ];

    setRequests(mockRequests);
  }, []);

  const clearRequests = () => setRequests([]);

  return { requests, clearRequests };
};

export const NetworkInspector: React.FC<NetworkInspectorProps> = ({
  visible,
  onClose,
}) => {
  // Solo usar el interceptor si está visible y en desarrollo
  const { requests, clearRequests } = useNetworkInterceptor();
  const [selectedRequest, setSelectedRequest] = useState<APIRequest | null>(
    null
  );
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = makeStyles(colors);

  // Si no está visible, no renderizar nada
  if (!visible) return null;

  const getStatusColor = (status?: number) => {
    if (!status) return '#666666';
    if (status >= 200 && status < 300) return '#4CAF50';
    if (status >= 300 && status < 400) return '#FF9800';
    if (status >= 400 && status < 500) return '#f44336';
    if (status >= 500) return '#9C27B0';
    return '#666666';
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return '#4CAF50';
      case 'POST':
        return '#2196F3';
      case 'PUT':
        return '#FF9800';
      case 'DELETE':
        return '#f44336';
      case 'PATCH':
        return '#9C27B0';
      default:
        return '#666666';
    }
  };

  const formatResponse = (data: any) => {
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const formatHeaders = (headers: Record<string, string>) => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🌐 Network Inspector</Text>
            <View style={styles.headerActions}>
              <Text style={styles.subtitle}>
                Requests: {requests.length}/50
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearRequests}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectedRequest ? (
            // Vista detallada de request
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedRequest(null)}
              >
                <Text style={styles.backButtonText}>← Back to List</Text>
              </TouchableOpacity>

              <View style={styles.requestDetail}>
                <View style={styles.requestHeader}>
                  <View style={styles.methodBadge}>
                    <Text
                      style={[
                        styles.methodText,
                        { color: getMethodColor(selectedRequest.method) },
                      ]}
                    >
                      {selectedRequest.method}
                    </Text>
                  </View>
                  <Text style={styles.urlText} numberOfLines={2}>
                    {selectedRequest.url}
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(selectedRequest.status) },
                    ]}
                  >
                    {selectedRequest.status ||
                      (selectedRequest.error ? 'ERROR' : 'PENDING')}
                  </Text>
                  {selectedRequest.responseTime && (
                    <Text style={styles.timeText}>
                      {selectedRequest.responseTime}ms
                    </Text>
                  )}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📤 Request Headers</Text>
                  <Text style={styles.codeText}>
                    {formatHeaders(selectedRequest.headers) || 'No headers'}
                  </Text>
                </View>

                {selectedRequest.body && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📦 Request Body</Text>
                    <Text style={styles.codeText}>
                      {formatResponse(selectedRequest.body)}
                    </Text>
                  </View>
                )}

                {selectedRequest.responseData && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📥 Response Data</Text>
                    <ScrollView style={styles.responseContainer} horizontal>
                      <Text style={styles.codeText}>
                        {formatResponse(selectedRequest.responseData)}
                      </Text>
                    </ScrollView>
                  </View>
                )}

                {selectedRequest.error && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>❌ Error</Text>
                    <Text style={[styles.codeText, styles.errorText]}>
                      {selectedRequest.error}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          ) : (
            // Lista de requests
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {requests.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    🕸️ No network requests captured yet
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Navigate through the app to see API calls
                  </Text>
                </View>
              ) : (
                requests.map((request) => (
                  <TouchableOpacity
                    key={request.id}
                    style={styles.requestRow}
                    onPress={() => setSelectedRequest(request)}
                  >
                    <View style={styles.requestRowHeader}>
                      <View
                        style={[
                          styles.methodBadge,
                          {
                            backgroundColor:
                              getMethodColor(request.method) + '20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.methodText,
                            { color: getMethodColor(request.method) },
                          ]}
                        >
                          {request.method}
                        </Text>
                      </View>
                      <Text style={styles.timeStamp}>
                        {request.timestamp.toLocaleTimeString()}
                      </Text>
                    </View>

                    <Text style={styles.requestUrl} numberOfLines={1}>
                      {request.url}
                    </Text>

                    <View style={styles.requestRowFooter}>
                      <Text
                        style={[
                          styles.statusBadge,
                          { color: getStatusColor(request.status) },
                        ]}
                      >
                        {request.status ||
                          (request.error ? 'ERROR' : 'PENDING')}
                      </Text>
                      {request.responseTime && (
                        <Text style={styles.responseTime}>
                          {request.responseTime}ms
                        </Text>
                      )}
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

const makeStyles = (colors: any) =>
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
    headerActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
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
    clearButton: {
      backgroundColor: '#f44336',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    clearButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
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
    requestRow: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#2196F3',
    },
    requestRowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    requestRowFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
    },
    methodBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    methodText: {
      fontSize: 12,
      fontWeight: '600',
    },
    timeStamp: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
    },
    requestUrl: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'monospace',
    },
    statusBadge: {
      fontSize: 12,
      fontWeight: '600',
    },
    responseTime: {
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
    requestDetail: {
      flex: 1,
    },
    requestHeader: {
      marginBottom: 16,
    },
    urlText: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'monospace',
      marginTop: 8,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
      marginRight: 8,
    },
    timeText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    codeText: {
      fontSize: 12,
      color: colors.text,
      fontFamily: 'monospace',
      backgroundColor: colors.background,
      padding: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    responseContainer: {
      maxHeight: 200,
    },
    errorText: {
      color: '#f44336',
    },
  });
