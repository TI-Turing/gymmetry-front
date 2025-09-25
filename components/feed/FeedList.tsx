import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import { UnifiedPostCard } from '../common/UnifiedPostCard';
import { EnhancedCommentsModal } from '../social/EnhancedCommentsModal';
import { useAuth } from '@/contexts/AuthContext';

const FeedList: React.FC<FeedListProps> = React.memo(
  ({ items, loading, error, refetch }) => {
    const themed = useThemedStyles(stylesFn);
    const { user: authUser } = useAuth();
    const colorScheme = useColorScheme();
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    // Colores para RefreshControl
    const refreshTintColor =
      colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
    const refreshColor =
      colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;

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
        <View style={themed.emptyStateContainer}>
          <View style={themed.emptyIcon}>
            <Text style={themed.emptyIconText}>📡</Text>
          </View>
          <Text style={themed.emptyTitle}>
            ¡Tu feed está esperando contenido!
          </Text>
          <Text style={themed.emptyMessage}>
            Aún no hay publicaciones{'\n'}disponibles
          </Text>
          <Text style={themed.emptySubtext}>
            Sé el primero en compartir algo increíble
          </Text>

          <View style={themed.emptyActions}>
            <TouchableOpacity
              style={themed.uploadButton}
              onPress={() => {
                // TODO: Abrir modal de subir media o crear post
              }}
            >
              <Text style={themed.uploadButtonIcon}>📷</Text>
              <Text style={themed.uploadButtonText}>Subir Media</Text>
            </TouchableOpacity>

            <TouchableOpacity style={themed.refreshButton} onPress={refetch}>
              <Text style={themed.refreshButtonIcon}>🔄</Text>
              <Text style={themed.refreshButtonText}>Actualizar feed</Text>
            </TouchableOpacity>
          </View>
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
          refreshControl={
            refetch ? (
              <RefreshControl
                refreshing={!!loading}
                onRefresh={refetch}
                tintColor={refreshTintColor}
                colors={[refreshColor]}
              />
            ) : undefined
          }
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
