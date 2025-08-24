import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EntityList } from '../common/EntityList';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants/Theme';

const DailyHistoryList = React.memo(() => {
  const loadDailyHistories = useCallback(async () => {
    try {
      const result = await servicePlaceholder();
      return result || [];
    } catch {
      return [];
    }
  }, []);

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object';

  const renderDailyHistoryItem = useCallback(({ item }: { item: unknown }) => {
    const o = isRecord(item) ? item : ({} as Record<string, unknown>);
    const id = o.id != null ? String(o.id as unknown as string) : '';
    const name = (typeof o.name === 'string' && o.name) || 'DailyHistory name';
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>DailyHistory: {id}</Text>
        <Text style={styles.itemSubtitle}>{name}</Text>
      </View>
    );
  }, []);

  return (
    <EntityList
      title="Daily History"
      loadFunction={loadDailyHistories}
      renderItem={renderDailyHistoryItem}
      keyExtractor={(item) =>
        isRecord(item) && item.id != null
          ? String(item.id as unknown as string)
          : Math.random().toString()
      }
      emptyMessage="No daily history found"
    />
  );
});
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

DailyHistoryList.displayName = 'DailyHistoryList';

export default DailyHistoryList;
