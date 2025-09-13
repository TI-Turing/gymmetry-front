import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, ListRenderItem } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { LoadingSpinner } from './LoadingSpinner';
import { UnifiedPostCard } from './UnifiedPostCard';
import { CommentsModal } from '../social/CommentsModal';
import { createUnifiedFeedStyles } from './styles/unifiedFeed';
import type { FeedItem } from '@/types/feedTypes';
export interface UnifiedFeedListProps {
  items: FeedItem[];
  loading?: boolean;
  error?: string | null;
  refetch?: () => Promise<void>;
  onLoadMore?: () => Promise<FeedItem[]>;
  currentUserId?: string;
  isAnonymousActive?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  enablePullToRefresh?: boolean;
  enableInfiniteScroll?: boolean;
}
export const UnifiedFeedList: React.FC<UnifiedFeedListProps> = ({
  items,
  loading = false,
  error = null,
  refetch,
  onLoadMore,
  currentUserId,
  isAnonymousActive = false,
  variant = 'default',
  enablePullToRefresh = true,
  enableInfiniteScroll = true,
}) => {
  const styles = useThemedStyles(createUnifiedFeedStyles);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Handlers
  const handleRefresh = useCallback(async () => {
    if (!enablePullToRefresh || !refetch) return;
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [enablePullToRefresh, refetch]);
  const handleLoadMore = useCallback(async () => {
    if (!enableInfiniteScroll || !onLoadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [enableInfiniteScroll, onLoadMore, isLoadingMore]);
  const handleToggleLike = useCallback((_postId: string) => {
    // TODO: Implementar toggle like
  }, []);
  const handleOpenComments = useCallback((postId: string) => {
    setSelectedPostId(postId);
  }, []);
  const handleShare = useCallback((_postId: string) => {
    // TODO: Implementar compartir
  }, []);
  const handlePostUpdated = useCallback((_updatedPost: FeedItem) => {
    // TODO: Actualizar post
  }, []);
  // Render functions
  const renderFeedItem: ListRenderItem<FeedItem> = useCallback(
    ({ item }) => (
      <UnifiedPostCard
        post={item}
        onToggleLike={handleToggleLike}
        onOpenComments={handleOpenComments}
        onShare={handleShare}
        onPostUpdated={handlePostUpdated}
        isAnonymousActive={isAnonymousActive}
        currentUserId={currentUserId}
        variant={variant}
        showActions={true}
        showEdit={true}
        showReport={true}
      />
    ),
    [
      handleToggleLike,
      handleOpenComments,
      handleShare,
      handlePostUpdated,
      isAnonymousActive,
      currentUserId,
      variant,
    ]
  );
  const keyExtractor = useCallback((item: FeedItem) => item.id, []);
  // Loading inicial
  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Cargando publicaciones..." />
      </View>
    );
  }
  // Error
  if (error && items.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {refetch && (
          <Text style={styles.retryText} onPress={refetch}>
            Reintentar
          </Text>
        )}
      </View>
    );
  }
  // Empty state
  if (!loading && items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No hay publicaciones</Text>
        <Text style={styles.emptyMessage}>
          Aún no hay publicaciones disponibles
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderFeedItem}
        keyExtractor={keyExtractor}
        refreshControl={
          enablePullToRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B35']}
              tintColor="#FF6B35"
            />
          ) : undefined
        }
        onEndReached={enableInfiniteScroll ? handleLoadMore : undefined}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner size="small" text="Cargando más..." />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
      {/* Modal de comentarios mejorado */}
      <CommentsModal
        visible={selectedPostId !== null}
        feedComments={[]} // TODO: Cargar comentarios del feed seleccionado
        onClose={() => setSelectedPostId(null)}
        onAddComment={async (_text: string) => {
          // TODO: Añadir comentario usando feedService
          // Implementation pending - remove console when connected to service
        }}
        onDeleteComment={async (_commentId: string) => {
          // TODO: Eliminar comentario usando feedService
          // Implementation pending - remove console when connected to service
        }}
        isAnonymousActive={isAnonymousActive}
        currentUserId={currentUserId}
        title="Comentarios del post"
        loading={false} // TODO: Estado de carga real
        error={undefined} // TODO: Manejo de errores real
      />
    </View>
  );
};
export default UnifiedFeedList;
