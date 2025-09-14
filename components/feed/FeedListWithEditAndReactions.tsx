import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useEnhancedRefresh } from '../../hooks/useEnhancedRefresh';
import { ReactionsBar, useReactions } from '../common/ReactionsBar';
import { ReactionAnimation } from '../common/ReactionAnimation';
import { EditPostButton } from '../common/EditPostButton';
import { ReportButton } from '../common/ReportButton';
import { BlockButton } from '../social/BlockButton';
import { useBlockedContentFilter } from '../../hooks/useBlockedContentFilter';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import CommentsModal from './CommentsModalSimple';
import MediaUploadButton from './MediaUploadButton';
import UserProfileLink from './UserProfileLink';
import SearchBarSimple from './SearchBarSimple';
// import SearchResults from './SearchResults';
import type { SearchFilters } from './SearchBarSimple';
import { NotificationButton } from '../notification/NotificationButton';

// Componente mejorado para cada item del feed con reacciones y edición
const FeedItemWithReactions: React.FC<{
  item: FeedItem;
  onCommentPress: (id: string) => void;
  onPostUpdated?: (updatedPost: FeedItem) => void;
  onRefreshNeeded?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themed: any;
}> = React.memo(
  ({ item, onCommentPress, onPostUpdated, onRefreshNeeded, themed }) => {
    const [animatingReaction, setAnimatingReaction] = useState<string | null>(
      null
    );

    // Hook para manejar reacciones de este post específico
    const { reactions, addReaction, totalReactions } = useReactions({
      postId: item.id,
      initialReactions: [
        {
          emoji: '❤️',
          name: 'love',
          count: item.likesCount || 0,
          userReacted: false,
        },
        {
          emoji: '👍',
          name: 'like',
          count: Math.floor((item.likesCount || 0) * 0.3),
          userReacted: false,
        },
        {
          emoji: '💪',
          name: 'strong',
          count: Math.floor((item.likesCount || 0) * 0.2),
          userReacted: false,
        },
        {
          emoji: '🔥',
          name: 'fire',
          count: Math.floor((item.likesCount || 0) * 0.15),
          userReacted: false,
        },
      ],
    });

    const handleReactionPress = useCallback(
      (emoji: string) => {
        setAnimatingReaction(emoji);
        addReaction(emoji);
        // La animación se limpiará automáticamente
      },
      [addReaction]
    );

    const handleAddReaction = useCallback(
      (emoji: string) => {
        setAnimatingReaction(emoji);
        addReaction(emoji);
      },
      [addReaction]
    );

    return (
      <View style={themed.card}>
        {/* Animación de reacción */}
        <ReactionAnimation
          emoji={animatingReaction || ''}
          visible={!!animatingReaction}
          onAnimationComplete={() => setAnimatingReaction(null)}
        />

        <View style={themed.header}>
          <Text style={themed.title}>
            {item.title || 'Publicación sin título'}
          </Text>
          <Text style={themed.statusText}>
            {item.isPublic ? 'Público' : 'Privado'}
          </Text>
        </View>

        <Text style={themed.content}>
          {item.content || 'Sin contenido disponible'}
        </Text>

        <View style={themed.authorSection}>
          <Text style={themed.author}>Por: </Text>
          <UserProfileLink
            userId={item.author?.id || ''}
            userName={item.authorName || item.author?.name || 'Usuario'}
            isAnonymous={!item.author?.id}
          />
          <Text style={themed.date}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Sin fecha'}
          </Text>
        </View>

        {/* Barra de reacciones */}
        <ReactionsBar
          reactions={reactions}
          onReactionPress={handleReactionPress}
          onAddReaction={handleAddReaction}
          totalReactions={totalReactions}
          maxVisible={5}
          showAddButton={true}
        />

        <View style={themed.statsContainer}>
          <TouchableOpacity
            style={themed.statItem}
            onPress={() => onCommentPress(item.id)}
          >
            <Text style={themed.statLabel}>💬 Comentarios:</Text>
            <Text style={themed.statValue}>{item.commentsCount || 0}</Text>
          </TouchableOpacity>

          <View style={themed.statItem}>
            <Text style={themed.statLabel}>🔄 Compartidas:</Text>
            <Text style={themed.statValue}>{item.sharesCount || 0}</Text>
          </View>
        </View>

        {item.tags && (
          <View style={themed.tagsContainer}>
            <Text style={themed.tags}>Tags: {item.tags}</Text>
          </View>
        )}

        {/* Acciones del post */}
        <View style={themed.actionsContainer}>
          <EditPostButton
            post={item}
            onPostUpdated={onPostUpdated}
            canEdit={true} // TODO: Verificar permisos de edición
          />

          <BlockButton
            userId={item.author?.id || ''}
            userName={item.authorName || item.author?.name || 'Usuario'}
            style="text"
            size="medium"
            onBlockStatusChanged={async (isBlocked) => {
              if (isBlocked && onRefreshNeeded) {
                // Refrescar la lista para filtrar posts del usuario bloqueado
                onRefreshNeeded();
              }
            }}
          />

          <ReportButton
            contentId={item.id}
            contentType="post"
            onReportSubmitted={() => {
              // TODO: Manejar reporte enviado (ej: ocultar post, mostrar mensaje)
            }}
            size="medium"
            showText={true}
          />
        </View>
      </View>
    );
  }
);

