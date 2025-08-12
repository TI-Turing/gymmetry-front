import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { routineTemplateService } from '@/services';
import { RoutineTemplateSkeleton } from './RoutineTemplateSkeleton';
import { styles } from './styles';

const RoutineTemplateList = React.memo(() => {
  const loadRoutineTemplates = useCallback(async () => {
    const response =
      await routineTemplateService.getAllRoutineTemplates();
    return response.Data || [];
  }, []);

  const renderRoutineTemplateItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.listCard}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {item.name || `Template ${item.id?.slice(0, 8)}`}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activa' : 'Inactiva'}
          </Text>
        </View>

        {item.description && (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Ejercicios:</Text>
          <Text style={styles.value}>{item.exerciseCount || '0'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Duración:</Text>
          <Text style={styles.value}>{item.duration || 'N/A'} min</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Creada:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Plantillas de Rutina'
      loadFunction={loadRoutineTemplates}
      renderItem={renderRoutineTemplateItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay plantillas'
      emptyMessage='No se encontraron plantillas de rutina'
      loadingMessage='Cargando plantillas...'
      useSkeletonLoading={true}
      skeletonComponent={<RoutineTemplateSkeleton count={5} />}
    />
  );
});

RoutineTemplateList.displayName = 'RoutineTemplateList';

export default RoutineTemplateList;
