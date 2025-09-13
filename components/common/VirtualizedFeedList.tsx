import React, { useMemo, useCallback } from 'react';
import { VirtualizedList, ViewStyle, ListRenderItemInfo } from 'react-native';
import { OptimizedPostCard } from './OptimizedPostCard';
import type { FeedItem } from '@/types/feedTypes';

interface VirtualizedFeedListProps {
  items: FeedItem[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  refreshing?: boolean;
  hasMore?: boolean;
  style?: ViewStyle;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  currentUserId?: string;
  isAnonymousActive?: boolean;
  onToggleLike?: (postId: string) => void;
  onOpenComments?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onPostUpdated?: (updatedPost: FeedItem) => void;
}

// Altura estimada de cada item para optimización
const ITEM_HEIGHT = {
  default: 300,
  compact: 150,
  detailed: 400,
} as const;

const VirtualizedFeedList: React.FC<VirtualizedFeedListProps> = ({
  items,
  loading = false,
  onRefresh,
  onLoadMore,
  refreshing = false,
  hasMore = false,
  style,
  showActions = true,
  variant = 'default',
  currentUserId,
  isAnonymousActive = false,
  onToggleLike,
  onOpenComments,
  onShare,
  onPostUpdated,
}) => {
  // Función para obtener la altura estimada de cada item
  const getItemLayout = useCallback(
    (_data: FeedItem[] | null | undefined, index: number) => ({
      length: ITEM_HEIGHT[variant],
      offset: ITEM_HEIGHT[variant] * index,
      index,
    }),
    [variant]
  );

  // Función para obtener la clave única de cada item
  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  // Función para renderizar cada item optimizado
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedItem>) => (
      <OptimizedPostCard
        post={item}
        showActions={showActions}
        variant={variant}
        currentUserId={currentUserId}
        isAnonymousActive={isAnonymousActive}
        onToggleLike={onToggleLike}
        onOpenComments={onOpenComments}
        onShare={onShare}
        onPostUpdated={onPostUpdated}
      />
    ),
    [
      showActions,
      variant,
      currentUserId,
      isAnonymousActive,
      onToggleLike,
      onOpenComments,
      onShare,
      onPostUpdated,
    ]
  );

  // Función para manejar scroll al final (infinite scroll)
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  // Memoizar datos para evitar re-renders innecesarios
  const memoizedData = useMemo(() => items, [items]);

  return (
    <VirtualizedList
      data={memoizedData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={style}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={21}
      getItemCount={(data) => data?.length || 0}
      getItem={(data, index) => data?.[index]}
    />
  );
};

export { VirtualizedFeedList };
export type { VirtualizedFeedListProps };
