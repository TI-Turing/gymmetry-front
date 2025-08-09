import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { feedService } from '@/services';

const FeedList = React.memo(() => {
  const loadFeeds = useCallback(async () => {
    const response = await feedService.getAllFeeds();
    return response || [];
  }, []);

  const renderFeedItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || item.postTitle || 'Publicación sin título'}
          </Text>
          <Text style={styles.statusText}>
            {item.isPublic ? 'Público' : 'Privado'}
          </Text>
        </View>

        <Text style={styles.content}>
          {item.content || item.description || 'Sin contenido disponible'}
        </Text>

        <View style={styles.authorSection}>
          <Text style={styles.author}>
            Por: {item.authorName || item.userName || 'Usuario anónimo'}
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

  const keyExtractor = useCallback(
    (item: any) => item.id || item.feedId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Feed de Publicaciones'
      loadFunction={loadFeeds}
      renderItem={renderFeedItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay publicaciones'
      emptyMessage='No se encontraron publicaciones en el feed'
      loadingMessage='Cargando feed...'
    />
  );
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background
  },
  content: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
    lineHeight: 20
  },
  authorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20'
  },
  author: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontWeight: '600'
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.tabIconDefault + '20'
  },
  statItem: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: Colors.light.tabIconDefault,
    marginBottom: 2
  },
  statValue: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    fontWeight: '600'
  },
  tagsContainer: {
    marginTop: SPACING.sm
  },
  tags: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic'

}});

FeedList.displayName = 'FeedList';

export default FeedList;