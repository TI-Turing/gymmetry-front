import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

const CommentList = React.memo(() => {
  const servicePlaceholder = useCallback(() => Promise.resolve([]), []);
  const loadComments = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (_error) {
      return [];
    }
  }, [servicePlaceholder]);

  CommentList.displayName = 'CommentList';

  const isRecord = (v: unknown): v is Record<string, unknown> =>
    !!v && typeof v === 'object';

  const renderCommentItem = useCallback(({ item }: { item: unknown }) => {
    const obj = isRecord(item) ? item : ({} as Record<string, unknown>);

    const authorName =
      (typeof obj.authorName === 'string' && obj.authorName) ||
      (typeof obj.userName === 'string' && obj.userName) ||
      'Usuario';

    const createdAtVal = obj.createdAt as unknown;
    const createdAt = createdAtVal ? new Date(String(createdAtVal)) : null;

    const content =
      (typeof obj.content === 'string' && obj.content) ||
      (typeof obj.text === 'string' && obj.text) ||
      (typeof obj.comment === 'string' && obj.comment) ||
      'Comentario...';

    const type = typeof obj.type === 'string' ? obj.type : null;
    const typeColor =
      type === 'feedback'
        ? '#4caf50'
        : type === 'suggestion'
          ? '#2196f3'
          : type === 'complaint'
            ? '#ff6b6b'
            : Colors.light.text;
    const typeLabel =
      type === 'feedback'
        ? '💬 Comentario'
        : type === 'suggestion'
          ? '💡 Sugerencia'
          : type === 'complaint'
            ? '⚠️ Queja'
            : type === 'question'
              ? '❓ Pregunta'
              : '💭 General';

    const status = typeof obj.status === 'string' ? obj.status : null;
    const statusColor =
      status === 'approved'
        ? '#4caf50'
        : status === 'pending'
          ? '#ffa726'
          : status === 'rejected'
            ? '#ff6b6b'
            : Colors.light.text;
    const statusLabel =
      status === 'approved'
        ? '✅ Aprobado'
        : status === 'pending'
          ? '⏳ Pendiente'
          : status === 'rejected'
            ? '❌ Rechazado'
            : '📝 Borrador';

    const ratingRaw = (obj as any).rating;
    const rating = typeof ratingRaw === 'number' ? ratingRaw : null;

    const category =
      (typeof obj.category === 'string' && obj.category) ||
      (typeof obj.topic === 'string' && obj.topic) ||
      'General';

    const likes = (obj as any).likes ?? (obj as any).upvotes ?? 0;
    const dislikes = (obj as any).dislikes ?? (obj as any).downvotes ?? 0;
    const replies = (obj as any).replies ?? (obj as any).repliesCount ?? 0;

    const parentC = isRecord(obj.parentComment) ? obj.parentComment : null;
    const parentAuthor =
      (parentC && typeof parentC.authorName === 'string'
        ? parentC.authorName
        : 'Usuario') || 'Usuario';
    const parentContent =
      parentC && typeof parentC.content === 'string'
        ? parentC.content.substring(0, 50)
        : 'Comentario';

    const reportCountRaw = (obj as any).reportCount;
    const reportCount = typeof reportCountRaw === 'number' ? reportCountRaw : 0;

    const platform = typeof obj.platform === 'string' ? obj.platform : null;
    const platformLabel =
      platform === 'mobile'
        ? '� Móvil'
        : platform === 'web'
          ? '💻 Web'
          : platform === 'app'
            ? '📲 App'
            : '🌐 General';

    const moderatorNote =
      typeof obj.moderatorNote === 'string' ? obj.moderatorNote : null;

    const tagsArr = Array.isArray((obj as any).tags)
      ? ((obj as any).tags as unknown[]).filter((t) => typeof t === 'string')
      : [];

    const lastEditedAtVal = obj.lastEditedAt as unknown;
    const lastEditedAt = lastEditedAtVal
      ? new Date(lastEditedAtVal as any)
      : null;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{authorName}</Text>
          <Text style={styles.dateText}>
            {createdAt
              ? createdAt.toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Ahora'}
          </Text>
        </View>

        <Text style={styles.commentText}>{content}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={[styles.value, { color: typeColor }]}>{typeLabel}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={[styles.value, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>

        {typeof rating === 'number' && (
          <View style={styles.row}>
            <Text style={styles.label}>Valoración:</Text>
            <Text style={styles.value}>
              {'⭐'.repeat(Math.min(5, Math.max(0, rating)))} ({rating}/5)
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Categoría:</Text>
          <Text style={styles.value}>{category}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Likes:</Text>
          <Text style={styles.value}>👍 {String(likes)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Dislikes:</Text>
          <Text style={styles.value}>👎 {String(dislikes)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Respuestas:</Text>
          <Text style={styles.value}>💬 {String(replies)} respuestas</Text>
        </View>

        {parentC && (
          <View style={styles.row}>
            <Text style={styles.label}>Respuesta a:</Text>
            <Text style={styles.value} numberOfLines={1}>
              {parentAuthor}: "{parentContent}..."
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Reportes:</Text>
          <Text
            style={[
              styles.value,
              { color: reportCount > 0 ? '#ff6b6b' : Colors.light.text },
            ]}
          >
            {reportCount > 0 ? `⚠️ ${reportCount} reportes` : '✅ Sin reportes'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Plataforma:</Text>
          <Text style={styles.value}>{platformLabel}</Text>
        </View>

        {!!moderatorNote && (
          <View style={styles.moderatorSection}>
            <Text style={styles.moderatorLabel}>🛡️ Nota del moderador:</Text>
            <Text style={styles.moderatorText}>{moderatorNote}</Text>
          </View>
        )}

        {tagsArr.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>Etiquetas:</Text>
            <View style={styles.tagsList}>
              {tagsArr.slice(0, 4).map((tag: unknown, index: number) => (
                <Text key={index} style={styles.tag}>
                  #{String(tag)}
                </Text>
              ))}
              {tagsArr.length > 4 && (
                <Text style={styles.moreTags}>
                  +{tagsArr.length - 4} más...
                </Text>
              )}
            </View>
          </View>
        )}

        {lastEditedAt && (
          <View style={styles.editSection}>
            <Text style={styles.editLabel}>
              ✏️ Editado:{' '}
              {lastEditedAt.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    if (isRecord(item)) {
      const v =
        (item.id as any) ??
        (item.commentId as any) ??
        (item.uuid as any) ??
        (item.Id as any) ??
        (item.CommentId as any) ??
        (item.Uuid as any);
      if (v != null) return String(v);
    }
    return String(Math.random());
  }, []);

  return (
    <EntityList
      title="Comentarios"
      loadFunction={loadComments}
      renderItem={renderCommentItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay comentarios"
      emptyMessage="No se encontraron comentarios"
      loadingMessage="Cargando comentarios..."
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

CommentList.displayName = 'CommentList';

export default CommentList;
