import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface PeriodSelectorProps {
  label: string;
  onPress: () => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ label, onPress }) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: Colors[colorScheme ?? 'light'].text,
          marginRight: 8,
        }}
      >
        {t('progress_dashboard_period_label')}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: Colors[colorScheme ?? 'light'].tint,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: Colors[colorScheme ?? 'light'].text,
          marginLeft: 8,
        }}
      >
        ▼
      </Text>
    </TouchableOpacity>
  );
};

export default PeriodSelector;
