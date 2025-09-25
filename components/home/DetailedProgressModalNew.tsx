import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  Modal,
  ActivityIndicator,
  Pressable,
  Alert,
  StyleSheet,
  Platform,
  LayoutChangeEvent,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { useHomeDashboardAdapter } from '../../hooks/useHomeDashboardAdapter';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import * as Sharing from 'expo-sharing';
import ViewShot, { releaseCapture } from 'react-native-view-shot';
import { useI18n } from '../../i18n';
import { useColorScheme } from '../useColorScheme';

type ProgressStatus = 'success' | 'fail' | 'rest';

interface ProgressDataPoint {
  dayNumber: number;
  percentage: number;
  status: ProgressStatus;
}

interface ProgressMetrics {
  totalDays: number;
  daysWithActivity: number;
  completedDays: number;
  failedDays: number;
  restDays: number;
  completionPercentage: number;
  averageProgress: number;
  consistencyRate: number;
  bestDayPercentage: number;
  longestSuccessStreak: number;
}

const COMPLETION_THRESHOLD = 80;

const normalizeProgressArray = (raw: unknown): ProgressDataPoint[] => {
  const anyRaw = raw as { $values?: ProgressDataPoint[] } | ProgressDataPoint[];
  if (Array.isArray(anyRaw)) {
    return anyRaw;
  }

  return anyRaw?.$values ?? [];
};

const computeProgressMetrics = (
  progressData: ProgressDataPoint[]
): ProgressMetrics => {
  if (!progressData.length) {
    return {
      totalDays: 0,
      daysWithActivity: 0,
      completedDays: 0,
      failedDays: 0,
      restDays: 0,
      completionPercentage: 0,
      averageProgress: 0,
      consistencyRate: 0,
      bestDayPercentage: 0,
      longestSuccessStreak: 0,
    };
  }

  const sortedData = [...progressData].sort(
    (a, b) => a.dayNumber - b.dayNumber
  );

  const totalDays = sortedData.length;
  const daysWithActivity = sortedData.filter(
    (day) => day.percentage > 0
  ).length;
  const completedDays = sortedData.filter(
    (day) => day.percentage >= COMPLETION_THRESHOLD
  ).length;
  const failedDays = sortedData.filter(
    (day) => day.percentage > 0 && day.percentage < COMPLETION_THRESHOLD
  ).length;
  const restDays = totalDays - daysWithActivity;

  const totalProgress = sortedData.reduce(
    (acc, day) => acc + day.percentage,
    0
  );
  const averageProgress = totalDays > 0 ? totalProgress / totalDays : 0;
  const consistencyRate =
    daysWithActivity > 0 ? (completedDays / daysWithActivity) * 100 : 0;
  const bestDayPercentage = sortedData.reduce(
    (acc, day) => (day.percentage > acc ? day.percentage : acc),
    0
  );

  let currentStreak = 0;
  let longestSuccessStreak = 0;
  sortedData.forEach((day) => {
    if (day.percentage >= COMPLETION_THRESHOLD) {
      currentStreak += 1;
      longestSuccessStreak = Math.max(longestSuccessStreak, currentStreak);
    } else if (day.percentage > 0 || day.status === 'fail') {
      currentStreak = 0;
    }
  });

  const completionPercentage =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return {
    totalDays,
    daysWithActivity,
    completedDays,
    failedDays,
    restDays,
    completionPercentage,
    averageProgress,
    consistencyRate,
    bestDayPercentage,
    longestSuccessStreak,
  };
};

const CALENDAR_COLUMNS = 7;
const CALENDAR_SPACING = 8;
const MIN_CALENDAR_CELL = 52; // Aumentado para aprovechar el espacio extra
const ABSOLUTE_MIN_CALENDAR_CELL = 46;
const DISCIPLINE_CONTAINER_PADDING = 20; // Aumentado para más espacio interno
const DISCIPLINE_CONTAINER_MARGIN = -6; // Margen negativo para salir del contenedor
const CALENDAR_VERTICAL_BUFFER = 500; // Aumentado drásticamente para garantizar separación total

