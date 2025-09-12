import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

interface ObjectivesProps {
  planned: Record<string, number>;
  executed: Record<string, number>;
}

const Objectives: React.FC<ObjectivesProps> = ({ planned, executed }) => {
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
        {t('progress_dashboard_objectives')}
      </Text>
      {Object.entries(planned).map(([key, plannedValue]) => {
        const exec = executed[key] || 0;
        const percentage = plannedValue > 0 ? (exec / plannedValue) * 100 : 0;
        return (
          <View key={key} style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >{`${exec}/${plannedValue}`}</Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: '#E0E0E0',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  height: '100%',
                  backgroundColor:
                    percentage >= 80
                      ? '#4CAF50'
                      : percentage >= 50
                        ? '#FF9800'
                        : '#F44336',
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Objectives;
