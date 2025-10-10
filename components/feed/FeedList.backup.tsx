import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import { UnifiedPostCard } from '../common/UnifiedPostCard';
import { EnhancedCommentsModal } from '../social/EnhancedCommentsModal';
import MediaUploadButton from './MediaUploadButton';
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
          onShare={handleShare}
          onPostUpdated={handlePostUpdated}
          currentUserId={authUser?.id}
          showActions={true}
          showEdit={true}
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
        <View style={themed.loadingContainer}>
          <Text style={themed.loadingText}>Cargando feed...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={themed.errorContainer}>
          <Text style={themed.errorText}>{error}</Text>
          <Text style={themed.retryText} onPress={refetch}>
            Reintentar
          </Text>
        </View>
      );
    }

    if (!items || items.length === 0) {
      return (
        <View style={themed.emptyContainer}>
          <Text style={themed.emptyTitle}>No hay publicaciones</Text>
          <Text style={themed.emptyMessage}>
            Sé el primero en compartir algo interesante
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={themed.container}>
          <View style={themed.header}>
            <Text style={themed.headerTitle}>Feed</Text>
            <MediaUploadButton
              onMediaUploaded={(files) => {
                // TODO: Integrar con crear post después de subir media
                void files;
                // Refrescar el feed para mostrar nuevos posts
                refetch?.();
              }}
              feedId={authUser?.id} // Usar ID de usuario para asociar media
              maxFiles={3}
            />
          </View>

          <FlatList
            data={items}
            renderItem={renderFeedItem}
            keyExtractor={keyExtractor}
            style={themed.list}
            contentContainerStyle={themed.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <EnhancedCommentsModal
          visible={selectedPostId !== null}
          feedId={selectedPostId || ''}
          onClose={() => setSelectedPostId(null)}
        />
      </>
    );
  }
);

FeedList.displayName = 'FeedList';

export default FeedList;
