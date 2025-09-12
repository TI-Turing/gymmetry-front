import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';

export interface MeasuresCardProps {
  latest: Record<string, unknown>;
  showAll: boolean;
  onToggleShowAll: () => void;
  onShowHistory: () => void;
}

const mainKeys = ['Height', 'Weight', 'BodyFatPercentage'];

const MeasuresCard: React.FC<MeasuresCardProps> = ({
  latest,
  showAll,
  onToggleShowAll,
  onShowHistory,
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();
  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderRadius: 16,
        padding: 18,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: Colors[colorScheme ?? 'light'].tint,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: Colors[colorScheme ?? 'light'].tint,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {t('progress_dashboard_recent_measures')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {mainKeys.map((key) => {
          const value = latest?.[key];
          if (!value) return null;
          let label = key;
          if (key === 'Height') label = t('progress_dashboard_height');
          if (key === 'Weight') label = t('progress_dashboard_weight');
          if (key === 'BodyFatPercentage')
            label = t('progress_dashboard_body_fat');
          return (
            <View key={key} style={{ width: '48%', marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors[colorScheme ?? 'light'].text,
                  fontWeight: '600',
                }}
              >
                {label}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: Colors[colorScheme ?? 'light'].tint,
                  fontWeight: 'bold',
                }}
              >
                {String(value)}
              </Text>
            </View>
          );
        })}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
        }}
      >
        <TextButton
          onPress={onToggleShowAll}
          label={
            showAll
              ? t('progress_dashboard_see_less')
              : t('progress_dashboard_see_more')
          }
        />
        <TextButton
          onPress={onShowHistory}
          label={t('progress_dashboard_see_history')}
        />
      </View>
      {showAll && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          {Object.entries(latest || {}).map(([key, value]) => {
            if (!value || mainKeys.includes(key)) return null;
            let label = key;
            if (key === 'Waist') label = t('progress_dashboard_waist');
            if (key === 'Hip') label = t('progress_dashboard_hip');
            if (key === 'Chest') label = t('progress_dashboard_chest');
            if (key === 'Arm') label = t('progress_dashboard_arm');
            if (key === 'Leg') label = t('progress_dashboard_leg');
            return (
              <View key={key} style={{ width: '48%', marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: Colors[colorScheme ?? 'light'].text,
                    fontWeight: '600',
                  }}
                >
                  {label}
                </Text>
                <Text
                  style={{
                    fontSize: 17,
                    color: Colors[colorScheme ?? 'light'].tint,
                    fontWeight: 'bold',
                  }}
                >
                  {String(value)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const TextButton: React.FC<{ onPress: () => void; label: string }> = ({
  onPress,
  label,
}) => {
  const colorScheme = useColorScheme();
  return (
    <Text
      onPress={onPress}
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].tint,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        color: '#fff',
        fontWeight: 'bold',
        overflow: 'hidden',
      }}
    >
      {label}
    </Text>
  );
};

export default MeasuresCard;
