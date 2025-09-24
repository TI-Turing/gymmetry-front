import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { useDashboardData } from '@/hooks/useDashboardData';
import * as ScreenOrientation from 'expo-screen-orientation';

function DetailedProgressScreen() {
  const { data, loading, error } = useDashboardData();

  useEffect(() => {
    let isMounted = true;
    
    const setupOrientation = async () => {
      try {
        if (isMounted) {
          // Forzar orientación horizontal al entrar
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
      } catch (orientationError) {
        // Silenciar errores de orientación
      }
    };

    // Delay para evitar conflictos con navegación
    const timer = setTimeout(setupOrientation, 50);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      // Volver a orientación libre al salir
      ScreenOrientation.unlockAsync().catch(() => {
        // Silenciar errores al limpiar
      });
    };
  }, []);

  // Mostrar loading
  if (loading) {
    return (
      <ScreenWrapper
        headerTitle="Progreso Detallado"
        showBackButton={true}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Cargando datos...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <ScreenWrapper
        headerTitle="Progreso Detallado"
        showBackButton={true}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Error al cargar datos</Text>
          <Text style={{ fontSize: 14, marginTop: 8 }}>{error}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!data.detailedProgress) {
    return null;
  }

  return (
    <ScreenWrapper
      headerTitle="Progreso Detallado"
      showBackButton={true}
    >
      <View style={{ flex: 1, padding: 16 }}>
        {/* Componentes del modal que vamos a integrar aquí */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
          Progreso Detallado
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 8, opacity: 0.7 }}>
          Pantalla en orientación horizontal
        </Text>
      </View>
    </ScreenWrapper>
  );
}

export default DetailedProgressScreen;