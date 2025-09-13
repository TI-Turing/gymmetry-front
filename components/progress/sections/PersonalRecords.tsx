import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';
import type { PersonalRecordItem } from '../../../dto/Progress/ProgressSummaryResponse';

export interface PersonalRecordsProps {
  personalRecords: PersonalRecordItem[];
  title?: string;
  showComparison?: boolean;
  previousRecords?: PersonalRecordItem[];
}

const PersonalRecords: React.FC<PersonalRecordsProps> = ({
  personalRecords,
  title,
  showComparison = false,
  previousRecords = [],
}) => {
  const colorScheme = useColorScheme();
  const { t } = useI18n();

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatWeight = (weight: number) => {
    return `${weight} kg`;
  };

  const getComparisonIcon = (current: PersonalRecordItem) => {
    if (!showComparison || !previousRecords.length) return null;

    const previous = previousRecords.find(
      (pr) => pr.ExerciseId === current.ExerciseId
    );

    if (!previous) {
      return (
        <FontAwesome
          name="plus-circle"
          size={16}
          color="#4CAF50"
          style={{ marginLeft: 8 }}
        />
      );
    }

    if (current.WeightKg > previous.WeightKg) {
      return (
        <FontAwesome
          name="arrow-up"
          size={16}
          color="#4CAF50"
          style={{ marginLeft: 8 }}
        />
      );
    }

    if (current.WeightKg < previous.WeightKg) {
      return (
        <FontAwesome
          name="arrow-down"
          size={16}
          color="#F44336"
          style={{ marginLeft: 8 }}
        />
      );
    }

    return (
      <FontAwesome
        name="minus"
        size={16}
        color={Colors[colorScheme ?? 'light'].text}
        style={{ marginLeft: 8, opacity: 0.5 }}
      />
    );
  };

  if (!personalRecords || personalRecords.length === 0) {
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
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            marginBottom: 16,
          }}
        >
          {title || t('progress_dashboard_personal_records')}
        </Text>
        <Text
          style={{
            color: Colors[colorScheme ?? 'light'].text,
            opacity: 0.7,
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          {t('progress_dashboard_no_personal_records')}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <FontAwesome
          name="trophy"
          size={20}
          color="#FFD700"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors[colorScheme ?? 'light'].text,
            flex: 1,
          }}
        >
          {title || t('progress_dashboard_personal_records')}
        </Text>
        {personalRecords.length > 0 && (
          <Text
            style={{
              fontSize: 14,
              color: Colors[colorScheme ?? 'light'].tint,
              fontWeight: '600',
            }}
          >
            {personalRecords.length} PRs
          </Text>
        )}
      </View>

      {personalRecords.map((record, index) => (
        <View
          key={`${record.ExerciseId}-${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors[colorScheme ?? 'light'].text,
                marginBottom: 4,
              }}
            >
              {record.ExerciseName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors[colorScheme ?? 'light'].text,
                opacity: 0.7,
              }}
            >
              {formatDate(record.AchievedAt)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: Colors[colorScheme ?? 'light'].tint,
              }}
            >
              {formatWeight(record.WeightKg)}
            </Text>
            {getComparisonIcon(record)}
          </View>
        </View>
      ))}
    </View>
  );
};

export default PersonalRecords;
