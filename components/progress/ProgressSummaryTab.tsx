import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProgressSummaryResponse } from '../../dto/Progress/ProgressSummaryResponse';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';
import { CustomAlert } from '../common/CustomAlert';
import Badge from './Badge';

interface Props {
  data?: ProgressSummaryResponse;
  loading: boolean;
  error?: Error | null;
  onRefresh: () => void;
}

const ProgressSummaryTab: React.FC<Props> = ({
  data,
  loading,
  error,
  onRefresh,
}) => {
  const themed = useThemedStyles(styles) as ReturnType<typeof styles>;
  if (loading) return <ActivityIndicator style={themed.loading} />;
  if (error)
    return (
      <CustomAlert
        visible
        type="error"
        title="Error"
        message={error.message}
        onClose={onRefresh}
      />
    );
  if (!data) return <Text style={themed.empty}>No hay datos de progreso.</Text>;

  return (
    <View style={themed.tabContent}>
      <Text style={themed.title}>Resumen de Progreso</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Badge
          label="Racha actual"
          value={`${data.Adherence.CurrentStreak} días`}
          color="#4CAF50"
        />
        <Badge
          label="Adherencia"
          value={`${data.Adherence.AdherencePct}%`}
          color="#2196F3"
        />
        <Badge
          label="Sesiones"
          value={data.Adherence.Sessions}
          color="#FF9800"
        />
      </View>
      <Text style={themed.value}>
        Periodo: {data.Period.From} a {data.Period.To} ({data.Period.Days} días)
      </Text>
      {/* Gráfico de barras simple de adherencia */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          height: 60,
          marginVertical: 8,
        }}
      >
        {Array.from({ length: data.Period.Days }).map((_, i) => {
          const completado = i < data.Adherence.CompletedDays;
          return (
            <View
              key={i}
              style={{
                width: 8,
                height: completado ? 48 : 18,
                backgroundColor: completado ? '#4CAF50' : '#E0E0E0',
                marginHorizontal: 1,
                borderRadius: 2,
              }}
            />
          );
        })}
      </View>
      <Text style={themed.value}>
        Días completados: {data.Adherence.CompletedDays} /{' '}
        {data.Adherence.TargetDays}
      </Text>
      <Text style={themed.value}>
        Tiempo total: {data.Time.TotalMinutes} min | Promedio por sesión:{' '}
        {data.Time.AvgPerSession} min
      </Text>
      <Text style={themed.value}>
        Última generación: {new Date(data.GeneratedAt).toLocaleString()}
      </Text>
    </View>
  );
};
export default ProgressSummaryTab;
