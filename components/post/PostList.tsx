import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

type PostItem = Record<string, unknown> & {
  id?: string;
  postId?: string;
  title?: string;
  postTitle?: string;
  isActive?: boolean;
  content?: string;
  description?: string;
  author?: string;
  date?: string;
  likes?: number;
  comments?: number;
};

const PostList = React.memo(() => {
  const servicePlaceholder = useCallback(
    () => Promise.resolve([] as PostItem[]),
    []
  );
  const loadPosts = useCallback(async (): Promise<PostItem[]> => {
    try {
      // Placeholder for actual service call
      const result = await servicePlaceholder();
      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  const renderPostItem = useCallback(
    ({ item }: { item: PostItem }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.title || item.postTitle || 'Post'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.content || item.description || 'Contenido del post'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Autor:</Text>
          <Text style={styles.value}>{item.author || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{item.date || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Likes:</Text>
          <Text style={styles.value}>{item.likes || 0}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Comentarios:</Text>
          <Text style={styles.value}>{item.comments || 0}</Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: PostItem) => {
    return (
      (item.id as string) || (item.postId as string) || String(Math.random())
    );
  }, []);

  return (
    <EntityList
      title="Posts"
      loadFunction={loadPosts}
      renderItem={renderPostItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay posts"
      emptyMessage="No se encontraron posts"
      loadingMessage="Cargando posts..."
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
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 80,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

PostList.displayName = 'PostList';

export default PostList;
