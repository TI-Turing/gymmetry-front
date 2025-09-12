import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

interface FeaturedExercisesProps {
  topExercises: { Name: string; Sessions: number; Reps: number }[];
  totalSeries: number;
  totalReps: number;
  totalMinutes: number;
}

const FeaturedExercises: React.FC<FeaturedExercisesProps> = ({
  topExercises,
  totalSeries,
  totalReps,
  totalMinutes,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
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
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors[colorScheme ?? 'light'].text,
          marginBottom: 12,
        }}
      >
        {t('progress_dashboard_featured_exercises')}
      </Text>
      {topExercises && topExercises.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            {t('progress_dashboard_most_practiced')}
          </Text>
          {topExercises.slice(0, 3).map((exercise, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor:
                  idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32',
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold', color: '#000' }}>
                {idx + 1}. {exercise.Name}
              </Text>
              <Text style={{ fontSize: 12, color: '#555' }}>
                {exercise.Sessions} sesiones • {exercise.Reps} reps
              </Text>
            </View>
          ))}
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {totalSeries}
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_total_series')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {totalReps}
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_repetitions')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {totalMinutes}
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_total_minutes')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FeaturedExercises;
