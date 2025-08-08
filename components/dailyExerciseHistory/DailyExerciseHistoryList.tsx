import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EntityList } from '../common/EntityList';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/Theme';

export function DailyExerciseHistoryList() {
  const loadDailyExerciseHistories = useCallback(async () => {
    try {
      const result = await servicePlaceholder();
      return result || [];
    } catch {
      return [];
    }
  }, []);

  const renderDailyExerciseHistoryItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>DailyExerciseHistory {item.id}</Text>
        <Text style={styles.itemSubtitle}>
          {item.name || 'DailyExerciseHistory name'}
        </Text>
      </View>
    ),
    []
  );

  return (
    <EntityList
      title='Daily Exercise History'
      loadFunction={loadDailyExerciseHistories}
      renderItem={renderDailyExerciseHistoryItem}
      keyExtractor={item => item.id?.toString() || Math.random().toString()}
      emptyMessage='No daily exercise histories found'
    />
  );
}

async function servicePlaceholder() {
  return Promise.resolve([]);
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    color: '#333',
  },
  itemSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: '#666',
  },
});
