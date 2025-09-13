import React, { useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View as RNView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import type { Comment } from '@/models/Comment';
import type { FeedComment } from '@/models/FeedComment';
// import Button from '@/components/common/Button'; // No usado actualmente
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeCommentsModalStyles } from './styles/commentsModal';
import { LoadingSpinner } from '../common/LoadingSpinner';

export interface CommentsModalProps {
  visible: boolean;
  comments?: Comment[];
  feedComments?: FeedComment[];
  onClose: () => void;
  onAddComment: (text: string) => void | Promise<void>;
  onDeleteComment?: (commentId: string) => void | Promise<void>;
  isAnonymousActive?: boolean;
  currentUserId?: string;
  loading?: boolean;
  error?: string;
  title?: string;
  maxHeight?: number;
}

interface CommentItemProps {
  comment: Comment | FeedComment;
  currentUserId?: string;
  isAnonymousActive?: boolean;
  onDelete?: (commentId: string) => void | Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles: any; // TODO: Proper typing
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isAnonymousActive,
  onDelete,
  styles,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar si es FeedComment o Comment
  const isFeedComment = 'IsDeleted' in comment;
  const isOwner = currentUserId === comment.UserId;
  const canDelete = isOwner && onDelete;

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

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Eliminar comentario',
      '¿Estás seguro de que quieres eliminar este comentario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await onDelete?.(comment.Id);
            } catch {
              // Error deleting comment - handled silently
            }
            setIsDeleting(false);
            setShowActions(false);
          },
        },
      ]
    );
  }, [comment.Id, onDelete]);

  // Si es un FeedComment eliminado
  if (isFeedComment && (comment as FeedComment).IsDeleted) {
    return (
      <View style={[styles.commentRow, { opacity: 0.6 }]}>
        <Text style={[styles.commentText, { fontStyle: 'italic' }]}>
          Comentario eliminado
        </Text>
      </View>
    );
  }

  const authorName =
    isAnonymousActive && 'IsAnonymous' in comment && comment.IsAnonymous
      ? 'Anónimo'
      : 'User' in comment
        ? comment.User?.UserName || 'Usuario'
        : 'Usuario';

  return (
    <View style={styles.commentRow}>
      <View style={styles.commentHeader}>
        <View style={styles.commentMeta}>
          <Text style={styles.commentAuthor}>{authorName}</Text>
          <Text style={styles.commentTime}>{timeAgo}</Text>
        </View>
        {canDelete && (
          <TouchableOpacity
            style={styles.actionsButton}
            onPress={() => setShowActions(!showActions)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <FontAwesome name="ellipsis-h" size={14} color="#666" />
            )}
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.commentText}>{comment.Content}</Text>

      {showActions && (
        <View style={styles.actionsMenu}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <FontAwesome name="trash" size={14} color="#e74c3c" />
            <Text style={[styles.actionText, { color: '#e74c3c' }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  comments,
  feedComments,
  onClose,
  onAddComment,
  onDeleteComment,
  isAnonymousActive = false,
  currentUserId,
  loading = false,
  error,
  title = 'Comentarios',
  maxHeight = 600,
}) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const styles = useThemedStyles(makeCommentsModalStyles);

  const allComments = useMemo(() => {
    return feedComments || comments || [];
  }, [feedComments, comments]);

  const handleAddComment = useCallback(async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(text.trim());
      setText('');
    } catch {
      Alert.alert('Error', 'No se pudo añadir el comentario');
    } finally {
      setIsSubmitting(false);
    }
  }, [text, isSubmitting, onAddComment]);

  const renderComment = useCallback(
    ({ item }: { item: Comment | FeedComment }) => (
      <CommentItem
        comment={item}
        currentUserId={currentUserId}
        isAnonymousActive={isAnonymousActive}
        onDelete={onDeleteComment}
        styles={styles}
      />
    ),
    [currentUserId, isAnonymousActive, onDeleteComment, styles]
  );

  const keyExtractor = useCallback(
    (item: Comment | FeedComment) => item.Id,
    []
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { maxHeight }]}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {title} ({allComments.length})
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.commentsContainer}>
            {loading && allComments.length === 0 ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="large" text="Cargando comentarios..." />
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : allComments.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome name="comment-o" size={48} color="#ccc" />
                <Text style={styles.emptyTitle}>No hay comentarios</Text>
                <Text style={styles.emptyMessage}>
                  Sé el primero en comentar
                </Text>
              </View>
            ) : (
              <FlatList
                data={allComments}
                keyExtractor={keyExtractor}
                renderItem={renderComment}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
              />
            )}
          </View>

          <RNView style={styles.inputRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={
                isAnonymousActive
                  ? 'Comentar como Anónimo...'
                  : 'Escribe un comentario...'
              }
              placeholderTextColor={styles.colors?.placeholder}
              style={styles.input}
              multiline
              maxLength={500}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!text.trim() || isSubmitting) && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!text.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <FontAwesome name="send" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </RNView>

          {/* Character counter */}
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{text.length}/500</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CommentsModal;
