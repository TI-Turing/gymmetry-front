import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { gymService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymListStyles } from './styles/gymList';
import { normalizeCollection } from '@/utils';

const GymList = React.memo(() => {
  const loadGyms = useCallback(async () => {
    const response = await gymService.getAllGyms();
    const items = normalizeCollection<unknown>(response?.Data);
    return items;
  }, []);

  const { styles } = useThemedStyles(makeGymListStyles);

  const renderGymItem = useCallback(
    ({ item }: { item: unknown }) => {
      const r = (item ?? {}) as Record<string, unknown>;
      const name =
        (r['name'] as string) ||
        (r['gymName'] as string) ||
        'Gimnasio sin nombre';
      const isActive =
        (r['isActive'] as boolean) ?? (r['IsActive'] as boolean) ?? false;
      const description =
        (r['description'] as string) ?? 'Sin descripción disponible';
      const address =
        (r['address'] as string) ||
        (r['fullAddress'] as string) ||
        'Dirección no disponible';
      const city = (r['city'] as string) ?? '';
      const state = (r['state'] as string) ?? '';
      const zipCode = (r['zipCode'] as string) ?? '';
      const phone =
        (r['phone'] as string) || (r['phoneNumber'] as string) || 'N/A';
      const email = (r['email'] as string) ?? 'N/A';
      const currentOccupancy = (r['currentOccupancy'] as number) ?? 0;
      const maxCapacity = (r['maxCapacity'] as number) ?? 0;
      const openTime = (r['openTime'] as string) ?? '06:00';
      const closeTime = (r['closeTime'] as string) ?? '22:00';
      const serviceCount = (r['serviceCount'] as number) ?? 0;
      const memberCount = (r['memberCount'] as number) ?? 0;
      const rating = (r['rating'] as number) ?? null;
      const reviewCount = (r['reviewCount'] as number) ?? 0;

      return (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.statusText}>
              {isActive ? 'Abierto' : 'Cerrado'}
            </Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          <View style={styles.addressSection}>
            <Text style={styles.address}>📍 {address}</Text>
            <Text style={styles.city}>
              {city} {state} {zipCode}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Capacidad:</Text>
            <Text style={styles.value}>
              {currentOccupancy} / {maxCapacity} personas
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Horarios:</Text>
            <Text style={styles.value}>
              {openTime} - {closeTime}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Servicios:</Text>
            <Text style={styles.value}>{serviceCount} disponibles</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Miembros:</Text>
            <Text style={styles.value}>{memberCount} activos</Text>
          </View>

          {rating != null && (
            <View style={styles.ratingSection}>
              <Text style={styles.rating}>
                ⭐ Calificación: {rating}/5 ({reviewCount || 0} reviews)
              </Text>
            </View>
          )}
        </View>
      );
    },
    [styles]
  );

  const keyExtractor = useCallback((item: unknown) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['GymId'] as string) ||
      (r['gymId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

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
