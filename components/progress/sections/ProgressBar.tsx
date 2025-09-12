import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
    <View style={{ marginTop: 16 }}>
      <Text
        style={{
          fontSize: 14,
          color: Colors[colorScheme ?? 'light'].text,
          marginBottom: 8,
        }}
      >
        {t('progress_dashboard_weekly_progress')} ({completed}/{total}{' '}
        {t('progress_dashboard_days')})
      </Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', height: 40 }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const completado = i < completed;
          return (
            <View
              key={i}
              style={{
                flex: 1,
                height: completado ? 32 : 12,
                backgroundColor: completado
                  ? Colors[colorScheme ?? 'light'].tint
                  : Colors[colorScheme ?? 'light'].border,
                marginRight: i < total - 1 ? 2 : 0,
                borderRadius: 4,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ProgressBar;
