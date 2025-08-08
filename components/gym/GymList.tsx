import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { gymService } from '@/services';

export function GymList() {
  const loadGyms = useCallback(async () => {
    const response = await gymService.getAllGyms();
    return response.Data || [];
  }, []);

  const renderGymItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.name || item.gymName || 'Gimnasio sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Abierto' : 'Cerrado'}
          </Text>
        </View>
        
        <Text style={styles.description}>
          {item.description || 'Sin descripción disponible'}
        </Text>
        
        <View style={styles.addressSection}>
          <Text style={styles.address}>
            📍 {item.address || item.fullAddress || 'Dirección no disponible'}
          </Text>
          <Text style={styles.city}>
            {item.city || ''} {item.state || ''} {item.zipCode || ''}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{item.phone || item.phoneNumber || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{item.email || 'N/A'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Capacidad:</Text>
          <Text style={styles.value}>
            {item.currentOccupancy || 0} / {item.maxCapacity || 0} personas
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Horarios:</Text>
          <Text style={styles.value}>
            {item.openTime || '06:00'} - {item.closeTime || '22:00'}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Servicios:</Text>
          <Text style={styles.value}>{item.serviceCount || 0} disponibles</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Miembros:</Text>
          <Text style={styles.value}>{item.memberCount || 0} activos</Text>
        </View>
        
        {item.rating && (
          <View style={styles.ratingSection}>
            <Text style={styles.rating}>
              ⭐ Calificación: {item.rating}/5 ({item.reviewCount || 0} reviews)
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.gymId || String(Math.random()),
    []
  );

  return (
    <EntityList
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  addressSection: {
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.tabIconDefault + '20',
  },
  address: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  city: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  ratingSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  rating: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GymList;
