import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function CommentList() {
  const loadComments = useCallback(async () => {
    try {
      // Placeholder for actual service call
      return [];
    } catch {
      return [];
    }
  }, []);

  const renderCommentItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.authorName || item.userName || 'Usuario'}
          </Text>
          <Text style={styles.dateText}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Ahora'}
          </Text>
        </View>

        <Text style={styles.commentText}>
          {item.content || item.text || item.comment || 'Comentario...'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.type === 'feedback'
                    ? '#4caf50'
                    : item.type === 'suggestion'
                      ? '#2196f3'
                      : item.type === 'complaint'
                        ? '#ff6b6b'
                        : Colors.light.text,
              },
            ]}
          >
            {item.type === 'feedback'
              ? '💬 Comentario'
              : item.type === 'suggestion'
                ? '💡 Sugerencia'
                : item.type === 'complaint'
                  ? '⚠️ Queja'
                  : item.type === 'question'
                    ? '❓ Pregunta'
                    : '💭 General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  item.status === 'approved'
                    ? '#4caf50'
                    : item.status === 'pending'
                      ? '#ffa726'
                      : item.status === 'rejected'
                        ? '#ff6b6b'
                        : Colors.light.text,
              },
            ]}
          >
            {item.status === 'approved'
              ? '✅ Aprobado'
              : item.status === 'pending'
                ? '⏳ Pendiente'
                : item.status === 'rejected'
                  ? '❌ Rechazado'
                  : '📝 Borrador'}
          </Text>
        </View>

        {item.rating && (
          <View style={styles.row}>
            <Text style={styles.label}>Valoración:</Text>
            <Text style={styles.value}>
              {'⭐'.repeat(Math.min(5, Math.max(0, item.rating)))} (
              {item.rating}/5)
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>
            {item.category || item.topic || 'General'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Likes:</Text>
          <Text style={styles.value}>
            👍 {item.likes || item.upvotes || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dislikes:</Text>
          <Text style={styles.value}>
            👎 {item.dislikes || item.downvotes || '0'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Respuestas:</Text>
          <Text style={styles.value}>
            💬 {item.replies || item.repliesCount || '0'} respuestas
          </Text>
        </View>

        {item.parentComment && (
          <View style={styles.row}>
            <Text style={styles.label}>Respuesta a:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {item.parentComment.authorName || 'Usuario'}: "
              {item.parentComment.content?.substring(0, 50) || 'Comentario'}..."
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Reportes:</Text>
          <Text
            style={[
              styles.value,
              {
                color: item.reportCount > 0 ? '#ff6b6b' : Colors.light.text,
              },
            ]}
          >
            {item.reportCount > 0
              ? `⚠️ ${item.reportCount} reportes`
              : '✅ Sin reportes'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Plataforma:</Text>
          <Text style={styles.value}>
            {item.platform === 'mobile'
              ? '📱 Móvil'
              : item.platform === 'web'
                ? '💻 Web'
                : item.platform === 'app'
                  ? '📲 App'
                  : '🌐 General'}
          </Text>
        </View>

        {item.moderatorNote && (
          <View style={styles.moderatorSection}>
            <Text style={styles.moderatorLabel}>
              🛡️ Nota del moderador:
            </Text>
            <Text style={styles.moderatorText}>{item.moderatorNote}</Text>
          </View>
        )}

        {item.tags && Array.isArray(item.tags) && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>Etiquetas:</Text>
            <View style={styles.tagsList}>
              {item.tags.slice(0, 4).map((tag: string, index: number) => (
                <Text key={index} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
              {item.tags.length > 4 && (
                <Text style={styles.moreTags}>
                  +{item.tags.length - 4} más...
                </Text>
              )}
            </View>
          </View>
        )}

        {item.lastEditedAt && (
          <View style={styles.editSection}>
            <Text style={styles.editLabel}>
              ✏️ Editado:{' '}
              {new Date(item.lastEditedAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) =>
      item.id || item.commentId || item.uuid || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Comentarios'
      loadFunction={loadComments}
      renderItem={renderCommentItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay comentarios'
      emptyMessage='No se encontraron comentarios'
      loadingMessage='Cargando comentarios...'
    />
  );
}

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
  dateText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  commentText: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
    lineHeight: 22,
    fontStyle: 'italic',
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
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
  moderatorSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    backgroundColor: '#e3f2fd',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  moderatorLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#1565c0',
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  moderatorText: {
    fontSize: FONT_SIZES.sm,
    color: '#1565c0',
    lineHeight: 18,
  },
  tagsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
  },
  tagsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  tag: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    backgroundColor: Colors.light.tabIconSelected + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  editSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '10',
  },
  editLabel: {
    fontSize: FONT_SIZES.xs,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
});

export default CommentList;