FeedItemWithReactions.displayName = 'FeedItemWithReactions';

const FeedListWithEditAndReactions: React.FC<FeedListProps> = React.memo(
  ({ items, loading, error, refetch }) => {
    const themed = useThemedStyles(stylesFn);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [_searchFilters, _setSearchFilters] = useState<SearchFilters>({
      type: 'all',
      sortBy: 'relevance',
      timeRange: 'all',
    });
    const [showingSearchResults, setShowingSearchResults] = useState(false);
    const [feedItems, setFeedItems] = useState<FeedItem[]>(items || []);

    // Hook para filtrar contenido de usuarios bloqueados
    const { filterBlockedPosts } = useBlockedContentFilter();

    // Enhanced refresh hook
    const { isRefreshing, handleRefresh } = useEnhancedRefresh({
      onRefresh: async () => {
        await refetch?.();
      },
      minimumRefreshTime: 1000,
      enableHapticFeedback: true,
      refreshThreshold: 80,
    });

    // Actualizar feedItems cuando cambian los items, filtrando contenido bloqueado
    React.useEffect(() => {
      const loadFilteredItems = async () => {
        if (items && items.length > 0) {
          const filteredItems = await filterBlockedPosts(items);
          setFeedItems(filteredItems);
        } else {
          setFeedItems([]);
        }
      };

      loadFilteredItems();
    }, [items, filterBlockedPosts]);

    const handlePostUpdated = useCallback((updatedPost: FeedItem) => {
      setFeedItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedPost.id ? updatedPost : item
        )
      );
    }, []);

    const handleRefreshNeeded = useCallback(async () => {
      await refetch?.();
    }, [refetch]);

    const renderFeedItem = useCallback(
      ({ item }: { item: FeedItem }) => (
        <FeedItemWithReactions
          item={item}
          onCommentPress={setSelectedPostId}
          onPostUpdated={handlePostUpdated}
          onRefreshNeeded={handleRefreshNeeded}
          themed={themed}
        />
      ),
      [themed, handlePostUpdated, handleRefreshNeeded]
    );

    const keyExtractor = useCallback((item: FeedItem) => item.id, []);

    const handleNotificationPress = (notification: unknown) => {
      if (notification) {
        // Implementar navegación basada en el tipo de notificación
      }
    };

    const handleSearch = (query: string, filters: SearchFilters) => {
      setSearchQuery(query);
      _setSearchFilters(filters);
      setShowingSearchResults(true);
    };

    const handleClearSearch = () => {
      setSearchQuery('');
      setShowingSearchResults(false);
    };

    if (loading && !isRefreshing) {
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

    if (!feedItems || feedItems.length === 0) {
      return (
        <View style={themed.emptyContainer}>
          <Text style={themed.emptyTitle}>No hay publicaciones</Text>
          <Text style={themed.emptyMessage}>
            No se encontraron publicaciones en el feed
          </Text>
        </View>
      );
    }

    return (
      <View style={themed.container}>
        {/* Header con buscador y notificaciones */}
        <View style={themed.feedHeader}>
          <SearchBarSimple
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
          <NotificationButton onNotificationPress={handleNotificationPress} />
        </View>

        {showingSearchResults ? (
          <View>
            <Text>Resultados de búsqueda para: {searchQuery}</Text>
          </View>
        ) : (
          <>
            <MediaUploadButton
              onMediaUploaded={(_files) => {
                refetch?.();
              }}
            />

            <FlatList
              data={feedItems}
              renderItem={renderFeedItem}
              keyExtractor={keyExtractor}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FF6B35"
                  colors={['#FF6B35', '#FF8A50']}
                  progressBackgroundColor="rgba(255, 255, 255, 0.9)"
                  title="Actualizando..."
                  titleColor="#FF6B35"
                />
              }
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={5}
              getItemLayout={(data, index) => ({
                length: 260, // Aumentamos altura para incluir reacciones y edición
                offset: 260 * index,
                index,
              })}
            />
          </>
        )}

        <CommentsModal
          visible={selectedPostId !== null}
          feedId={selectedPostId || ''}
          onClose={() => setSelectedPostId(null)}
        />
      </View>
    );
  }
);

FeedListWithEditAndReactions.displayName = 'FeedListWithEditAndReactions';

export default FeedListWithEditAndReactions;
