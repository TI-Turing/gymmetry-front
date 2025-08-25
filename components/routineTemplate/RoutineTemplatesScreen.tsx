import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  View as RNView,
  TextInput,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { routineTemplateService, routineAssignedService } from '@/services';
import { authService } from '@/services/authService';
import type { RoutineTemplate } from '@/models/RoutineTemplate';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { View, Text } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineTemplateStyles } from './styles.themed';
import RoutineAssignedCard from '@/components/routineAssigned';
import { RoutineTemplateSkeleton } from './RoutineTemplateSkeleton';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import type { MenuOption } from '@/components/layout/MobileHeader';
import RoutineFilters, { type FilterState } from './RoutineFilters';
import {
  applyRoutineFilters,
  createEmptyFilters,
  getActiveFiltersCount,
} from './filterUtils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useI18n } from '@/i18n';
// import { gymService } from '@/services/gymService';

function RoutineTemplatesScreen() {
  const styles = useThemedStyles(makeRoutineTemplateStyles);
  const { t: translate } = useI18n();
  // Datos
  const [activeAssignment, setActiveAssignment] =
    useState<RoutineAssigned | null>(null);
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
  const [selectedTemplate, setSelectedTemplate] =
    useState<RoutineTemplate | null>(null);
  const [assignComment, setAssignComment] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Detalle movido a pantalla aparte

  // Rutinas filtradas usando useMemo para optimizar performance
  const filteredTemplates = useMemo(() => {
    // Excluir la rutina actualmente asignada (si se conoce su id) de la lista disponible
    let base = applyRoutineFilters(templates, filters);
    const aa = activeAssignment as unknown as {
      RoutineTemplate?: { Id?: string };
      RoutineTemplateId?: string;
      RoutineTemplates?: { Id?: string }[];
    } | null;
    const activeTemplateId =
      aa?.RoutineTemplate?.Id ||
      aa?.RoutineTemplateId ||
      aa?.RoutineTemplates?.[0]?.Id;
    if (activeTemplateId) {
      base = base.filter((t) => t.Id !== activeTemplateId);
    }
    return base;
  }, [templates, filters, activeAssignment]);

  // Instrumentación helper
  const log = (_label: string, _start?: number) => {
    // no-op
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
      if (!userId) throw new Error(translate('user_not_authenticated'));

      // 1. Cargar plantillas primero (no bloqueante con asignación)
      const tTemplatesStart = performance.now();
      const templatesRes = await routineTemplateService
        .getAllRoutineTemplates()
        .catch(() => null);
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
        .findRoutineAssignedsByFields({
          UserId: userId,
        } as Record<string, unknown>)
        .then((assignedRes) => {
          log('assigned fetch', tAssignedStart);
          if (
            assignedRes?.Success &&
            Array.isArray(assignedRes.Data) &&
            assignedRes.Data.length > 0
          ) {
            const active = assignedRes.Data[0];
            setActiveAssignment(active);
            // Persistir RoutineTemplateId activo
            const a = active as unknown as {
              RoutineTemplateId?: string;
              RoutineTemplates?: { Id?: string }[];
            };
            const rtid = a?.RoutineTemplateId || a?.RoutineTemplates?.[0]?.Id;
            if (rtid) authService.setActiveRoutineTemplateId(rtid);
          } else {
            setActiveAssignment(null);
          }
        })
        .catch(() => setActiveAssignment(null))
        .finally(() => setLoadingAssignment(false));
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : translate('loading_routines_error');
      setError(msg);
      setLoadingTemplates(false);
      setLoadingAssignment(false);
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    } finally {
      log('total load', totalStart);
    }
  }, [translate]);

  useEffect(() => {
    fetchTemplatesFirst();
    return () => {
      if (skeletonTimerRef.current) clearTimeout(skeletonTimerRef.current);
    };
  }, [fetchTemplatesFirst]);

  // Cerrar modal de asignación con tecla Escape en web
  const closeAssignModal = useCallback(() => {
    if (assignLoading) return;
    setShowAssignModal(false);
  }, [assignLoading]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e?.key === 'Escape' || e?.key === 'Esc') && showAssignModal) {
        closeAssignModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAssignModal, closeAssignModal]);

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
    setShowFilters((prev) => !prev);
  }, []);

  // Configurar menú específico para rutinas
  const routineMenuOptions: MenuOption[] = [
    {
      key: 'home',
      icon: 'home',
      label: translate('home'),
      action: () => router.push('/'),
    },
    {
      key: 'plans',
      icon: 'star',
      label: translate('routine_plans'),
      action: () => router.push('/plans'),
    },
    {
      key: 'progress',
      icon: 'line-chart',
      label: translate('progress'),
      action: () => router.push('/(tabs)/progress'),
    },
    {
      key: 'settings',
      icon: 'cog',
      label: translate('routine_settings'),
      action: () => {
        router.push('/settings');
      },
    },
    {
      key: 'logout',
      icon: 'sign-out',
      label: translate('routine_logout'),
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

  const openDetailScreen = (template: RoutineTemplate) => {
    router.push({
      pathname: '/routine-template-detail',
      params: { templateId: String(template.Id) },
    });
  };

  const handleAssignRoutine = async () => {
    if (!selectedTemplate) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      const user = await authService.getUserData();
      if (!user?.id) throw new Error(translate('user_not_authenticated'));

      const request = {
        Comments: assignComment.trim() || null,
        UserId: user.id,
        RoutineTemplateId: selectedTemplate.Id,
      };
      const resp = await routineAssignedService.addRoutineAssigned(request);
      if (!resp?.Success)
        throw new Error(resp?.Message || translate('assign_routine_error'));

      // Refrescar asignaciones para obtener la activa reciente
      const assignedRes =
        await routineAssignedService.findRoutineAssignedsByFields({
          UserId: user.id,
        } as Record<string, unknown>);
      if (
        assignedRes?.Success &&
        Array.isArray(assignedRes.Data) &&
        assignedRes.Data.length > 0
      ) {
        // Tomar la más reciente (asumimos primera) y añadir template seleccionado para mostrar nombre
        const newest = assignedRes.Data[0] as unknown as {
          RoutineTemplateId?: string;
          RoutineTemplates?: { Id?: string }[];
        };
        // Asegurar que la plantilla esté disponible para la card
        if (!newest.RoutineTemplates || newest.RoutineTemplates.length === 0) {
          newest.RoutineTemplates = [{ Id: selectedTemplate.Id }];
        }
        setActiveAssignment(newest as unknown as RoutineAssigned);
        const rtid =
          newest?.RoutineTemplateId || newest?.RoutineTemplates?.[0]?.Id;
        if (rtid) await authService.setActiveRoutineTemplateId(rtid);
      }
      setShowAssignModal(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : translate('unknown_error');
      setAssignError(msg);
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
        accessibilityLabel={translate('open_filters')}
      >
        <FontAwesome name="filter" size={20} color={styles.colors.onTint} />
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
      headerTitle={translate('routine_templates_title')}
      headerSubtitle={`${filteredTemplates.length} ${translate('of')} ${templates.length} ${translate('routine')}${templates.length !== 1 ? 's' : ''}`}
      showBackButton={true}
      onPressBack={handleGoBack}
      headerRightComponent={<FilterButton />}
      menuOptions={routineMenuOptions}
      backgroundColor={styles.colors.cardBg2}
    >
      <ScrollView
        style={[styles.container, { paddingTop: 0 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && <Text style={styles.error}>{error}</Text>}

        {activeAssignment ? (
          <>
            <Text style={styles.sectionTitle}>
              {translate('active_routine')}
            </Text>
            <RoutineAssignedCard
              assignment={activeAssignment}
              onPress={() => router.push('/routine-day')}
            />
          </>
        ) : (
          !loadingAssignment && (
            <Text style={styles.text}>{translate('no_active_routines')}</Text>
          )
        )}

        <Text style={styles.sectionTitle}>
          {translate('available_routines_in_plan')}
        </Text>

        {(loadingTemplates || refreshing) && showSkeleton ? (
          <RoutineTemplateSkeleton count={3} />
        ) : (
          <>
            {filteredTemplates.length === 0 && templates.length > 0 && (
              <Text style={styles.text}>
                {translate('no_routines_match_filters')}
              </Text>
            )}
            {filteredTemplates.length === 0 && templates.length === 0 && (
              <Text style={styles.text}>
                {translate('no_routines_available')}
              </Text>
            )}
            {filteredTemplates.map((t) => (
              <TouchableOpacity
                key={t.Id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => openDetailScreen(t)}
              >
                <View style={styles.badgeRow}>
                  <Text style={styles.cardTitle}>{t.Name}</Text>
                  <Text
                    style={[
                      styles.badge,
                      t.Premium ? styles.badgePremium : styles.badgeFree,
                    ]}
                  >
                    {t.Premium ? translate('premium') : translate('free')}
                  </Text>
                </View>
                {t.Comments && <Text style={styles.text}>{t.Comments}</Text>}
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => openAssignModal(t)}
                >
                  <Text style={styles.assignLabel}>
                    {translate('set_as_routine')}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
      <Modal
        visible={showAssignModal}
        transparent
        animationType="fade"
        onRequestClose={closeAssignModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeAssignModal}>
          <RNView
            style={styles.modalCard}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>{translate('set_routine')}</Text>
            <Text style={styles.modalSubTitle}>{selectedTemplate?.Name}</Text>
            <Text style={styles.modalLabel}>
              {translate('comment_optional')}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={translate('add_comment_placeholder')}
              placeholderTextColor={styles.colors.dim}
              multiline
              value={assignComment}
              onChangeText={setAssignComment}
              editable={!assignLoading}
            />
            {assignError && <Text style={styles.error}>{assignError}</Text>}
            <RNView style={styles.modalActions}>
              <TouchableOpacity
                disabled={assignLoading}
                onPress={closeAssignModal}
              >
                <Text style={styles.modalCancel}>{translate('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAssignRoutine}
                disabled={assignLoading}
                style={[
                  styles.modalPrimaryButton,
                  assignLoading && { opacity: 0.6 },
                ]}
              >
                {assignLoading && (
                  <ActivityIndicator
                    color={styles.colors.onTint}
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={styles.modalPrimaryText}>
                  {translate('set_as_routine_button')}
                </Text>
              </TouchableOpacity>
            </RNView>
          </RNView>
        </Pressable>
      </Modal>

      {/* Detalle ahora se navega a pantalla dedicada */}
      <TouchableOpacity
        style={styles.fabCreate}
        accessibilityRole="button"
        accessibilityLabel={translate('create_new_routine')}
        onPress={() => router.push('/create-routine')}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

export default RoutineTemplatesScreen;
