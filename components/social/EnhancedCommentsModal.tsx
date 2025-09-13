import React, { useState, useCallback, useMemo } from 'react';
import {
  Modal,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { useFeedComments, useFeedInteractions } from '@/hooks/useFeed';
import { LoadingSpinner } from '../common/LoadingSpinner';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import type { FeedComment } from '@/models/FeedComment';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export interface EnhancedCommentsModalProps {
  visible: boolean;
  feedId: string;
  onClose: () => void;
  isAnonymousActive?: boolean;
  currentUserId?: string;
  maxHeight?: number;
}

interface CommentItemProps {
  comment: FeedComment;
  currentUserId?: string;
  isAnonymousActive?: boolean;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onToggleReaction?: (commentId: string, reaction: string) => void;
}

// Estilos inline hasta tener el archivo completo
const createEnhancedCommentsModalStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];

  const colors = {
    background: palette.background,
    text: palette.text,
    textMuted: palette.textMuted || (isDark ? '#B0B0B0' : '#6B7280'),
    cardBg: isDark ? '#1F1F1F' : '#FFFFFF',
    cardBg2: isDark ? '#1A1A1A' : '#F7F7F7',
    border: isDark ? '#333333' : '#DDDDDD',
    inputBg: isDark ? '#2A2A2A' : '#F2F2F2',
    tint: palette.tint,
    danger: '#FF6B35',
    overlay: 'rgba(0,0,0,0.6)',
  };

  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: SPACING.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: SPACING.sm,
    },
    commentsContainer: {
      flex: 1,
      maxHeight: 400,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    errorText: {
      color: colors.danger,
      fontSize: FONT_SIZES.md,
      textAlign: 'center',
      marginBottom: SPACING.md,
    },
    retryButton: {
      backgroundColor: colors.tint,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
      paddingHorizontal: SPACING.lg,
    },
    emptyTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: colors.text,
      marginTop: SPACING.md,
      marginBottom: SPACING.sm,
    },
    emptyMessage: {
      fontSize: FONT_SIZES.md,
      color: colors.textMuted,
      textAlign: 'center',
    },
    commentItem: {
      backgroundColor: colors.cardBg,
      marginHorizontal: SPACING.md,
      marginVertical: SPACING.xs,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: SPACING.sm,
    },
    commentMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    commentAuthor: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      color: colors.text,
      marginRight: SPACING.sm,
    },
    commentTime: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      marginRight: SPACING.sm,
    },
    editedLabel: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    actionsButton: {
      padding: SPACING.xs,
    },
    commentContent: {
      fontSize: FONT_SIZES.md,
      color: colors.text,
      lineHeight: 20,
      marginBottom: SPACING.sm,
    },
    actionsMenu: {
      backgroundColor: colors.cardBg2,
      borderRadius: BORDER_RADIUS.sm,
      marginTop: SPACING.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
    },
    actionText: {
      fontSize: FONT_SIZES.sm,
      color: colors.text,
      marginLeft: SPACING.sm,
    },
    editContainer: {
      marginTop: SPACING.sm,
    },
    editInput: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    editActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: SPACING.sm,
    },
    cancelButton: {
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.sm,
    },
    cancelButtonText: {
      color: colors.textMuted,
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
    },
    saveButton: {
      backgroundColor: colors.tint,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.sm,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
    },
    commentFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.sm,
    },
    reactionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.sm,
      marginRight: SPACING.md,
    },
    reactionIcon: {
      fontSize: 14,
      marginRight: SPACING.xs,
    },
    reactionCount: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
    },
    replyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
    },
    replyButtonText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      marginLeft: SPACING.xs,
    },
    replyContainer: {
      marginTop: SPACING.sm,
      paddingLeft: SPACING.lg,
      borderLeftWidth: 2,
      borderLeftColor: colors.border,
    },
    replyInput: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.sm,
      minHeight: 40,
      textAlignVertical: 'top',
    },
    replyActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: SPACING.sm,
    },
    deletedComment: {
      backgroundColor: colors.cardBg2,
      marginHorizontal: SPACING.md,
      marginVertical: SPACING.xs,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      opacity: 0.6,
    },
    deletedText: {
      fontSize: FONT_SIZES.sm,
      color: colors.textMuted,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    textInput: {
      flex: 1,
      backgroundColor: colors.inputBg,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.lg,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      maxHeight: 100,
      textAlignVertical: 'top',
      marginRight: SPACING.sm,
    },
    sendButton: {
      backgroundColor: colors.tint,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.textMuted,
      opacity: 0.5,
    },
    counterContainer: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.xs,
    },
    counterText: {
      fontSize: FONT_SIZES.xs,
      color: colors.textMuted,
      textAlign: 'right',
    },
  });
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isAnonymousActive,
  onEdit,
  onDelete,
  onReply,
  onToggleReaction,
}) => {
  const styles = useThemedStyles(createEnhancedCommentsModalStyles);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.Content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showActions, setShowActions] = useState(false);

  const isOwner = currentUserId === comment.UserId;
  const canEdit = isOwner && !comment.IsDeleted;
  const canDelete = isOwner || currentUserId === 'moderator'; // TODO: proper moderator check

  const handleEdit = useCallback(() => {
    if (editText.trim() && editText !== comment.Content) {
      onEdit?.(comment.Id, editText.trim());
      setIsEditing(false);
    }
  }, [editText, comment.Content, comment.Id, onEdit]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro de que quieres eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete?.(comment.Id),
        },
      ]
    );
  }, [comment.Id, onDelete]);

  const handleReply = useCallback(() => {
    if (replyText.trim()) {
      onReply?.(comment.Id, replyText.trim());
      setReplyText('');
      setIsReplying(false);
    }
  }, [replyText, comment.Id, onReply]);

  const timeAgo = useMemo(() => {
    const now = new Date();
    const commentDate = new Date(comment.CreatedAt);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Ahora';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  }, [comment.CreatedAt]);

  if (comment.IsDeleted) {
    return (
      <View style={styles.deletedComment}>
        <Text style={styles.deletedText}>Comentario eliminado</Text>
      </View>
    );
  }

  return (
    <View style={styles.commentItem}>
      <View style={styles.commentHeader}>
        <View style={styles.commentMeta}>
          <Text style={styles.commentAuthor}>
            {isAnonymousActive && comment.IsAnonymous ? 'Anónimo' : 'Usuario'}
          </Text>
          <Text style={styles.commentTime}>{timeAgo}</Text>
          {comment.UpdatedAt && comment.UpdatedAt !== comment.CreatedAt && (
            <Text style={styles.editedLabel}>editado</Text>
          )}
        </View>

        {(canEdit || canDelete) && (
          <TouchableOpacity
            style={styles.actionsButton}
            onPress={() => setShowActions(!showActions)}
          >
            <FontAwesome name="ellipsis-h" size={14} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            multiline
            placeholder="Editar comentario..."
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditText(comment.Content);
                setIsEditing(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleEdit}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.commentContent}>{comment.Content}</Text>
      )}

      {showActions && (
        <View style={styles.actionsMenu}>
          {canEdit && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setIsEditing(true);
                setShowActions(false);
              }}
            >
              <FontAwesome name="edit" size={14} color="#666" />
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
          )}
          {canDelete && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setShowActions(false);
                handleDelete();
              }}
            >
              <FontAwesome name="trash" size={14} color="#e74c3c" />
              <Text style={[styles.actionText, { color: '#e74c3c' }]}>
                Eliminar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.commentFooter}>
        <TouchableOpacity
          style={styles.reactionButton}
          onPress={() => onToggleReaction?.(comment.Id, '👍')}
        >
          <Text style={styles.reactionIcon}>👍</Text>
          <Text style={styles.reactionCount}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setIsReplying(!isReplying)}
        >
          <FontAwesome name="reply" size={12} color="#666" />
          <Text style={styles.replyButtonText}>Responder</Text>
        </TouchableOpacity>
      </View>

      {isReplying && (
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Escribir respuesta..."
            multiline
          />
          <View style={styles.replyActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setReplyText('');
                setIsReplying(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleReply}>
              <Text style={styles.saveButtonText}>Responder</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export const EnhancedCommentsModal: React.FC<EnhancedCommentsModalProps> = ({
  visible,
  feedId,
  onClose,
  isAnonymousActive = false,
  currentUserId,
  maxHeight = 600,
}) => {
  const styles = useThemedStyles(createEnhancedCommentsModalStyles);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks para comentarios y interacciones
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFeedComments(feedId, 1, 20, { enabled: visible });

  const { addComment, removeComment } = useFeedInteractions(feedId);

  const comments = useMemo(() => {
    return commentsData.items.filter(
      (item) => item && typeof item === 'object' && 'Id' in item
    ) as FeedComment[];
  }, [commentsData.items]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addComment(newComment.trim(), isAnonymousActive);
      if (result?.Success) {
        setNewComment('');
        refetchComments();
      } else {
        Alert.alert(
          'Error',
          result?.Message || 'No se pudo añadir el comentario'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo añadir el comentario');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    newComment,
    isSubmitting,
    addComment,
    isAnonymousActive,
    refetchComments,
  ]);

  const handleEditComment = useCallback(
    async (_commentId: string, _newContent: string) => {
      // TODO: Implementar edición de comentarios cuando esté disponible en el servicio
      Alert.alert(
        'Información',
        'La edición de comentarios estará disponible próximamente'
      );
    },
    []
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await removeComment(commentId);
        if (result?.Success) {
          refetchComments();
        } else {
          Alert.alert(
            'Error',
            result?.Message || 'No se pudo eliminar el comentario'
          );
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo eliminar el comentario');
      }
    },
    [removeComment, refetchComments]
  );

  const handleReplyToComment = useCallback(
    async (_commentId: string, _content: string) => {
      // TODO: Implementar respuestas threading cuando esté disponible
      Alert.alert(
        'Información',
        'Las respuestas a comentarios estarán disponibles próximamente'
      );
    },
    []
  );

  const handleToggleReaction = useCallback(
    async (_commentId: string, _reaction: string) => {
      // TODO: Implementar reacciones a comentarios cuando esté disponible
      Alert.alert(
        'Información',
        'Las reacciones a comentarios estarán disponibles próximamente'
      );
    },
    []
  );

  const renderComment = useCallback(
    ({ item }: { item: FeedComment }) => (
      <CommentItem
        comment={item}
        currentUserId={currentUserId}
        isAnonymousActive={isAnonymousActive}
        onEdit={handleEditComment}
        onDelete={handleDeleteComment}
        onReply={handleReplyToComment}
        onToggleReaction={handleToggleReaction}
      />
    ),
    [
      currentUserId,
      isAnonymousActive,
      handleEditComment,
      handleDeleteComment,
      handleReplyToComment,
      handleToggleReaction,
    ]
  );

  const keyExtractor = useCallback((item: FeedComment) => item.Id, []);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { maxHeight }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Comentarios ({commentsData.total || 0})
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          <View style={styles.commentsContainer}>
            {commentsLoading && comments.length === 0 ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="large" text="Cargando comentarios..." />
              </View>
            ) : commentsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{commentsError}</Text>
                <TouchableOpacity
                  onPress={refetchComments}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : comments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="comment-o" size={48} color="#ccc" />
                <Text style={styles.emptyTitle}>No hay comentarios</Text>
                <Text style={styles.emptyMessage}>
                  Sé el primero en comentar esta publicación
                </Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder={
                isAnonymousActive
                  ? 'Comentar como Anónimo...'
                  : 'Escribe un comentario...'
              }
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!newComment.trim() || isSubmitting) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <FontAwesome name="send" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {/* Character counter */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{newComment.length}/500</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EnhancedCommentsModal;
