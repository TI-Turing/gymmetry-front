import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { routineTemplateService } from '@/services';
import { RoutineTemplateSkeleton } from './RoutineTemplateSkeleton';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineTemplateStyles } from './styles.themed';
import { normalizeCollection } from '@/utils';

const RoutineTemplateList = React.memo(() => {
  const styles = useThemedStyles(makeRoutineTemplateStyles);
  const loadRoutineTemplates = useCallback(async () => {
    const response = await routineTemplateService.getAllRoutineTemplates();
    const raw = (response?.Data ?? []) as unknown;
    return normalizeCollection<unknown>(raw);
  }, []);

  const renderRoutineTemplateItem = useCallback(
    ({ item }: { item: unknown }) => {
      const r = (item ?? {}) as Record<string, unknown>;
      const id = (r['Id'] as string) || (r['id'] as string) || '';
      const name = (r['name'] as string) || (r['Name'] as string) || null;
      const isActive =
        (r['isActive'] as boolean) ?? (r['IsActive'] as boolean) ?? false;
      const description =
        (r['description'] as string) ?? (r['Description'] as string) ?? null;
      const exerciseCount =
        (r['exerciseCount'] as number) ?? (r['ExerciseCount'] as number) ?? 0;
      const duration =
        (r['duration'] as number) ?? (r['Duration'] as number) ?? null;
      const createdAtStr =
        (r['createdAt'] as string) ?? (r['CreatedAt'] as string) ?? null;
      const createdAt = createdAtStr ? new Date(createdAtStr) : null;

      return (
        <View style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              {name || `Template ${id ? id.slice(0, 8) : ''}`}
            </Text>
            <Text style={styles.statusText}>
              {isActive ? 'Activa' : 'Inactiva'}
            </Text>
          </View>

          {!!description && (
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Ejercicios:</Text>
            <Text style={styles.value}>{String(exerciseCount)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>{duration ?? 'N/A'} min</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Creada:</Text>
            <Text style={styles.value}>
              {createdAt ? createdAt.toLocaleDateString() : 'N/A'}
            </Text>
          </View>
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
      (r['RoutineTemplateId'] as string) ||
      (r['routineTemplateId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Plantillas de Rutina"
      loadFunction={loadRoutineTemplates}
      renderItem={renderRoutineTemplateItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay plantillas"
      emptyMessage="No se encontraron plantillas de rutina"
      loadingMessage="Cargando plantillas..."
      useSkeletonLoading={true}
      skeletonComponent={<RoutineTemplateSkeleton count={5} />}
    />
  );
});

RoutineTemplateList.displayName = 'RoutineTemplateList';

export default RoutineTemplateList;
