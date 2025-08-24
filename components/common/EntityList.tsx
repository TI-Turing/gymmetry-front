import React, { ReactNode, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Button, EmptyState, LoadingOverlay } from '@/components/common';
import { useEntityList } from '@/hooks';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES } from '@/constants/Theme';

interface EntityListProps<T> {
  title: string;
  loadFunction: () => Promise<T[]>;
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  refreshButtonText?: string;
  showRefreshButton?: boolean;
  dependencies?: unknown[];
  extraContent?: ReactNode;
  skeletonComponent?: ReactNode;
  useSkeletonLoading?: boolean;
  useFlatList?: boolean; // permite desactivar FlatList cuando está anidado en ScrollView
}

/**
 * Componente genérico para listas de entidades con funcionalidad estándar
 * Incluye: loading, error handling, empty state, refresh
 */
export function EntityList<T>({
  title,
  loadFunction,
  renderItem,
  keyExtractor = (_, index) => String(index),
  emptyTitle = 'No hay elementos',
  emptyMessage = 'No se encontraron elementos',
  loadingMessage = 'Cargando...',
  refreshButtonText = 'Actualizar',
  showRefreshButton = true,
  dependencies = [],
  extraContent,
  skeletonComponent,
  useSkeletonLoading = false,
  useFlatList = true,
}: EntityListProps<T>) {
  const { items, loading, error, refreshItems } = useEntityList<T>(
    loadFunction,
    { dependencies }
  );

  const renderEmptyState = useCallback(
    () => (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionText="Reintentar"
        onAction={refreshItems}
      />
    ),
    [emptyTitle, emptyMessage, refreshItems]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {extraContent}

      {loading && useSkeletonLoading && skeletonComponent ? (
        <View style={{ flex: 1 }}>{skeletonComponent}</View>
      ) : useFlatList ? (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          contentContainerStyle={
            items?.length === 0 ? styles.emptyContainer : undefined
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={
            !items || items.length === 0 ? styles.emptyContainer : undefined
          }
        >
          {(!items || items.length === 0) && !loading
            ? renderEmptyState()
            : items
              ? items.map((it, idx) => {
                  type Info = Parameters<ListRenderItem<T>>[0];
                  const separators: Info['separators'] =
                    undefined as unknown as Info['separators'];
                  const element = renderItem({
                    item: it,
                    index: idx,
                    separators,
                  } as Info);
                  const key = keyExtractor(it, idx);
                  return <React.Fragment key={key}>{element}</React.Fragment>;
                })
              : null}
        </View>
      )}

      {showRefreshButton && (
        <Button
          title={refreshButtonText}
          onPress={refreshItems}
          disabled={loading}
          style={styles.refreshButton}
        />
      )}

      {(!useSkeletonLoading || !skeletonComponent) && (
        <LoadingOverlay visible={loading} message={loadingMessage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    marginBottom: SPACING.md,
    color: Colors.light.text,
  },
  error: {
    color: Colors.light.tint,
    marginVertical: SPACING.sm,
    textAlign: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  refreshButton: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.sm,
  },
});
