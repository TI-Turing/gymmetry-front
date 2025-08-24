import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const LikeList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadLikes = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  type LikeItem = {
    id?: string;
    likeId?: string;
    userName?: string;
    isActive?: boolean;
    contentType?: 'post' | 'comment' | 'routine' | 'exercise' | string;
    contentTitle?: string;
    postTitle?: string;
    contentAuthor?: string;
    createdAt?: string | number | Date;
    platform?: 'mobile' | 'web' | string;
    totalLikes?: number | string;
    contentLikes?: number | string;
    gymName?: string;
    reaction?: 'love' | 'laugh' | 'wow' | 'sad' | 'angry' | 'like' | string;
  };
  const renderLikeItem = useCallback(({ item }: { item: unknown }) => {
    const it = (item || {}) as LikeItem;
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            ❤️ Like de: {it.userName || 'Usuario'}
          </Text>
          <Text style={styles.statusText}>
            {it.isActive ? 'Activo' : 'Eliminado'}
          </Text>
        </View>

        <Text style={styles.description}>
          {it.contentType === 'post'
            ? 'Me gusta en publicación'
            : it.contentType === 'comment'
              ? 'Me gusta en comentario'
              : it.contentType === 'routine'
                ? 'Me gusta en rutina'
                : 'Me gusta'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.value}>{it.userName || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contenido:</Text>
          <Text style={styles.value}>
            {it.contentType === 'post'
              ? '📝 Publicación'
              : it.contentType === 'comment'
                ? '💬 Comentario'
                : it.contentType === 'routine'
                  ? '🏋️ Rutina'
                  : it.contentType === 'exercise'
                    ? '💪 Ejercicio'
                    : 'Otro'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Título contenido:</Text>
          <Text style={styles.value} numberOfLines={2}>
            {it.contentTitle || it.postTitle || 'Sin título'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Autor contenido:</Text>
          <Text style={styles.value}>{it.contentAuthor || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha like:</Text>
          <Text style={styles.value}>
            {it.createdAt ? new Date(it.createdAt).toLocaleString() : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Desde app:</Text>
          <Text style={styles.value}>
            {it.platform === 'mobile'
              ? '📱 Móvil'
              : it.platform === 'web'
                ? '💻 Web'
                : 'Desconocido'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total likes:</Text>
          <Text style={styles.value}>
            {it.totalLikes || it.contentLikes || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{it.gymName || 'General'}</Text>
        </View>

        {it.reaction && it.reaction !== 'like' && (
          <View style={styles.reactionSection}>
            <Text style={styles.reactionLabel}>Reacción específica:</Text>
            <Text style={styles.reaction}>
              {it.reaction === 'love'
                ? '😍 Me encanta'
                : it.reaction === 'laugh'
                  ? '😂 Me divierte'
                  : it.reaction === 'wow'
                    ? '😮 Me asombra'
                    : it.reaction === 'sad'
                      ? '😢 Me entristece'
                      : it.reaction === 'angry'
                        ? '😠 Me molesta'
                        : it.reaction}
            </Text>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const it = (item || {}) as LikeItem;
    return it.id || it.likeId || String(Math.random());
  }, []);

  return (
    <EntityList
      title="Me Gusta"
      loadFunction={loadLikes}
      renderItem={renderLikeItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay likes"
      emptyMessage="No se encontraron me gusta"
      loadingMessage="Cargando me gusta..."
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
    minWidth: 120,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  reactionSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  reactionLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  reaction: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.text,
    fontWeight: '600',
  },
});

LikeList.displayName = 'LikeList';

export default LikeList;
