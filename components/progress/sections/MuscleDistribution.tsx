import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';
import PieChartMuscle from '../PieChartMuscle';

interface MuscleDistributionProps {
  distribution: Record<string, number>;
  dominant?: string[];
}

const MuscleDistribution: React.FC<MuscleDistributionProps> = ({
  distribution,
  dominant,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  const hasData = distribution && Object.keys(distribution).length > 0;
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
        {t('progress_dashboard_muscle_distribution')}
      </Text>
      {hasData ? (
        <PieChartMuscle distribution={distribution} />
      ) : (
        <View
          style={{
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: Colors[colorScheme ?? 'light'].text,
              fontSize: 14,
              fontStyle: 'italic',
            }}
          >
            {t('progress_dashboard_no_muscle_data')}
          </Text>
        </View>
      )}
      {!!dominant && dominant.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: Colors[colorScheme ?? 'light'].text,
              marginBottom: 8,
            }}
          >
            {t('progress_dashboard_dominant_groups')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {dominant.map((muscle, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: Colors[colorScheme ?? 'light'].tint,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 12 }}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default MuscleDistribution;
