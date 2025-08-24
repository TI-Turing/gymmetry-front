import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import { analyticsService, authService } from '@/services';
import type { AnalyticsSummaryResponse } from '@/dto';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeProgressStyles } from './styles/progress';

function ProgressScreen() {
  const { settings } = useAppSettings();
  const styles = useThemedStyles(makeProgressStyles);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'semana' | 'mes' | 'year'
  >('semana');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummaryResponse | null>(null);

  const periods = [
    { key: 'semana', label: 'Esta Semana' },
    { key: 'mes', label: 'Este Mes' },
    { key: 'year', label: 'Este Año' },
  ];

  const dateRange = useMemo(() => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const getMonday = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = (day === 0 ? -6 : 1) - day; // lunes como inicio
      date.setDate(date.getDate() + diff);
      return date;
    };
    if (selectedPeriod === 'semana') {
      const start = getMonday(today).toISOString().slice(0, 10);
      return { start, end };
    }
    if (selectedPeriod === 'mes') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      return { start: first, end };
    }
    const firstY = new Date(today.getFullYear(), 0, 1)
      .toISOString()
      .slice(0, 10);
    return { start: firstY, end };
  }, [selectedPeriod]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const user = await authService.getUserData();
        // 1) Llamar al backend primero (si analytics habilitado)
        const resp = settings.analyticsEnabled
          ? await analyticsService.getSummary({
              UserId: user?.id ?? '',
              StartDate: dateRange.start,
              EndDate: dateRange.end,
            })
          : null;
        if (resp?.Success && resp.Data) {
          if (!cancelled) setSummary(resp.Data);
        } else {
          // 2) Fallback: agregación local con Daily
          const local = await analyticsService.getSummaryFromDaily({
            UserId: user?.id ?? '',
            StartDate: dateRange.start,
            EndDate: dateRange.end,
          });
          if (local?.Success && local.Data) {
            if (!cancelled) setSummary(local.Data);
          } else {
            // 3) Mock como último recurso
            const mock = await analyticsService.getSummaryMock({
              UserId: user?.id ?? '',
              StartDate: dateRange.start,
              EndDate: dateRange.end,
            });
            if (!cancelled) setSummary(mock.Data!);
          }
        }
      } catch {
        const mock = await analyticsService.getSummaryMock({
          UserId: '',
          StartDate: dateRange.start,
          EndDate: dateRange.end,
        });
        if (!cancelled) setSummary(mock.Data!);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dateRange.start, dateRange.end]);

  const renderPeriodSelector = () => (
    <View style={styles.periodContainer}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() =>
            setSelectedPeriod(period.key as 'semana' | 'mes' | 'year')
          }
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period.key && styles.periodTextActive,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatCard = (
    title: string,
    value: string | number,
    target?: string | number,
    icon?: string,
    subtitle?: string
  ) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        {icon != null && icon !== '' && (
          <FontAwesome
            name={icon as any}
            size={20}
            color={styles.colors.text}
            style={styles.statIcon}
          />
        )}
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {target !== undefined && target !== null && (
        <Text style={styles.statTarget}>Meta: {target}</Text>
      )}
      {subtitle != null && subtitle !== '' && (
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      )}
    </View>
  );

  const renderProgressChart = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Progreso de Entrenamientos</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartBar}>
          <View
            style={[
              styles.chartProgress,
              {
                width: `${summary ? Math.min(100, (summary.DaysAdvanced / Math.max(1, summary.DaysExpected ?? 1)) * 100) : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.chartLabel}>
          {summary?.DaysAdvanced ?? 0} / {summary?.DaysExpected ?? 0} días
          avanzados
        </Text>
      </View>

      <Text style={styles.chartTitle}>Progreso de Calorías</Text>
      <View style={styles.chartContainer}>
        <View style={styles.chartBar}>
          <View
            style={[
              styles.chartProgress,
              {
                width: `${summary ? Math.min(100, (summary.TotalCalories / Math.max(1, 6000)) * 100) : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.chartLabel}>
          {summary?.TotalCalories ?? 0} / 6000 calorías
        </Text>
      </View>
    </View>
  );

  const renderWeightProgress = () => (
    <View style={styles.weightCard}>
      <View style={styles.weightHeader}>
        <FontAwesome
          name="balance-scale"
          size={24}
          color={styles.colors.text}
        />
        <Text style={styles.weightTitle}>Peso Actual</Text>
      </View>
      <Text style={styles.weightValue}>{summary?.CurrentWeightKg ?? 0} kg</Text>
      <View style={styles.weightChange}>
        <FontAwesome
          name={(summary?.WeightChangeKg ?? 0) < 0 ? 'arrow-down' : 'arrow-up'}
          size={16}
          color={
            (summary?.WeightChangeKg ?? 0) < 0
              ? styles.colors.green
              : styles.colors.red
          }
        />
        <Text
          style={[
            styles.weightChangeText,
            {
              color:
                (summary?.WeightChangeKg ?? 0) < 0
                  ? styles.colors.green
                  : styles.colors.red,
            },
          ]}
        >
          {Math.abs(summary?.WeightChangeKg ?? 0)} kg
        </Text>
      </View>
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsCard}>
      <Text style={styles.achievementsTitle}>Logros Recientes</Text>
      <View style={styles.achievementsList}>
        <View style={styles.achievementItem}>
          <FontAwesome name="trophy" size={20} color={styles.colors.gold} />
          <Text style={styles.achievementText}>5 días consecutivos</Text>
        </View>
        <View style={styles.achievementItem}>
          <FontAwesome name="fire" size={20} color={styles.colors.orange} />
          <Text style={styles.achievementText}>1000 calorías quemadas</Text>
        </View>
        <View style={styles.achievementItem}>
          <FontAwesome name="star" size={20} color={styles.colors.green} />
          <Text style={styles.achievementText}>Meta semanal cumplida</Text>
        </View>
      </View>
    </View>
  );

  const renderStreaksAndAvg = () => (
    <View style={styles.statsGrid}>
      {renderStatCard(
        'Racha actual',
        `${summary?.CurrentStreakDays ?? 0} días`,
        undefined,
        'bolt'
      )}
      {renderStatCard(
        'Racha más larga',
        `${summary?.LongestStreakDays ?? 0} días`,
        undefined,
        'trophy'
      )}
    </View>
  );

  const renderAverages = () => (
    <View style={styles.statsGrid}>
      {renderStatCard(
        'Promedio sesión',
        `${summary?.AvgDurationMinutes ?? 0} min`,
        undefined,
        'clock-o'
      )}
      {renderStatCard(
        'Tiempo total',
        `${summary?.TotalDurationMinutes ?? 0} min`,
        undefined,
        'hourglass-2'
      )}
    </View>
  );

  const renderRoutineUsage = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Uso de Rutinas</Text>
      {summary?.RoutineUsage?.length ? (
        summary.RoutineUsage.sort((a, b) => b.UsagePercent - a.UsagePercent)
          .slice(0, 5)
          .map((item) => (
            <View key={item.RoutineTemplateId} style={{ marginBottom: 12 }}>
              <Text
                style={{ color: styles.colors.text, marginBottom: 6 }}
                numberOfLines={1}
              >
                {item.RoutineTemplateName}
              </Text>
              <View style={styles.chartBar}>
                <View
                  style={[
                    styles.chartProgress,
                    { width: `${Math.min(100, item.UsagePercent)}%` },
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>
                {item.UsagePercent.toFixed(0)}%
              </Text>
            </View>
          ))
      ) : (
        <Text style={styles.chartLabel}>Sin datos</Text>
      )}
    </View>
  );

  const weekdayLabel = (d: number) =>
    ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d] || '';

  const renderWeekdayDiscipline = () => {
    const items = summary?.WeekdayDiscipline || [];
    const max = items.reduce((m, it) => Math.max(m, it.DaysTrained), 1);
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Días con más disciplina</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((wd) => {
            const it = items.find((x) => x.Weekday === (wd as any));
            const v = it?.DaysTrained ?? 0;
            const h = max ? Math.max(4, (v / max) * 80) : 4;
            return (
              <View key={wd} style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 10,
                    height: 80,
                    backgroundColor: styles.colors.track,
                    borderRadius: 6,
                    overflow: 'hidden',
                    justifyContent: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: h,
                      backgroundColor: styles.colors.green,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: styles.colors.muted,
                    marginTop: 6,
                    fontSize: 12,
                  }}
                >
                  {weekdayLabel(wd)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderBranchAttendance = () => (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>Sedes más visitadas</Text>
      {summary?.BranchAttendance?.length ? (
        summary.BranchAttendance.map((b) => (
          <View key={b.BranchId} style={{ marginBottom: 12 }}>
            <Text
              style={{ color: styles.colors.text, marginBottom: 6 }}
              numberOfLines={1}
            >
              {b.BranchName}
            </Text>
            <View style={styles.chartBar}>
              <View
                style={[
                  styles.chartProgress,
                  { width: `${Math.min(100, b.Percent)}%` },
                ]}
              />
            </View>
            <Text style={styles.chartLabel}>{b.Percent.toFixed(0)}%</Text>
          </View>
        ))
      ) : (
        <Text style={styles.chartLabel}>Sin registros</Text>
      )}
    </View>
  );

  return (
    <ScreenWrapper headerTitle="Mi Progreso" showBackButton={false}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mi Progreso</Text>
          <Text style={styles.subtitle}>Seguimiento de tu evolución</Text>
        </View>

        {renderPeriodSelector()}

        <View style={styles.statsGrid}>
          {renderStatCard(
            'Días avanzados',
            summary?.DaysAdvanced ?? 0,
            summary?.DaysExpected ?? 0,
            'dumbbell'
          )}
          {renderStatCard(
            'Calorías',
            summary?.TotalCalories ?? 0,
            6000,
            'fire'
          )}
        </View>

        {renderProgressChart()}
        {renderWeightProgress()}
        {renderStreaksAndAvg()}
        {renderAverages()}
        {renderRoutineUsage()}
        {renderWeekdayDiscipline()}
        {renderBranchAttendance()}
        {renderAchievements()}

        <View style={styles.footer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

export default withWebLayout(ProgressScreen, { defaultTab: 'progress' });
