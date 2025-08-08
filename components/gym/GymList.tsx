import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymFunctionsService } from '@/services/functions';
import { Gym } from '@/models/Gym';

export function GymList() {
  const loadGyms = useCallback(async () => {
    const response = await gymFunctionsService.getAllGyms();
    return response.Data || [];
  }, []);

  const renderGymItem = useCallback(
    ({ item }: { item: Gym }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.Name || 'Sin nombre'}</Text>
        {item.Description && (
          <Text style={styles.cardDescription}>{item.Description}</Text>
        )}
        {item.Email && <Text style={styles.cardEmail}>{item.Email}</Text>}
        {item.PhoneNumber && (
          <Text style={styles.cardPhone}>{item.PhoneNumber}</Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: Gym) => item.Id || String(Math.random()),
    []
  );

  return (
    <EntityList<Gym>
      title='Gimnasios'
      loadFunction={loadGyms}
      renderItem={renderGymItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay gimnasios'
      emptyMessage='No se encontraron gimnasios registrados'
      loadingMessage='Cargando gimnasios...'
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: Colors.light.text,
  },
  cardDescription: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.text,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  cardEmail: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.xs,
  },
  cardPhone: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
  },
});
export default styles;
