import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { routineTemplateService, routineAssignedService } from '@/services';
import { authService } from '@/services/authService';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { View, Text } from '@/components/Themed';
import { styles } from './styles';
import RoutineAssignedCard from '@/components/routineAssigned';
import { RoutineTemplateSkeleton } from './RoutineTemplateSkeleton';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import type { MenuOption } from '@/components/layout/MobileHeader';

function RoutineTemplatesScreen() {
  // Datos
  const [activeAssignment, setActiveAssignment] = useState<RoutineAssigned | null>(null);
  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  // Estados de carga separados
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingAssignment, setLoadingAssignment] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Skeleton diferido
  const [showSkeleton, setShowSkeleton] = useState(false);
  const skeletonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadCountRef = useRef(0); // detectar doble ejecución en dev (StrictMode)

  // Instrumentación helper
  const log = (label: string, start?: number) => {
    if (start != null) {
      const delta = (performance.now() - start).toFixed(1);
      // eslint-disable-next-line no-console
      console.log(`[RoutineTemplates] ${label} ${delta}ms`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[RoutineTemplates] ${label}`);
    }
  };

  const fetchTemplatesFirst = useCallback(async () => {
    loadCountRef.current += 1;
    const totalStart = performance.now();
    setError(null);
    setLoadingTemplates(true);
    setLoadingAssignment(true);

    // Iniciar temporizador de skeleton diferido (evita parpadeo en respuestas <120ms)
    if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
  skeletonTimerRef.current = setTimeout(() => setShowSkeleton(true), 120);

    try {
      const tUserStart = performance.now();
      const user = await authService.getUserData();
      log('getUser', tUserStart);
      const userId = user?.id;
      if (!userId) throw new Error('Usuario no autenticado');

      // 1. Cargar plantillas primero (no bloqueante con asignación)
      const tTemplatesStart = performance.now();
      const templatesRes = await routineTemplateService.getAllRoutineTemplates().catch(() => null);
      log('templates fetch', tTemplatesStart);
      let all: RoutineTemplate[] = [];
      if (templatesRes?.Success && Array.isArray(templatesRes.Data)) {
        all = templatesRes.Data;
      }
      setTemplates(all); // Render inmediato
      setLoadingTemplates(false);
      // Si la llamada fue muy rápida (<120ms) evitamos ver skeleton
      if (performance.now() - totalStart < 120) {
        if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
        setShowSkeleton(false);
      }

      // 2. Cargar asignación en paralelo (sin bloquear la UI principal)
      const tAssignedStart = performance.now();
      routineAssignedService
        .findRoutineAssignedsByFields({ field: 'UserId', value: userId } as any)
        .then(assignedRes => {
          log('assigned fetch', tAssignedStart);
          if (assignedRes?.Success && Array.isArray(assignedRes.Data) && assignedRes.Data.length > 0) {
            setActiveAssignment(assignedRes.Data[0]);
          } else {
            setActiveAssignment(null);
          }
        })
        .catch(() => setActiveAssignment(null))
        .finally(() => setLoadingAssignment(false));
    } catch (e: any) {
      setError(e.message || 'Error al cargar rutinas');
      setLoadingTemplates(false);
      setLoadingAssignment(false);
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    } finally {
      log('total load', totalStart);
    }
  }, []);

  useEffect(() => {
    fetchTemplatesFirst();
    return () => {
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    };
  }, [fetchTemplatesFirst]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTemplatesFirst();
    setRefreshing(false);
  };

  // Configurar menú específico para rutinas
  const routineMenuOptions: MenuOption[] = [
    {
      key: 'home',
      icon: 'home',
      label: 'Inicio',
      action: () => router.push('/'),
    },
    {
      key: 'plans',
      icon: 'star',
      label: 'Planes',
      action: () => router.push('/plans'),
    },
    {
      key: 'progress',
      icon: 'line-chart',
      label: 'Progreso',
      action: () => router.push('/(tabs)/progress'),
    },
    {
      key: 'settings',
      icon: 'cog',
      label: 'Ajustes',
      action: () => {
        // Navegación a ajustes
      },
    },
    {
      key: 'logout',
      icon: 'sign-out',
      label: 'Cerrar Sesión',
      action: () => {
        // Lógica de logout
      },
    },
  ];

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenWrapper
      headerTitle="Rutinas"
      showBackButton={true}
      onPressBack={handleGoBack}
      menuOptions={routineMenuOptions}
      backgroundColor="#1A1A1A"
      useSafeArea={true}
    >
      <ScrollView
        style={[styles.container, { paddingTop: 0 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {error && <Text style={styles.error}>{error}</Text>}
      
      {activeAssignment ? (
        <>
          <Text style={styles.sectionTitle}>Rutina Activa</Text>
          <RoutineAssignedCard assignment={activeAssignment} />
        </>
      ) : (
        !loadingAssignment && <Text style={styles.text}>Sin rutinas activas en este momento.</Text>
      )}
      
  <Text style={styles.sectionTitle}>Rutinas Disponibles en tu plan activo</Text>
      
      {( (loadingTemplates || refreshing) && showSkeleton) ? (
        <RoutineTemplateSkeleton count={3} />
      ) : (
        <>
          {templates.length === 0 && (
            <Text style={styles.text}>No hay más rutinas disponibles.</Text>
          )}
          {templates.map(t => (
            <View key={t.Id} style={styles.card}>
              <Text style={styles.cardTitle}>{t.Name}</Text>
              {t.Comments && <Text style={styles.text}>{t.Comments}</Text>}
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => {
                  /* TODO: asignar nueva rutina */
                }}
              >
                <Text style={styles.assignLabel}>Configurar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
      </ScrollView>
    </ScreenWrapper>
  );
}

export default RoutineTemplatesScreen;
