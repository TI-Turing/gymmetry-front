import React, { useCallback } from 'react';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { feedService } from '@/services';
import type { FeedResponseDto } from '@/dto/Feed/Response/FeedResponseDto';
import { styles } from './styles';

type FeedItem = {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  authorName?: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  tags?: string;
};

const FeedList = React.memo(() => {
  const loadFeeds = useCallback(async (): Promise<FeedItem[]> => {
    const response = await feedService.getAllFeeds();
    const data = (
      response.Success ? response.Data || [] : []
    ) as FeedResponseDto[];
    const items: FeedItem[] = data.map((f) => ({
      id: f.Id,
      title: f.Title,
      content: f.Description || '',
      isPublic: true,
      authorName: '',
      createdAt: f.CreatedAt,
    }));
    return items;
  }, []);

  const renderFeedItem = useCallback(
    ({ item }: { item: FeedItem }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || 'Publicación sin título'}
          </Text>
          <Text style={styles.statusText}>
            {item.isPublic ? 'Público' : 'Privado'}
          </Text>
        </View>

        <Text style={styles.content}>
          {item.content || 'Sin contenido disponible'}
        </Text>

        <View style={styles.authorSection}>
          <Text style={styles.author}>
            Por: {item.authorName || 'Usuario anónimo'}
          </Text>
          <Text style={styles.date}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Sin fecha'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>❤️ Likes:</Text>
            <Text style={styles.statValue}>{item.likesCount || 0}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>💬 Comentarios:</Text>
            <Text style={styles.statValue}>{item.commentsCount || 0}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>🔄 Compartidas:</Text>
            <Text style={styles.statValue}>{item.sharesCount || 0}</Text>
          </View>
        </View>

        {item.tags && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tags}>Tags: {item.tags}</Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  return (
    <EntityList<FeedItem>
      title="Feed de Publicaciones"
      loadFunction={loadFeeds}
      renderItem={renderFeedItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay publicaciones"
      emptyMessage="No se encontraron publicaciones en el feed"
      loadingMessage="Cargando feed..."
    />
  );
});

FeedList.displayName = 'FeedList';

export default FeedList;
