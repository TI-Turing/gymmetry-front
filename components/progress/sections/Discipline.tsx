import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

interface DisciplineProps {
  consistencyIndex: number;
  commonStartHour: string;
  scheduleRegularity: string;
}

const Discipline: React.FC<DisciplineProps> = ({
  consistencyIndex,
  commonStartHour,
  scheduleRegularity,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
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
        {t('progress_dashboard_discipline')}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {Math.round((consistencyIndex || 0) * 100)}%
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_consistency')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {commonStartHour || 'N/A'}
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_common_hour')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: Colors[colorScheme ?? 'light'].tint,
            }}
          >
            {scheduleRegularity || 'N/A'}
          </Text>
          <Text
            style={{ fontSize: 12, color: Colors[colorScheme ?? 'light'].text }}
          >
            {t('progress_dashboard_regularity')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Discipline;
