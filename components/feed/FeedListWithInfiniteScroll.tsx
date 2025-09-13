import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useEnhancedRefresh } from '../../hooks/useEnhancedRefresh';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { SkeletonList } from '../common/SkeletonLoader';
import { LoadMoreIndicator } from '../common/LoadMoreIndicator';
import stylesFn from './styles';
import type { FeedItem, FeedItemType, FeedListProps } from '@/types/feedTypes';
import CommentsModal from './CommentsModalSimple';
import MediaUploadButton from './MediaUploadButton';
import UserProfileLink from './UserProfileLink';
import SearchBarSimple from './SearchBarSimple';
// import SearchResults from './SearchResults';
import type { SearchFilters } from './SearchBarSimple';
import { NotificationButton } from '../notification/NotificationButton';

// Mock service para simular carga paginada
const mockLoadMoreItems = async (
  page: number,
  pageSize: number
): Promise<FeedItem[]> => {
  // Simular delay de red
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 1200)
  );

  // Simular error ocasional para probar retry
  if (Math.random() < 0.1) {
    throw new Error('Network error');
  }

  const items: FeedItem[] = Array.from({ length: pageSize }, (_, index) => {
    const itemId = (page - 1) * pageSize + index + 1;
    const author = getRandomAuthor();
    return {
      id: `feed-${itemId}`,
      type: 'post' as FeedItemType,
      userId: `user-${(itemId % 5) + 1}`,
      userName: author,
      title: `Publicación ${itemId}: ${getRandomTitle()}`,
      content: getRandomContent(),
      authorName: author,
      author: {
        id: `user-${(itemId % 5) + 1}`,
        name: author,
      },
      isPublic: Math.random() > 0.3,
      likesCount: Math.floor(Math.random() * 50),
      commentsCount: Math.floor(Math.random() * 20),
      sharesCount: Math.floor(Math.random() * 10),
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tags: getRandomTags(),
    };
  });

  // Simular que no hay más contenido después de página 10
  if (page >= 10) {
    return [];
  }

  return items;
};

const getRandomTitle = () => {
  const titles = [
    'Rutina de pecho increíble',
    'Tips para ganar masa muscular',
    'Mi transformación en 6 meses',
    'Ejercicios para principiantes',
    'Dieta para definición muscular',
    'Entrenamiento de piernas intenso',
    'Cómo mejorar tu técnica',
    'Suplementos que realmente funcionan',
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

const getRandomContent = () => {
  const contents = [
    'Hoy quiero compartir mi rutina favorita que me ha dado excelentes resultados...',
    'Después de mucha investigación, he encontrado que estos ejercicios son los más efectivos...',
    'Mi experiencia personal ha sido increíble con este programa de entrenamiento...',
    'Para todos los que están empezando, estos son mis consejos más importantes...',
    'La consistencia es clave en el fitness. Aquí les explico mi enfoque...',
  ];
  return contents[Math.floor(Math.random() * contents.length)];
};

const getRandomAuthor = () => {
  const authors = [
    'Carlos Fitness',
    'Ana Strong',
    'Pedro Muscle',
    'Sofia Gym',
    'Luis Iron',
  ];
  return authors[Math.floor(Math.random() * authors.length)];
};

const getRandomTags = () => {
  const allTags = [
    'fitness',
    'gym',
    'musculacion',
    'dieta',
    'cardio',
    'fuerza',
    'definicion',
  ];
  const numTags = Math.floor(Math.random() * 3) + 1;
  const selectedTags = allTags
    .sort(() => 0.5 - Math.random())
    .slice(0, numTags);
  return selectedTags.join(', ');
};

const FeedListWithInfiniteScroll: React.FC<FeedListProps> = React.memo(
  ({
    items: initialItems = [],
    loading: externalLoading,
    error: externalError,
    refetch,
  }) => {
    const themed = useThemedStyles(stylesFn);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [_searchFilters, _setSearchFilters] = useState<SearchFilters>({
      type: 'all',
      sortBy: 'relevance',
      timeRange: 'all',
    });
    const [showingSearchResults, setShowingSearchResults] = useState(false);

    // Infinite scroll hook
    const {
      items,
      loading,
      loadingMore,
      hasMore,
      error,
      refreshing,
      refresh,
      retry,
      onEndReached,
      canLoadMore,
    } = useInfiniteScroll({
      initialItems,
      pageSize: 8,
      loadMoreItems: mockLoadMoreItems,
      keyExtractor: (item) => item.id,
      threshold: 0.8,
      enablePreload: true,
      maxItems: 200,
    });

    // Enhanced refresh hook para mejorar UX
    const { isRefreshing: enhancedRefreshing, handleRefresh } =
      useEnhancedRefresh({
        onRefresh: refresh,
        minimumRefreshTime: 1000,
        enableHapticFeedback: true,
      });

    const renderFeedItem = useCallback(
      ({ item }: { item: FeedItem }) => (
        <View style={themed.card}>
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

          <View style={themed.statsContainer}>
            <View style={themed.statItem}>
              <Text style={themed.statLabel}>❤️ Likes:</Text>
              <Text style={themed.statValue}>{item.likesCount || 0}</Text>
            </View>

            <TouchableOpacity
              style={themed.statItem}
              onPress={() => setSelectedPostId(item.id)}
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
        </View>
      ),
      [themed]
    );

    const renderFooter = useCallback(() => {
      if (showingSearchResults) return null;

      return (
        <LoadMoreIndicator
          loading={loadingMore}
          hasMore={hasMore}
          error={error}
          onRetry={retry}
          onLoadMore={canLoadMore ? onEndReached : undefined}
        />
      );
    }, [
      loadingMore,
      hasMore,
      error,
      retry,
      canLoadMore,
      onEndReached,
      showingSearchResults,
    ]);

    const keyExtractor = useCallback((item: FeedItem) => item.id, []);

    const handleNotificationPress = (notification: unknown) => {
      if (notification) {
        // Implementar navegación
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

    // Estados de carga inicial
    if ((loading || externalLoading) && items.length === 0) {
      return (
        <View style={themed.container}>
          <View style={themed.feedHeader}>
            <SearchBarSimple
              onSearch={handleSearch}
              onClear={handleClearSearch}
            />
            <NotificationButton onNotificationPress={handleNotificationPress} />
          </View>
          <SkeletonList count={5} itemType="feed" />
        </View>
      );
    }

    if ((error || externalError) && items.length === 0) {
      return (
        <View style={themed.errorContainer}>
          <Text style={themed.errorText}>{error || externalError}</Text>
          <Text style={themed.retryText} onPress={retry || refetch}>
            Reintentar
          </Text>
        </View>
      );
    }

    if (items.length === 0 && !loading) {
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
        {/* Header */}
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
                refresh();
              }}
            />

            <FlatList
              data={items}
              renderItem={renderFeedItem}
              keyExtractor={keyExtractor}
              ListFooterComponent={renderFooter}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing || enhancedRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FF6B35"
                  colors={['#FF6B35', '#FF8A50']}
                  progressBackgroundColor="rgba(255, 255, 255, 0.9)"
                  title="Actualizando..."
                  titleColor="#FF6B35"
                />
              }
              onEndReached={onEndReached}
              onEndReachedThreshold={0.8}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={8}
              updateCellsBatchingPeriod={50}
              getItemLayout={(data, index) => ({
                length: 180,
                offset: 180 * index,
                index,
              })}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
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

FeedListWithInfiniteScroll.displayName = 'FeedListWithInfiniteScroll';

export default FeedListWithInfiniteScroll;
