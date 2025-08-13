import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Modal, View as RNView, TextInput, ActivityIndicator } from 'react-native';
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
import RoutineFilters, { type FilterState } from './RoutineFilters';
import { applyRoutineFilters, createEmptyFilters, getActiveFiltersCount } from './filterUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
  
  // Estados de filtros
  const [filters, setFilters] = useState<FilterState>(createEmptyFilters());
  const [showFilters, setShowFilters] = useState(false);
  // Modal asignación
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<RoutineTemplate | null>(null);
  const [assignComment, setAssignComment] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Rutinas filtradas usando useMemo para optimizar performance
  const filteredTemplates = useMemo(() => {
    return applyRoutineFilters(templates, filters);
  }, [templates, filters]);

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
            const active = assignedRes.Data[0];
            setActiveAssignment(active);
            // Persistir RoutineTemplateId activo
            const rtid = (active as any)?.RoutineTemplateId || active?.RoutineTemplates?.[0]?.Id;
            if (rtid) authService.setActiveRoutineTemplateId(rtid);
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

  // Funciones de filtros
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

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

  const openAssignModal = (template: RoutineTemplate) => {
    setSelectedTemplate(template);
    setAssignComment('');
    setAssignError(null);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    if (assignLoading) return;
    setShowAssignModal(false);
  };

  const handleAssignRoutine = async () => {
    if (!selectedTemplate) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      const user = await authService.getUserData();
      if (!user?.id) throw new Error('Usuario no autenticado');

      const request = {
        Comments: assignComment.trim() || null,
        UserId: user.id,
        RoutineTemplateId: selectedTemplate.Id,
      };
      const resp = await routineAssignedService.addRoutineAssigned(request);
      if (!resp?.Success) throw new Error(resp?.Message || 'Error al asignar rutina');

      // Refrescar asignaciones para obtener la activa reciente
      const assignedRes = await routineAssignedService.findRoutineAssignedsByFields({ field: 'UserId', value: user.id } as any);
      if (assignedRes?.Success && Array.isArray(assignedRes.Data) && assignedRes.Data.length > 0) {
        // Tomar la más reciente (asumimos primera) y añadir template seleccionado para mostrar nombre
        const newest = assignedRes.Data[0];
        // Asegurar que la plantilla esté disponible para la card
        if (!newest.RoutineTemplates || newest.RoutineTemplates.length === 0) {
          newest.RoutineTemplates = [selectedTemplate as any];
        }
        setActiveAssignment(newest as any);
  const rtid = (newest as any)?.RoutineTemplateId || newest.RoutineTemplates?.[0]?.Id;
  if (rtid) await authService.setActiveRoutineTemplateId(rtid);
      }
      setShowAssignModal(false);
    } catch (e: any) {
      setAssignError(e.message || 'Error desconocido');
    } finally {
      setAssignLoading(false);
    }
  };

  // Componente del botón de filtros para el header
  const FilterButton = () => {
    const activeCount = getActiveFiltersCount(filters);
    return (
      <TouchableOpacity
        style={styles.filterButton}
        onPress={toggleFilters}
        accessibilityLabel="Abrir filtros"
      >
        <FontAwesome name="filter" size={20} color="#FFFFFF" />
        {activeCount > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper
      headerTitle="Rutinas"
      headerSubtitle={`${filteredTemplates.length} de ${templates.length} rutina${templates.length !== 1 ? 's' : ''}`}
      showBackButton={true}
      onPressBack={handleGoBack}
      headerRightComponent={<FilterButton />}
      menuOptions={routineMenuOptions}
      backgroundColor="#1A1A1A"
    >
      <ScrollView
        style={[styles.container, { paddingTop: 0 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
      {error && <Text style={styles.error}>{error}</Text>}
      
      {activeAssignment ? (
        <>
          <Text style={styles.sectionTitle}>Rutina Activa</Text>
          <RoutineAssignedCard
            assignment={activeAssignment}
            onPress={() => router.push('/routine-day')}
          />
        </>
      ) : (
        !loadingAssignment && <Text style={styles.text}>Sin rutinas activas en este momento.</Text>
      )}
      
  <Text style={styles.sectionTitle}>Rutinas Disponibles en tu plan activo</Text>
      
      {( (loadingTemplates || refreshing) && showSkeleton) ? (
        <RoutineTemplateSkeleton count={3} />
      ) : (
        <>
          {filteredTemplates.length === 0 && templates.length > 0 && (
            <Text style={styles.text}>No hay rutinas que coincidan con los filtros seleccionados.</Text>
          )}
          {filteredTemplates.length === 0 && templates.length === 0 && (
            <Text style={styles.text}>No hay rutinas disponibles.</Text>
          )}
          {filteredTemplates.map(t => (
            <View key={t.Id} style={styles.card}>
              <Text style={styles.cardTitle}>{t.Name}</Text>
              {t.Comments && <Text style={styles.text}>{t.Comments}</Text>}
              <TouchableOpacity
                style={styles.assignButton}
                onPress={() => openAssignModal(t)}
              >
                <Text style={styles.assignLabel}>Configurar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
      </ScrollView>

      {/* Modal de Filtros */}
      <RoutineFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
        currentFilters={filters}
        totalResults={filteredTemplates.length}
      />

      {/* Modal asignar rutina */}
      <Modal visible={showAssignModal} transparent animationType="fade" onRequestClose={closeAssignModal}>
        <RNView style={{ flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'center', padding:24 }}>
          <RNView style={{ backgroundColor:'#1E1E1E', borderRadius:12, padding:20 }}>
            <Text style={{ fontSize:18, fontWeight:'600', color:'#FFFFFF', marginBottom:8 }}>
              Establecer Rutina
            </Text>
            <Text style={{ color:'#B0B0B0', marginBottom:12 }}>
              {selectedTemplate?.Name}
            </Text>
            <Text style={{ color:'#FFFFFF', fontWeight:'500', marginBottom:6 }}>Comentario (opcional)</Text>
            <TextInput
              style={{
                backgroundColor:'#262626',
                borderWidth:1,
                borderColor:'#333',
                borderRadius:8,
                padding:12,
                minHeight:90,
                color:'#FFFFFF',
                textAlignVertical:'top',
                marginBottom:12,
              }}
              placeholder="Agregar un comentario..."
              placeholderTextColor="#666"
              multiline
              value={assignComment}
              onChangeText={setAssignComment}
              editable={!assignLoading}
            />
            {assignError && <Text style={{ color:'#ff6b6b', marginBottom:8 }}>{assignError}</Text>}
            <RNView style={{ flexDirection:'row', justifyContent:'flex-end', gap:12 }}>
              <TouchableOpacity disabled={assignLoading} onPress={closeAssignModal}>
                <Text style={{ color:'#B0B0B0', fontSize:16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAssignRoutine}
                disabled={assignLoading}
                style={{
                  backgroundColor: assignLoading ? '#444' : '#FF6B35',
                  paddingHorizontal:20,
                  paddingVertical:12,
                  borderRadius:24,
                  flexDirection:'row',
                  alignItems:'center'
                }}
              >
                {assignLoading && <ActivityIndicator color="#fff" style={{ marginRight:8 }} />}
                <Text style={{ color:'#FFFFFF', fontWeight:'600', fontSize:16 }}>Establecer como rutina</Text>
              </TouchableOpacity>
            </RNView>
          </RNView>
        </RNView>
      </Modal>
    </ScreenWrapper>
  );
}

export default RoutineTemplatesScreen;
