import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import Button from '@/components/common/Button';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeDebugAuthStyles } from './styles/debugAuth';
import { useCustomAlert } from '@/components/common/CustomAlert';

// Importar las utilidades que creamos
import { jwtValidationUtils } from '@/utils/jwtValidationUtils';
import { environmentValidationUtils } from '@/utils/environmentValidationUtils';
import { tokenTestUtils } from '@/utils/tokenTestUtils';
import { authService } from '@/services/authService';

interface DebugSection {
  title: string;
  icon: string;
  data: Record<string, unknown> | null;
  isLoading: boolean;
  error?: string;
}

export default function DebugAuthScreen() {
  const styles = useThemedStyles(makeDebugAuthStyles);
  const { user, isAuthenticated } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [refreshing, setRefreshing] = useState(false);

  const [sections, setSections] = useState<DebugSection[]>([
    {
      title: 'Estado de Autenticación',
      icon: 'user',
      data: null,
      isLoading: true,
    },
    {
      title: 'Validación JWT',
      icon: 'lock',
      data: null,
      isLoading: true,
    },
    {
      title: 'Variables de Entorno',
      icon: 'cog',
      data: null,
      isLoading: true,
    },
    {
      title: 'Storage AsyncStorage',
      icon: 'database',
      data: null,
      isLoading: true,
    },
  ]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async () => {
    setRefreshing(true);

    try {
      // 1. Estado de autenticación
      const authData = await loadAuthData();

      // 2. Validación JWT
      const jwtData = await loadJWTData();

      // 3. Variables de entorno
      const envData = await loadEnvironmentData();

      // 4. AsyncStorage
      const storageData = await loadStorageData();

      setSections([
        {
          title: 'Estado de Autenticación',
          icon: 'user',
          data: authData,
          isLoading: false,
        },
        {
          title: 'Validación JWT',
          icon: 'lock',
          data: jwtData,
          isLoading: false,
        },
        {
          title: 'Variables de Entorno',
          icon: 'cog',
          data: envData,
          isLoading: false,
        },
        {
          title: 'Storage AsyncStorage',
          icon: 'database',
          data: storageData,
          isLoading: false,
        },
      ]);
    } catch (error) {
      showAlert('error', 'Error', `Error cargando datos: ${error}`);
    } finally {
      setRefreshing(false);
    }
  };

  const loadAuthData = async () => {
    const userData = await authService.getUserData();
    return {
      'Context isAuthenticated': isAuthenticated,
      'Context user': user,
      'Service isAuthenticated': authService.isAuthenticated(),
      'Service userData': userData,
      'User ID': userData?.id || 'N/A',
      'User Email': userData?.email || 'N/A',
      'Gym ID': userData?.gymId || 'N/A',
      Roles: userData?.roles?.join(', ') || 'N/A',
      'Is Owner': userData?.isOwner || false,
    };
  };

  const loadJWTData = async () => {
    const validation = await jwtValidationUtils.validateStoredJWT();
    const consistency =
      await jwtValidationUtils.validateAuthServiceConsistency();

    return {
      'Token Válido': validation.isValid ? '✅' : '❌',
      'Token Expirado': validation.isExpired ? '❌' : '✅',
      'Tiempo hasta Expiración': validation.timeUntilExpiry
        ? `${Math.floor(validation.timeUntilExpiry / 60)}m ${validation.timeUntilExpiry % 60}s`
        : 'N/A',
      'Usuario en Token': validation.payload?.sub || 'N/A',
      'Email en Token': validation.payload?.email || 'N/A',
      'Roles en Token': validation.payload?.roles?.join(', ') || 'N/A',
      'Fecha Emisión': validation.issueTime?.toLocaleString() || 'N/A',
      'Fecha Expiración': validation.expiryTime?.toLocaleString() || 'N/A',
      'Consistencia Service vs JWT': consistency.isConsistent ? '✅' : '❌',
      Errores:
        validation.errors.length > 0 ? validation.errors.join(', ') : 'Ninguno',
      'Problemas Consistencia':
        consistency.issues.length > 0
          ? consistency.issues.join(', ')
          : 'Ninguno',
    };
  };

  const loadEnvironmentData = async () => {
    const currentEnv = environmentValidationUtils.getCurrentEnvironment();
    const validation = environmentValidationUtils.validateCurrentEnvironment();
    const envReport = environmentValidationUtils.generateEnvironmentReport();

    return {
      'Ambiente Actual': currentEnv,
      NODE_ENV: process.env.NODE_ENV || 'undefined',
      EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV || 'undefined',
      'Configuración Válida': validation.isValid ? '✅' : '❌',
      'Variables Requeridas Faltantes': validation.missingRequired.length,
      'Variables Opcionales Faltantes': validation.missingOptional.length,
      'Variables Inválidas': validation.invalidValues.length,
      'Reporte Generado': envReport.isValid ? '✅' : '❌',
      'Total Variables EXPO_PUBLIC_*': Object.keys(
        environmentValidationUtils.getAllExpoPublicVars()
      ).length,
    };
  };

  const loadStorageData = async () => {
    const keys = [
      '@auth_token',
      '@refresh_token',
      '@token_expiration',
      '@refresh_token_expiration',
      '@user_data',
      '@user_id',
      '@gym_id',
      '@username',
    ];

    const data: Record<string, string> = {};

    for (const key of keys) {
      try {
        const value = await AsyncStorage.getItem(key);
        data[key] = value
          ? key.includes('token') && !key.includes('expiration')
            ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
            : value
          : '❌ Ausente';
      } catch (error) {
        data[key] = `❌ Error: ${error}`;
      }
    }

    return data;
  };

  const handleRefresh = () => {
    loadAllData();
  };

  const handleTestLogin = async () => {
    try {
      // Limpiar datos actuales
      await tokenTestUtils.clearAuthData();
      showAlert(
        'success',
        'Éxito',
        'Datos de auth limpiados. Redirigiendo a login...'
      );

      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error) {
      showAlert('error', 'Error', `Error limpiando datos: ${error}`);
    }
  };

  const handleTestRefreshToken = async () => {
    try {
      const result = await tokenTestUtils.testRefreshToken();
      showAlert(
        result ? 'success' : 'error',
        result ? 'Éxito' : 'Error',
        result ? 'Refresh token exitoso' : 'Refresh token falló'
      );

      if (result) {
        loadAllData(); // Recargar datos
      }
    } catch (error) {
      showAlert('error', 'Error', `Error en refresh: ${error}`);
    }
  };

  const handleSimulateExpiredToken = async () => {
    try {
      await tokenTestUtils.simulateExpiredToken();
      showAlert('success', 'Éxito', 'Token marcado como expirado para testing');
      loadAllData(); // Recargar datos
    } catch (error) {
      showAlert('error', 'Error', `Error simulando token expirado: ${error}`);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
        showAlert('success', 'Éxito', 'Copiado al portapapeles');
      } catch {
        showAlert('error', 'Error', 'Error copiando al portapapeles');
      }
    } else {
      // En móvil se puede usar Clipboard de React Native
      showAlert(
        'error',
        'Error',
        'Funcionalidad de copiado no disponible en móvil'
      );
    }
  };

  const renderSection = (section: DebugSection, index: number) => (
    <View key={index} style={styles.section}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          // Toggle expandir/contraer si quisiéramos
        }}
      >
        <FontAwesome
          name={section.icon as keyof typeof FontAwesome.glyphMap}
          size={20}
          color={styles.sectionHeaderText.color}
        />
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
        {section.isLoading && (
          <Text style={styles.loadingText}>Cargando...</Text>
        )}
      </TouchableOpacity>

      {!section.isLoading && section.data && (
        <View style={styles.sectionContent}>
          {Object.entries(section.data).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.dataRow}
              onLongPress={() => handleCopyToClipboard(`${key}: ${value}`)}
            >
              <Text style={styles.dataKey}>{key}:</Text>
              <Text style={styles.dataValue} numberOfLines={2}>
                {String(value)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {section.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{section.error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={styles.backButtonText.color}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Debug Autenticación</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <FontAwesome
              name="refresh"
              size={20}
              color={styles.refreshButtonText.color}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section, index) => renderSection(section, index))}

          <View style={styles.actionsSection}>
            <Text style={styles.actionsSectionTitle}>Acciones de Testing</Text>

            <Button
              title="🧪 Test Refresh Token"
              onPress={handleTestRefreshToken}
              style={styles.actionButton}
            />

            <Button
              title="⏰ Simular Token Expirado"
              onPress={handleSimulateExpiredToken}
              style={styles.actionButton}
            />

            <Button
              title="🧹 Limpiar Auth y Ir a Login"
              onPress={handleTestLogin}
              style={{
                ...styles.actionButton,
                ...styles.dangerButton,
              }}
            />
          </View>
        </ScrollView>

        <AlertComponent />
      </View>
    </ScreenWrapper>
  );
}
