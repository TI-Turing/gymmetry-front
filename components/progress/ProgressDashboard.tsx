import React, { useMemo, useState, useCallback } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { useMultiProgressSummary } from '../../hooks/useProgress';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useColorScheme } from '../../components/useColorScheme';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../i18n';
import Colors from '../../constants/Colors';
// Modales refactorizados
import PeriodModal from './sections/PeriodModal';
import CustomPeriodModal from './sections/CustomPeriodModal';
// Secciones refactorizadas
import PeriodSelector from './sections/PeriodSelector';
import MeasuresCard from './sections/MeasuresCard';
import KpiBadge from './sections/KpiBadge';
import ProgressBar from './sections/ProgressBar';
import MuscleDistribution from './sections/MuscleDistribution';
import FeaturedExercises from './sections/FeaturedExercises';
import Objectives from './sections/Objectives';
import Suggestions from './sections/Suggestions';
import Discipline from './sections/Discipline';
import NoData from './sections/NoData';

type PeriodType =
  | 'month'
  | '3months'
  | '6months'
  | 'year'
  | '2years'
  | 'custom';

interface PeriodOption {
  type: PeriodType;
  label: string;
  from: string;
  to: string;
  days: number;
}

const ProgressDashboard: React.FC = () => {
  const [_showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('3months');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showAllMeasures, setShowAllMeasures] = useState(false);

  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { t } = useI18n();

  const getPeriodOptions = useCallback((): PeriodOption[] => {
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const last3Months = new Date(today);
    last3Months.setMonth(today.getMonth() - 3);

    const last6Months = new Date(today);
    last6Months.setMonth(today.getMonth() - 6);

    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);

    const last2Years = new Date(today);
    last2Years.setFullYear(today.getFullYear() - 2);

    return [
      {
        type: 'month',
        label: t('progress_dashboard_last_month'),
        from: formatDate(lastMonth),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '3months',
        label: t('progress_dashboard_last_3_months'),
        from: formatDate(last3Months),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last3Months.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '6months',
        label: t('progress_dashboard_last_6_months'),
        from: formatDate(last6Months),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last6Months.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: 'year',
        label: t('progress_dashboard_last_year'),
        from: formatDate(lastYear),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - lastYear.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      {
        type: '2years',
        label: t('progress_dashboard_last_2_years'),
        from: formatDate(last2Years),
        to: formatDate(today),
        days: Math.ceil(
          (today.getTime() - last2Years.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
    ];
  }, [t]);

  const options = useMemo(() => getPeriodOptions(), [getPeriodOptions]);
  const currentOption = options.find((opt) => opt.type === selectedPeriod);

  // Determine period parameters
  const from = selectedPeriod === 'custom' ? customFrom : currentOption?.from;
  const to = selectedPeriod === 'custom' ? customTo : currentOption?.to;
  const days =
    selectedPeriod === 'custom'
      ? customFrom && customTo
        ? Math.ceil(
            (new Date(customTo).getTime() - new Date(customFrom).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : 0
      : currentOption?.days;

  const { data, loading, error } = useMultiProgressSummary({
    UserId: user?.id || '',
    Periods: [
      {
        From: from || '',
        To: to || '',
        Days: days || 0,
      },
    ],
    IncludeHistory: false,
  });

  // Defensive data validation
  const safeRender = useMemo(() => {
    try {
      if (!data || typeof data !== 'object') return false;
      // Allow processing even if some fields are missing
      return true;
    } catch {
      return false;
    }
  }, [data]);

  const current = useMemo((): ProgressSummaryResponse | null => {
    const normalizeArray = (raw: unknown): unknown[] => {
      try {
        const anyRaw = raw as Record<string, unknown> & { $values?: unknown[] };
        if (Array.isArray(anyRaw)) return anyRaw;
        return (anyRaw?.$values as unknown[]) ?? [];
      } catch {
        return [];
      }
    };

    if (!safeRender || !data) return null;

    try {
      const rawData = data as Record<string, unknown>;

      // Normalize suggestions array if present
      const suggestions = rawData.Suggestions
        ? normalizeArray(rawData.Suggestions)
        : [];

      // Return normalized data structure
      return {
        ...rawData,
        Suggestions: suggestions,
      } as ProgressSummaryResponse;
    } catch {
      return null;
    }
  }, [data, safeRender]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? 'light'].tint}
        />
        <Text
          style={{
            marginTop: 16,
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 16,
          }}
        >
          {t('progress_tabs_loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    const errorMessage =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof (error as { message?: unknown }).message === 'string'
        ? String((error as { message?: unknown }).message)
        : JSON.stringify(error);

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          {`${t('progress_tabs_error_loading')}: ${errorMessage}`}
        </Text>
      </View>
    );
  }

  // Early return if there are data issues
  if (!safeRender || !current) {
    // In development, show debugging info
    if (__DEV__) {
      return (
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          }}
          contentContainerStyle={{ padding: 16 }}
        >
          <View
            style={{
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: Colors[colorScheme ?? 'light'].text,
                marginBottom: 8,
              }}
            >
              Debug Info:
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              safeRender: {String(safeRender)}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              current: {String(!!current)}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              loading: {String(loading)}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              error: {String(!!error)}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              data: {String(!!data)}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              from: {from || 'undefined'}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              to: {to || 'undefined'}
            </Text>
            <Text style={{ color: Colors[colorScheme ?? 'light'].text }}>
              days: {days || 'undefined'}
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <NoData
        message={
          loading ? t('progress_tabs_loading') : t('progress_dashboard_no_data')
        }
      />
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Selector de periodo */}
      <PeriodSelector
        label={currentOption?.label || t('progress_dashboard_select_period')}
        onPress={() => setShowPeriodModal(true)}
      />

      {current.Assessments?.Latest && (
        <MeasuresCard
          latest={current.Assessments.Latest}
          showAll={showAllMeasures}
          onToggleShowAll={() => setShowAllMeasures((prev) => !prev)}
          onShowHistory={() => setShowHistoryModal(true)}
        />
      )}

      {/* Debug info - temporary */}
      {__DEV__ && (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            Current Data Structure:
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Assessments: {String(!!current.Assessments?.Latest)}
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Muscles: {String(!!current.Muscles?.Distribution)}
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Exercises: {String(!!current.Exercises)}
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Objectives:{' '}
            {String(
              !!current.Objectives?.Planned && !!current.Objectives?.Executed
            )}
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Suggestions:{' '}
            {String(!!current.Suggestions && current.Suggestions.length > 0)}
          </Text>
          <Text
            style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: 12 }}
          >
            Discipline: {String(!!current.Discipline)}
          </Text>
        </View>
      )}

      {/* KPIs principales */}
      <View
        style={{
          backgroundColor: Colors[colorScheme ?? 'light'].card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            marginBottom: 16,
          }}
        >
          {t('progress_dashboard_period_summary')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <KpiBadge
            label={t('progress_dashboard_adherence')}
            value={`${current?.Adherence?.AdherencePct || 0}%`}
            color="#4CAF50"
          />
          <KpiBadge
            label={t('progress_dashboard_current_streak')}
            value={`${current?.Adherence?.CurrentStreak || 0} ${t('progress_dashboard_days')}`}
            color="#2196F3"
          />
          <KpiBadge
            label={t('progress_dashboard_sessions')}
            value={(current?.Adherence?.Sessions || 0).toString()}
            color="#FF9800"
          />
          <KpiBadge
            label={t('progress_dashboard_exercises')}
            value={(current?.Exercises?.DistinctExercises || 0).toString()}
            color="#9C27B0"
          />
        </View>
        <ProgressBar
          completed={current?.Adherence?.CompletedDays || 0}
          total={current?.Adherence?.TargetDays || 0}
        />
      </View>

      {current.Muscles?.Distribution && (
        <MuscleDistribution
          distribution={current.Muscles.Distribution}
          dominant={current.Muscles.Dominant}
        />
      )}

      <FeaturedExercises
        topExercises={current.Exercises?.TopExercises || []}
        totalSeries={current.Exercises?.TotalSeries || 0}
        totalReps={current.Exercises?.TotalReps || 0}
        totalMinutes={current.Time?.TotalMinutes || 0}
      />

      {current.Objectives?.Planned && current.Objectives?.Executed && (
        <Objectives
          planned={current.Objectives.Planned}
          executed={current.Objectives.Executed}
        />
      )}

      <Suggestions suggestions={current.Suggestions || []} />

      {current.Discipline && (
        <Discipline
          consistencyIndex={current.Discipline.ConsistencyIndex || 0}
          commonStartHour={current.Discipline.CommonStartHour || 'N/A'}
          scheduleRegularity={String(
            current.Discipline.ScheduleRegularity || 'N/A'
          )}
        />
      )}

      {/* Modales refactorizados */}
      <PeriodModal
        visible={showPeriodModal}
        selectedPeriod={selectedPeriod}
        onPeriodSelect={(type: string) => setSelectedPeriod(type as PeriodType)}
        onCustomRequest={() => {
          setShowPeriodModal(false);
          setShowCustomModal(true);
        }}
        onClose={() => setShowPeriodModal(false)}
      />

      <CustomPeriodModal
        visible={showCustomModal}
        customFrom={customFrom}
        customTo={customTo}
        onFromChange={setCustomFrom}
        onToChange={setCustomTo}
        onApply={() => {
          if (customFrom && customTo) {
            setSelectedPeriod('custom');
            setShowCustomModal(false);
          }
        }}
        onClose={() => setShowCustomModal(false)}
      />
    </ScrollView>
  );
};

export default ProgressDashboard;