interface DetailedProgressModalNewProps {
  visible: boolean;
  onClose: () => void;
}

function DetailedProgressModalNew({
  visible,
  onClose,
}: DetailedProgressModalNewProps) {
  const { data, loading, error } = useHomeDashboardAdapter();
  const { t } = useI18n();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const [filterMode, setFilterMode] = useState<'month' | 'plan'>('month');
  // Referencia para capturar el contenido del modal
  const modalContentRef = useRef<ViewShot | null>(null);
  const [shareSnapshotMode, setShareSnapshotMode] = useState(false);
  const [isPreparingShare, setIsPreparingShare] = useState(false);
  const [calendarWidth, setCalendarWidth] = useState<number | null>(null);
  const [calendarHeight, setCalendarHeight] = useState<number | null>(null);
  const [calendarHeaderHeight, setCalendarHeaderHeight] = useState<
    number | null
  >(null);

  const handleCalendarAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    let dimensionChanged = false;

    if (width && !Number.isNaN(width)) {
      setCalendarWidth((previous) => {
        if (previous !== null && Math.abs(previous - width) < 1) {
          return previous;
        }

        dimensionChanged = true;
        return width;
      });
    }

    if (height && !Number.isNaN(height)) {
      setCalendarHeight((previous) => {
        if (previous !== null && Math.abs(previous - height) < 1) {
          return previous;
        }

        dimensionChanged = true;
        return height;
      });
    }

    if (dimensionChanged) {
      setCalendarHeaderHeight(null);
    }
  }, []);

  const handleCalendarHeaderLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    if (!height || Number.isNaN(height)) {
      return;
    }

    setCalendarHeaderHeight((previous) => {
      if (previous !== null && Math.abs(previous - height) < 1) {
        return previous;
      }

      return height;
    });
  }, []);

  // Verificar si el usuario tiene un plan activo
  // Esta información se obtiene del hook useDashboardData que consulta planService.findPlansByFields
  // con los parámetros { fields: { UserId: userData.id, IsActive: true } }
  const hasActivePlan = data.detailedProgress?.hasActivePlan || false;

  const detailedProgress = data.detailedProgress;

  const { planList, monthList } = useMemo(() => {
    if (!detailedProgress) {
      return {
        planList: [] as ProgressDataPoint[],
        monthList: [] as ProgressDataPoint[],
      };
    }

    return {
      planList: normalizeProgressArray(detailedProgress.planData),
      monthList: normalizeProgressArray(detailedProgress.monthData),
    };
  }, [detailedProgress]);

  const effectiveFilterMode = hasActivePlan ? filterMode : 'month';

  const progressData = useMemo<ProgressDataPoint[]>(() => {
    if (!detailedProgress) {
      return [];
    }

    if (effectiveFilterMode === 'plan' && hasActivePlan) {
      return planList;
    }

    return monthList;
  }, [
    detailedProgress,
    effectiveFilterMode,
    hasActivePlan,
    planList,
    monthList,
  ]);

  const hasPlanData = planList.length > 0;
  const hasMonthData = monthList.length > 0;
  const hasProgressData = progressData.length > 0;
  const anyDataAvailable = hasPlanData || hasMonthData;

  const metrics = useMemo(
    () => computeProgressMetrics(progressData),
    [progressData]
  );

  const metricCards = useMemo(() => {
    if (!hasProgressData) {
      return [];
    }

    const roundedAverage = Math.round(metrics.averageProgress);
    const roundedConsistency = Math.round(metrics.consistencyRate);
    const roundedBestDay = Math.round(metrics.bestDayPercentage);

    return [
      {
        key: 'totalProgress',
        value: `${metrics.completionPercentage}%`,
        label: t('progress_modal.total_progress'),
        helper: `${metrics.completedDays}/${metrics.totalDays} ${t('progress_modal.completed_days_suffix')}`,
      },
      {
        key: 'attendance',
        value: `${metrics.daysWithActivity}`,
        label: t('progress_modal.attended_days'),
        helper: t('progress_modal.attended_days_helper'),
      },
      {
        key: 'streak',
        value: `${metrics.longestSuccessStreak}`,
        label: t('progress_modal.longest_streak'),
        helper: t('progress_modal.longest_streak_helper'),
      },
      {
        key: 'average',
        value: `${roundedAverage}%`,
        label: t('progress_modal.average_progress'),
        helper: t('progress_modal.average_progress_helper'),
      },
      {
        key: 'consistency',
        value: `${roundedConsistency}%`,
        label: t('progress_modal.consistency_rate'),
        helper: `${metrics.completedDays}/${Math.max(metrics.daysWithActivity, 1)} ${t('progress_modal.consistency_rate_helper')}`,
      },
      {
        key: 'bestDay',
        value: `${roundedBestDay}%`,
        label: t('progress_modal.best_day'),
        helper: t('progress_modal.best_day_helper'),
      },
    ];
  }, [hasProgressData, metrics, t]);

  const renderModalContent = (includeMetrics: boolean) => {
    const headerContainerStyle = includeMetrics
      ? shareCaptureStyles.headerRow
      : {
          flexDirection: 'row' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'center' as const,
          marginBottom: 8,
          paddingTop: 2,
          paddingHorizontal: 4,
        };

    const headerSideSpacerStyle = includeMetrics
      ? shareCaptureStyles.headerSpacer
      : { width: 24 };

    const headerCenterWrapperStyle = includeMetrics
      ? shareCaptureStyles.headerCenter
      : {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          gap: 12,
        };

    const headerCenterContent = anyDataAvailable ? (
      <>
        {hasActivePlan && hasPlanData ? (
          <Pressable
            style={disciplineStyles.compactDropdown}
            onPress={() =>
              setFilterMode((current) => {
                if (effectiveFilterMode === 'plan') {
                  return 'month';
                }

                if (hasActivePlan && hasPlanData) {
                  return current === 'month' ? 'plan' : 'month';
                }

                return 'month';
              })
            }
          >
            <Text style={disciplineStyles.compactDropdownText}>
              {effectiveFilterMode === 'month'
                ? t('progress_modal.month_label')
                : t('progress_modal.plan_label')}
            </Text>
            <Ionicons name="chevron-down" size={14} color={colors.text} />
          </Pressable>
        ) : (
          <Text style={disciplineStyles.compactDropdownText}>
            {t('progress_modal.month_label')}
          </Text>
        )}

        <Text style={disciplineStyles.compactPercentage}>
          {metrics.completionPercentage}%
        </Text>
      </>
    ) : null;

    const header = (
      <View style={headerContainerStyle}>
        <View style={headerSideSpacerStyle} />

        <View style={headerCenterWrapperStyle}>{headerCenterContent}</View>

        {!includeMetrics ? (
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        ) : (
          <View style={headerSideSpacerStyle} />
        )}
      </View>
    );

    const noDataView = (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.text,
            textAlign: 'center',
          }}
        >
          {t('progress_modal.no_data_title')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.textMuted,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          {t('progress_modal.no_data_helper')}
        </Text>
      </View>
    );

    if (includeMetrics && metricCards.length > 0 && hasProgressData) {
      return (
        <View style={shareCaptureStyles.layout}>
          <View style={shareCaptureStyles.contentCard}>
            {header}
            <View style={shareCaptureStyles.gridWrapper}>
              {renderDisciplineGrid(progressData, true)}
            </View>
            <View style={shareCaptureStyles.metricsWrapper}>
              {metricCards.map((card) => (
                <View key={card.key} style={shareCaptureStyles.metricCard}>
                  <Text style={shareCaptureStyles.metricValue}>
                    {card.value}
                  </Text>
                  <Text style={shareCaptureStyles.metricLabel}>
                    {card.label}
                  </Text>
                  <Text style={shareCaptureStyles.metricHelper}>
                    {card.helper}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={shareCaptureStyles.watermarkContainer}>
            <Text style={shareCaptureStyles.watermarkText}>
              {t('progress_modal.watermark')}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {header}
        <View
          style={{ minHeight: 300 }} // Altura mínima en lugar de flex: 1
          onLayout={hasProgressData ? handleCalendarAreaLayout : undefined}
        >
          {hasProgressData
            ? renderDisciplineGrid(progressData, false)
            : noDataView}
        </View>
        {/* Cards informativos en la parte inferior */}
        {hasProgressData && metricCards.length > 0 && (
          <View style={disciplineStyles.metricsContainer}>
            {metricCards.map((card) => (
              <View key={card.key} style={disciplineStyles.metricCard}>
                <Text style={disciplineStyles.metricValue}>{card.value}</Text>
                <Text style={disciplineStyles.metricLabel}>{card.label}</Text>
                <Text style={disciplineStyles.metricHelper}>{card.helper}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // Función para compartir progreso capturando la vista como imagen
  const handleShare = async () => {
    let capturedUri: string | null = null;
    let shouldRestoreLandscape = false;

    try {
      if (!modalContentRef.current) {
        Alert.alert(
          t('progress_modal.capture_unavailable_title'),
          t('progress_modal.capture_unavailable_body'),
          [{ text: t('accept') }]
        );
        return;
      }

      const isSharingAvailable = await Sharing.isAvailableAsync();

      if (!isSharingAvailable) {
        Alert.alert(
          t('progress_modal.sharing_not_supported_title'),
          t('progress_modal.sharing_not_supported_body'),
          [{ text: t('accept') }]
        );
        return;
      }

      if (Platform.OS !== 'web') {
        try {
          const currentLock = await ScreenOrientation.getOrientationLockAsync();
          if (currentLock !== ScreenOrientation.OrientationLock.PORTRAIT_UP) {
            await ScreenOrientation.lockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            shouldRestoreLandscape = false; // Ya no necesitamos restaurar landscape
          }
        } catch (orientationError) {
          // Silenciar errores de orientación durante la captura
        }
      }

      setIsPreparingShare(true);
      setShareSnapshotMode(true);
      const waitNextFrame = () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      await waitNextFrame();
      await waitNextFrame();
      await waitNextFrame();
      await new Promise<void>((resolve) => setTimeout(resolve, 120));

      const captureResult = await modalContentRef.current.capture?.();
      capturedUri = captureResult ?? null;

      if (!capturedUri) {
        throw new Error('capture_failed');
      }

      await Sharing.shareAsync(capturedUri, {
        mimeType: 'image/png',
        dialogTitle: t('progress_modal.share_dialog_title'),
      });
    } catch (error) {
      Alert.alert(
        t('progress_modal.share_error_title'),
        t('progress_modal.share_error_body'),
        [{ text: t('accept') }]
      );
    } finally {
      if (capturedUri) {
        releaseCapture(capturedUri);
      }
      if (shouldRestoreLandscape && Platform.OS !== 'web') {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } catch (orientationError) {
          // Silenciar errores al restaurar orientación
        }
      }
      setShareSnapshotMode(false);
      setIsPreparingShare(false);
    }
  };

  // Función para obtener color de estado (igual al componente original)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.tint;
      case 'failed':
        return colors.background;
      case 'rest':
        return colors.textMuted;
      default:
        return colors.border;
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.tint;
      case 'failed':
        return colors.tint;
      case 'rest':
        return colors.textMuted;
      default:
        return colors.border;
    }
  };

  // Estilos para el componente (basados en el original)
  const disciplineStyles = {
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginHorizontal: -6, // Márgenes negativos para salir del padding del modal
      marginVertical: 6,
    },
    filterContainer: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'flex-end' as const,
      marginBottom: 10,
    },
    filterLabel: {
      fontSize: 14,
      color: colors.textMuted,
      marginRight: 8,
    },
    dropdown: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dropdownText: {
      fontSize: 14,
      color: colors.text,
      marginRight: 4,
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: colors.text,
    },
    percentage: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      color: colors.tint,
    },
    calendarContainer: {
      marginBottom: 8,
      paddingHorizontal: 0, // Eliminar padding horizontal del calendario
    },
    daysHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 6,
    },
    dayLabel: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.textMuted,
      textAlign: 'center' as const,
    },
    weekRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    daysRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    daySquare: {
      borderRadius: 6,
      borderWidth: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    emptyDayPlaceholder: {
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    },
    progressText: {
      fontSize: 9,
      textAlign: 'center' as const,
      marginTop: 1,
    },
    legend: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      alignItems: 'center' as const,
      marginTop: 8,
    },
    legendItem: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    legendCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      color: colors.textMuted,
    },
    // Estilos optimizados para mejor uso del espacio
    optimizedHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: 8,
      paddingHorizontal: 60, // Espacio para centrar considerando el botón X
      gap: 20, // Espacio entre el select y el porcentaje
    },
    compactDropdown: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    compactDropdownText: {
      fontSize: 12,
      color: colors.text,
      marginRight: 2,
    },
    compactPercentage: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: colors.tint,
    },
    metricsContainer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 8,
      paddingHorizontal: 20, // Restaurar padding para los cards
    },
    metricCard: {
      flexBasis: '48%' as const,
      flexGrow: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 8,
      minHeight: 80,
    },
    metricValue: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.tint,
      marginBottom: 2,
    },
    metricLabel: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.text,
      lineHeight: 16,
    },
    metricHelper: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
      lineHeight: 14,
    },
  };

  const shareCaptureStyles = {
    layout: {
      width: 400, // Ancho fijo independiente de pantalla
      height: 700, // Alto fijo para asegurar que todo quepa
      alignItems: 'stretch' as const,
      justifyContent: 'flex-start' as const,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    contentCard: {
      width: '100%' as const,
      alignSelf: 'center' as const,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginHorizontal: 8, // Márgenes para no salirse del contenedor
    },
    headerRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 12,
    },
    headerSpacer: {
      width: 20,
    },
    headerCenter: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: 14,
    },
    gridWrapper: {
      width: '100%' as const,
      marginBottom: 20,
    },
    metricsWrapper: {
      marginTop: 0,
      width: '100%' as const,
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between' as const,
      alignContent: 'flex-start' as const,
    },
    metricCard: {
      flexBasis: '48%' as const,
      maxWidth: '48%' as const,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      backgroundColor: colors.background,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    metricValue: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.tint,
      marginBottom: 6,
    },
    metricLabel: {
      fontSize: 13,
      fontWeight: '600' as const,
      color: colors.text,
    },
    metricHelper: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 6,
    },
    captureOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    captureBadge: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderWidth: 1,
      borderColor: colors.border,
    },
    captureText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginLeft: 12,
    },
    watermarkContainer: {
      marginTop: 16,
      alignItems: 'center' as const,
      width: '100%' as const,
    },
    watermarkText: {
      fontSize: 12,
      fontWeight: '600' as const,
      color: colors.tint,
      opacity: 0.8,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    calendarContainer: {
      margin: 0,
      paddingHorizontal: 20, // Actualizado para coincidir con disciplineStyles
      paddingVertical: 12,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    calendarInner: {
      paddingBottom: 8,
    },
    calendarDaysHeader: {
      marginBottom: 16, // Más espacio para el header
      justifyContent: 'space-between' as const,
    },
    calendarDayLabel: {
      fontSize: 15, // Ligeramente más grande
      width: 52, // Actualizado para coincidir con el ancho de las celdas
      marginHorizontal: 4, // Actualizado para coincidir con el spacing
      flex: 0,
    },
    calendarWeekRow: {
      marginBottom: 8, // Actualizado para coincidir con CALENDAR_SPACING
    },
    calendarDaysRow: {
      justifyContent: 'space-between' as const,
    },
    calendarDaySquare: {
      flex: 0,
      width: 52, // Actualizado para coincidir con MIN_CALENDAR_CELL
      height: 52,
      marginHorizontal: 4, // Actualizado para coincidir con CALENDAR_SPACING/2
      marginVertical: 4,
      borderRadius: 12, // Proporcionalmente más grande
    },
    calendarDayPlaceholder: {
      flex: 0,
      width: 52, // Actualizado para coincidir con MIN_CALENDAR_CELL
      height: 52,
      marginHorizontal: 4, // Actualizado para coincidir con CALENDAR_SPACING/2
      marginVertical: 4,
    },
    calendarDayNumber: {
      fontSize: 14, // Ligeramente más grande para las celdas más grandes
    },
    calendarProgressText: {
      fontSize: 11, // Ligeramente más grande para las celdas más grandes
      marginTop: 3,
    },
  };

  // Transformar datos reales para seguir el formato del componente original
  const transformToWeekData = (progressData: ProgressDataPoint[]) => {
    const weeks: { week: number; days: { day: string; status: string }[] }[] =
      [];

    const today = new Date();
    const currentDay = today.getDate();

    // Filtrar solo los días que ya han pasado o son hoy
    const pastData = progressData.filter(
      (dayData) => dayData.dayNumber <= currentDay
    );

    // Agrupar por semanas (7 días cada una)
    const weeksCount = Math.ceil(pastData.length / 7);

    for (let weekIndex = 0; weekIndex < weeksCount; weekIndex++) {
      const startIndex = weekIndex * 7;
      const endIndex = Math.min(startIndex + 7, pastData.length);
      const weekData = pastData.slice(startIndex, endIndex);

      const days: { day: string; status: string }[] = [];

      // Llenar los días de la semana
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dayData = weekData[dayIndex];
        if (dayData) {
          // Convertir el status del backend al formato esperado
          let status = 'rest';
          if (dayData.status === 'success' || dayData.percentage >= 80) {
            status = 'completed';
          } else if (
            dayData.status === 'fail' ||
            (dayData.percentage > 0 && dayData.percentage < 80)
          ) {
            status = 'failed';
          }

          days.push({
            day: dayData.dayNumber.toString(),
            status: status,
          });
        } else {
          // Para días vacíos, no agregar cuadro (día futuro)
          days.push({ day: '', status: 'empty' });
        }
      }

      weeks.push({
        week: weekIndex + 1,
        days: days,
      });
    }

    return weeks;
  };

  const renderDisciplineGrid = (
    progressDataList: ProgressDataPoint[],
    captureMode = false
  ) => {
    const weekData = transformToWeekData(progressDataList);
    const dayLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const rowCount = Math.max(weekData.length, 1);

    let liveDaySize = MIN_CALENDAR_CELL;
    let liveRowWidth: number | undefined;

    if (captureMode) {
      // En modo captura, usar un tamaño fijo independiente del tamaño de pantalla
      liveDaySize = 42; // Tamaño fijo apropiado para imagen de 400px de ancho
      liveRowWidth =
        liveDaySize * CALENDAR_COLUMNS +
        CALENDAR_SPACING * (CALENDAR_COLUMNS - 1);
    } else if (!captureMode) {
      const horizontalBudget =
        calendarWidth !== null
          ? Math.max(
              calendarWidth +
                2 * Math.abs(DISCIPLINE_CONTAINER_MARGIN) - // Sumar el espacio extra de márgenes negativos
                2 * DISCIPLINE_CONTAINER_PADDING,
              0
            )
          : 0;

      const rawWidthCandidate =
        horizontalBudget > 0
          ? Math.floor(
              (horizontalBudget - CALENDAR_SPACING * (CALENDAR_COLUMNS - 1)) /
                CALENDAR_COLUMNS
            )
          : MIN_CALENDAR_CELL;

      const safeWidthCandidate =
        !Number.isFinite(rawWidthCandidate) || rawWidthCandidate <= 0
          ? MIN_CALENDAR_CELL
          : rawWidthCandidate;

      let rawHeightCandidate = safeWidthCandidate;

      if (calendarHeight !== null) {
        const verticalBudget =
          calendarHeight -
          2 * (DISCIPLINE_CONTAINER_MARGIN + DISCIPLINE_CONTAINER_PADDING) -
          (calendarHeaderHeight ?? 0) -
          CALENDAR_VERTICAL_BUFFER;

        rawHeightCandidate =
          verticalBudget > 0
            ? Math.floor(
                (verticalBudget -
                  CALENDAR_SPACING * Math.max(rowCount - 1, 0)) /
                  rowCount
              )
            : ABSOLUTE_MIN_CALENDAR_CELL;
      }

      const safeHeightCandidate =
        !Number.isFinite(rawHeightCandidate) || rawHeightCandidate <= 0
          ? ABSOLUTE_MIN_CALENDAR_CELL
          : rawHeightCandidate;

      liveDaySize = Math.max(
        ABSOLUTE_MIN_CALENDAR_CELL,
        Math.min(safeWidthCandidate, safeHeightCandidate)
      );

      liveRowWidth =
        liveDaySize * CALENDAR_COLUMNS +
        CALENDAR_SPACING * (CALENDAR_COLUMNS - 1);
    }

    const containerStyle = disciplineStyles.container;

    const calendarWrapperStyle = [
      disciplineStyles.calendarContainer,
      {
        alignItems: 'center' as const,
      },
    ];

    const daysHeaderBaseStyle = [
      disciplineStyles.daysHeader,
      liveRowWidth
        ? {
            width: liveRowWidth,
            alignSelf: 'center' as const,
          }
        : null,
    ];

    const weekRowBaseStyle = [
      disciplineStyles.weekRow,
      {
        marginBottom: CALENDAR_SPACING,
        width: liveRowWidth ?? undefined,
        alignSelf: 'center' as const,
      },
    ];

    const daysRowBaseStyle = [
      disciplineStyles.daysRow,
      {
        justifyContent: 'flex-start' as const,
        width: liveRowWidth ?? undefined,
        alignSelf: 'center' as const,
      },
    ];

    return (
      <View style={containerStyle}>
        <View style={calendarWrapperStyle}>
          <View
            style={daysHeaderBaseStyle}
            onLayout={!captureMode ? handleCalendarHeaderLayout : undefined}
          >
            {dayLabels.map((day, index) => {
              const labelStyle = [
                disciplineStyles.dayLabel,
                {
                  width: liveDaySize,
                  marginRight:
                    index === CALENDAR_COLUMNS - 1 ? 0 : CALENDAR_SPACING,
                },
              ];

              return (
                <Text key={index} style={labelStyle}>
                  {day}
                </Text>
              );
            })}
          </View>

          {weekData.map((week, weekIndex) => (
            <View key={weekIndex} style={weekRowBaseStyle}>
              <View style={daysRowBaseStyle}>
                {week.days.map((dayData, dayIndex) => {
                  const isLastColumn = dayIndex === CALENDAR_COLUMNS - 1;
                  const spacingStyle = captureMode
                    ? null
                    : {
                        marginRight: isLastColumn ? 0 : CALENDAR_SPACING,
                      };

                  if (dayData.status === 'empty' || dayData.day === '') {
                    const placeholderStyle = [
                      disciplineStyles.emptyDayPlaceholder,
                      {
                        width: liveDaySize,
                        height: liveDaySize,
                      },
                      captureMode
                        ? {
                            marginHorizontal: CALENDAR_SPACING / 2,
                            marginVertical: CALENDAR_SPACING / 2,
                          }
                        : spacingStyle,
                    ];

                    return <View key={dayIndex} style={placeholderStyle} />;
                  }

                  const progressDay = progressDataList.find(
                    (d) => d.dayNumber.toString() === dayData.day
                  );
                  const percentage = progressDay?.percentage || 0;

                  const daySquareStyle = [
                    disciplineStyles.daySquare,
                    {
                      width: liveDaySize,
                      height: liveDaySize,
                      backgroundColor: getStatusColor(dayData.status),
                      borderColor: getStatusBorderColor(dayData.status),
                    },
                    captureMode
                      ? {
                          marginHorizontal: CALENDAR_SPACING / 2,
                          marginVertical: CALENDAR_SPACING / 2,
                        }
                      : spacingStyle,
                  ];

                  const dayNumberStyle = [
                    disciplineStyles.dayNumber,
                    {
                      color:
                        dayData.status === 'completed'
                          ? '#FFFFFF'
                          : colors.text,
                    },
                  ];

                  const progressTextStyle = [
                    disciplineStyles.progressText,
                    {
                      color:
                        dayData.status === 'completed'
                          ? '#FFFFFF'
                          : colors.textMuted,
                    },
                  ];

                  return (
                    <View key={dayIndex} style={daySquareStyle}>
                      <Text style={dayNumberStyle}>{dayData.day}</Text>
                      <Text style={progressTextStyle}>{percentage}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (visible) {
      // Forzar orientación vertical al abrir el modal
      const setupOrientation = async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.PORTRAIT_UP
          );
        } catch (orientationError) {
          // Silenciar errores de orientación
        }
      };

      timer = setTimeout(setupOrientation, 100);
    } else {
      // Volver a orientación libre al cerrar
      ScreenOrientation.unlockAsync().catch(() => {
        // Silenciar errores al limpiar
      });
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [visible]);

  if (loading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
            }}
          >
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={{ marginTop: 16, color: colors.text }}>
              Cargando datos...
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}
            >
              {t('progress_modal.loading_error_title')}
            </Text>
            <Text style={{ fontSize: 14, marginTop: 8, color: colors.text }}>
              {error}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: colors.tint,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {t('close')}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 6, // Padding mínimo para otros elementos
            paddingVertical: 6,
          }}
        >
          <ViewShot
            ref={modalContentRef}
            options={{ format: 'png', quality: 0.9, result: 'tmpfile' }}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  opacity: shareSnapshotMode ? 0 : 1,
                }}
              >
                {renderModalContent(false)}
              </View>

              {shareSnapshotMode && (
                <View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: colors.background },
                  ]}
                >
                  {renderModalContent(true)}
                </View>
              )}
            </View>
          </ViewShot>

          {isPreparingShare && (
            <View
              style={shareCaptureStyles.captureOverlay}
              pointerEvents="auto"
            >
              <View style={shareCaptureStyles.captureBadge}>
                <ActivityIndicator color={colors.tint} size="small" />
                <Text style={shareCaptureStyles.captureText}>
                  {t('progress_modal.preparing_capture')}
                </Text>
              </View>
            </View>
          )}

          {/* Botón para compartir */}
          {hasProgressData && (
            <View
              style={{
                paddingHorizontal: 20, // Mantener padding para el botón
                paddingBottom: 20,
              }}
            >
              <Pressable
                style={[
                  {
                    backgroundColor: colors.tint,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  },
                  (shareSnapshotMode || isPreparingShare) && { opacity: 0.6 },
                ]}
                onPress={handleShare}
                disabled={shareSnapshotMode || isPreparingShare}
              >
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: '600',
                  }}
                >
                  {t('progress_modal.share_button')}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export default DetailedProgressModalNew;
