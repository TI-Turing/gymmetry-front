import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { FlatList } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import stylesFn from './styles';

export type FeedItem = {
  id: string;
  title?: string;
  content?: string;
  isPublic?: boolean;
  authorName?: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  tags?: string;
};

interface FeedListProps {
  items: FeedItem[];
  loading: boolean;
  error?: string;
  refetch: () => void;
}

const FeedList: React.FC<FeedListProps> = React.memo(
  ({ items, loading, error, refetch }) => {
    const themed = useThemedStyles(stylesFn);
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
            <Text style={themed.author}>
              Por: {item.authorName || 'Usuario anónimo'}
            </Text>
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

            <View style={themed.statItem}>
              <Text style={themed.statLabel}>💬 Comentarios:</Text>
              <Text style={themed.statValue}>{item.commentsCount || 0}</Text>
            </View>

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
            No se encontraron publicaciones en el feed
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={items}
        renderItem={renderFeedItem}
        keyExtractor={keyExtractor}
        refreshing={loading}
        onRefresh={refetch}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    );
  }
);

FeedList.displayName = 'FeedList';

export default FeedList;
