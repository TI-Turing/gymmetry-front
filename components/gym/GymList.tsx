import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { gymService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymListStyles } from './styles/gymList';

const GymList = React.memo(() => {
  const loadGyms = useCallback(async () => {
    const response = await gymService.getAllGyms();
    return response.Data || [];
  }, []);

  const { styles } = useThemedStyles(makeGymListStyles);

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
          <Text style={styles.value}>
            {item.phone || item.phoneNumber || 'N/A'}
          </Text>
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
      title="Gimnasios"
      loadFunction={loadGyms}
      renderItem={renderGymItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay gimnasios"
      emptyMessage="No se encontraron gimnasios registrados"
      loadingMessage="Cargando gimnasios..."
    />
  );
});
GymList.displayName = 'GymList';

export default GymList;
