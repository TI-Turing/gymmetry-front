import React, { useCallback, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { useEnhancedRefresh } from '../../hooks/useEnhancedRefresh';
import stylesFn from './styles';
import type { FeedItem, FeedListProps } from '@/types/feedTypes';
import CommentsModal from './CommentsModalSimple';
import MediaUploadButton from './MediaUploadButton';
import UserProfileLink from './UserProfileLink';
import SearchBarSimple from './SearchBarSimple';
// import SearchResults from './SearchResults';
import type { SearchFilters } from './SearchBarSimple';
import { NotificationButton } from '../notification/NotificationButton';

const FeedListEnhanced: React.FC<FeedListProps> = React.memo(
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

    // Enhanced refresh hook
    const { isRefreshing, handleRefresh } = useEnhancedRefresh({
      onRefresh: async () => {
        await refetch?.();
      },
      minimumRefreshTime: 1000,
      enableHapticFeedback: true,
      refreshThreshold: 80,
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

    if (!items || items.length === 0) {
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
              data={items}
              renderItem={renderFeedItem}
              keyExtractor={keyExtractor}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FF6B35"
                  colors={['#FF6B35', '#FF8A50', '#FFA365']}
                  progressBackgroundColor="rgba(255, 255, 255, 0.9)"
                  title="Actualizando feed..."
                  titleColor="#FF6B35"
                  size={50}
                />
              }
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
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
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
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

FeedListEnhanced.displayName = 'FeedListEnhanced';

export default FeedListEnhanced;
