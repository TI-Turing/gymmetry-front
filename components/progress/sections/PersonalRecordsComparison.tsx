import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '../../useColorScheme';
import { useI18n } from '../../../i18n';
import type { PersonalRecordItem } from '../../../dto/Progress/ProgressSummaryResponse';

export interface PersonalRecordsComparisonProps {
  currentRecords: PersonalRecordItem[];
  previousRecords: PersonalRecordItem[];
  title?: string;
}

const PersonalRecordsComparison: React.FC<PersonalRecordsComparisonProps> = ({
  currentRecords,
  previousRecords,
  title,
}) => {
  const colorScheme = useColorScheme();
  const { t: _t } = useI18n();

  const formatWeight = (weight: number) => `${weight} kg`;

  // Análisis de cambios
  const getRecordChanges = () => {
    const newRecords: PersonalRecordItem[] = [];
    const improvedRecords: {
      current: PersonalRecordItem;
      previous: PersonalRecordItem;
      improvement: number;
    }[] = [];
    const maintainedRecords: PersonalRecordItem[] = [];

    currentRecords.forEach((current) => {
      const previous = previousRecords.find(
        (pr) => pr.ExerciseId === current.ExerciseId
      );

      if (!previous) {
        newRecords.push(current);
      } else if (current.WeightKg > previous.WeightKg) {
        improvedRecords.push({
          current,
          previous,
          improvement: current.WeightKg - previous.WeightKg,
        });
      } else if (current.WeightKg === previous.WeightKg) {
        maintainedRecords.push(current);
      }
    });

    return { newRecords, improvedRecords, maintainedRecords };
  };

  const { newRecords, improvedRecords, maintainedRecords } = getRecordChanges();

  const _formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (
    currentRecords.length === 0 &&
    previousRecords.length === 0 &&
    newRecords.length === 0
  ) {
    return null;
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
          {title || 'Comparación de Records'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: Colors[colorScheme ?? 'light'].tint,
            fontWeight: '600',
          }}
        >
          {currentRecords.length} PRs
        </Text>
      </View>

      {/* Nuevos Records */}
      {newRecords.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <FontAwesome name="plus-circle" size={16} color="#4CAF50" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#4CAF50',
                marginLeft: 8,
              }}
            >
              Nuevos Records ({newRecords.length})
            </Text>
          </View>
          {newRecords.map((record) => (
            <View
              key={record.ExerciseId}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderRadius: 8,
                marginBottom: 4,
                borderLeftWidth: 3,
                borderLeftColor: '#4CAF50',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                {record.ExerciseName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#4CAF50',
                }}
              >
                {formatWeight(record.WeightKg)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Records Mejorados */}
      {improvedRecords.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <FontAwesome name="arrow-up" size={16} color="#2196F3" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2196F3',
                marginLeft: 8,
              }}
            >
              Records Mejorados ({improvedRecords.length})
            </Text>
          </View>
          {improvedRecords.map((item) => (
            <View
              key={item.current.ExerciseId}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderRadius: 8,
                marginBottom: 4,
                borderLeftWidth: 3,
                borderLeftColor: '#2196F3',
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: Colors[colorScheme ?? 'light'].text,
                }}
              >
                {item.current.ExerciseName}
              </Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#2196F3',
                  }}
                >
                  {formatWeight(item.current.WeightKg)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: '#2196F3',
                  }}
                >
                  +{formatWeight(item.improvement)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Records Mantenidos */}
      {maintainedRecords.length > 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <FontAwesome
              name="minus"
              size={16}
              color={Colors[colorScheme ?? 'light'].text}
              style={{ opacity: 0.7 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors[colorScheme ?? 'light'].text,
                marginLeft: 8,
                opacity: 0.7,
              }}
            >
              Sin Cambios ({maintainedRecords.length})
            </Text>
          </View>
          {maintainedRecords.slice(0, 3).map((record) => (
            <View
              key={record.ExerciseId}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 6,
                paddingHorizontal: 12,
                marginBottom: 2,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: Colors[colorScheme ?? 'light'].text,
                  opacity: 0.7,
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
                {formatWeight(record.WeightKg)}
              </Text>
            </View>
          ))}
          {maintainedRecords.length > 3 && (
            <Text
              style={{
                fontSize: 12,
                color: Colors[colorScheme ?? 'light'].text,
                opacity: 0.5,
                textAlign: 'center',
                marginTop: 4,
              }}
            >
              +{maintainedRecords.length - 3} más
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default PersonalRecordsComparison;
