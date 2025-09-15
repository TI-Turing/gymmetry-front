import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import { UnifiedPostCard } from '../common/UnifiedPostCard';
import { EnhancedCommentsModal } from '../social/EnhancedCommentsModal';
import { useAuth } from '@/contexts/AuthContext';

const FeedList: React.FC<FeedListProps> = React.memo(
  ({ items, loading, error, refetch }) => {
    const themed = useThemedStyles(stylesFn);
    const { user: authUser } = useAuth();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const handleToggleLike = useCallback((postId: string) => {
      // TODO: Implementar toggle like
      void postId;
    }, []);

    const handleOpenComments = useCallback((postId: string) => {
      setSelectedPostId(postId);
    }, []);

    const handleShare = useCallback((postId: string) => {
      // TODO: Implementar share
      void postId;
    }, []);

    const handlePostUpdated = useCallback((updatedPost: FeedItem) => {
      // TODO: Actualizar post en la lista
      void updatedPost;
    }, []);

    const renderFeedItem = useCallback(
      ({ item }: { item: FeedItem }) => (
        <UnifiedPostCard
          post={item}
          onToggleLike={handleToggleLike}
          onOpenComments={handleOpenComments}
          onShare={handleShare}
          onPostUpdated={handlePostUpdated}
          currentUserId={authUser?.id}
          showActions={true}
          showEdit={true}
          showReport={true}
          variant="default"
        />
      ),
      [
        handleToggleLike,
        handleOpenComments,
        handleShare,
        handlePostUpdated,
        authUser?.id,
      ]
    );

    const keyExtractor = useCallback((item: FeedItem) => item.id, []);

    if (loading) {
      return (
        <View style={themed.container}>
          <Text style={themed.loadingText}>Cargando...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={themed.container}>
          <Text style={themed.errorText}>Error: {error}</Text>
          {refetch && (
            <Text style={themed.retryButton} onPress={refetch}>
              Reintentar
            </Text>
          )}
        </View>
      );
    }

    if (!items || items.length === 0) {
      return (
        <View style={themed.container}>
          <Text style={themed.emptyText}>
            No hay publicaciones disponibles.{'\n'}
            Toca el botón + para crear tu primera publicación.
          </Text>
        </View>
      );
    }

    return (
      <View style={themed.container}>
        <FlatList
          data={items}
          renderItem={renderFeedItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={themed.listContainer}
          ItemSeparatorComponent={() => <View style={themed.separator} />}
        />

        {selectedPostId && (
          <EnhancedCommentsModal
            feedId={selectedPostId}
            visible={selectedPostId !== null}
            onClose={() => setSelectedPostId(null)}
          />
        )}
      </View>
    );
  }
);

FeedList.displayName = 'FeedList';

export default FeedList;
