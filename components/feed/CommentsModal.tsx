import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useFeedComments, useFeedInteractions } from '@/hooks/useFeed';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';
interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  isAnonymous?: boolean;
}
interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  feedId: string;
  feedTitle?: string;
}
const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  feedId,
  feedTitle,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  // Hooks para datos
  const {
    data: commentsData,
    loading,
    error,
    refetch,
  } = useFeedComments(feedId, 1, 50, { enabled: visible });
  const { addComment, removeComment } = useFeedInteractions(feedId);
  const comments = (commentsData?.items || []) as Comment[];
  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'El comentario no puede estar vacío');
      return;
    }
    try {
      const response = await addComment(newComment, isAnonymous);
      if (response?.Success) {
        setNewComment('');
        refetch();
        Alert.alert('Éxito', 'Comentario agregado exitosamente');
      } else {
        Alert.alert(
          'Error',
          response?.Message || 'Error al agregar comentario'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Error al agregar comentario');
    }
  }, [newComment, isAnonymous, addComment, refetch]);
  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      Alert.alert(
        'Eliminar comentario',
        '¿Estás seguro de que quieres eliminar este comentario?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await removeComment(commentId);
                if (response?.Success) {
                  refetch();
                  Alert.alert('Éxito', 'Comentario eliminado');
                } else {
                  Alert.alert(
                    'Error',
                    response?.Message || 'Error al eliminar comentario'
                  );
                }
              } catch (error) {
                Alert.alert('Error', 'Error al eliminar comentario');
              }
            },
          },
        ]
      );
    },
    [removeComment, refetch]
  );
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch {
      return dateString;
    }
  }, []);
  const renderComment = useCallback(
    (comment: Comment, index: number) => (
      <View key={comment.id || index} style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAuthor}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {comment.authorName?.charAt(0)?.toUpperCase() || '?'}
              </Text>
            </View>
            <View style={styles.commentMeta}>
              <Text style={styles.authorName}>
                {comment.isAnonymous
                  ? 'Anónimo'
                  : comment.authorName || 'Usuario'}
              </Text>
              <Text style={styles.commentDate}>
                {formatDate(comment.createdAt)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteComment(comment.id)}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.commentContent}>{comment.content}</Text>
      </View>
    ),
    [formatDate, handleDeleteComment]
  );
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Comentarios</Text>
          <View style={styles.headerSpacer} />
        </View>
        {feedTitle && (
          <View style={styles.feedTitleContainer}>
            <Text style={styles.feedTitle} numberOfLines={2}>
              {feedTitle}
            </Text>
          </View>
        )}
        {/* Comments List */}
        <ScrollView
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner />
              <Text style={styles.loadingText}>Cargando comentarios...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Reintentar" onPress={refetch} variant="outline" />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay comentarios aún</Text>
              <Text style={styles.emptySubtext}>
                ¡Sé el primero en comentar!
              </Text>
            </View>
          ) : (
            comments.map(renderComment)
          )}
        </ScrollView>
        {/* Comment Input */}
        <View style={styles.inputContainer}>
          <View style={styles.anonymousToggle}>
            <TouchableOpacity
              style={[
                styles.anonymousButton,
                isAnonymous && styles.anonymousButtonActive,
              ]}
              onPress={() => setIsAnonymous(!isAnonymous)}
            >
              <Text
                style={[
                  styles.anonymousButtonText,
                  isAnonymous && styles.anonymousButtonTextActive,
                ]}
              >
                Anónimo
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escribe un comentario..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              returnKeyType="default"
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !newComment.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Text
                style={[
                  styles.sendButtonText,
                  !newComment.trim() && styles.sendButtonTextDisabled,
                ]}
              >
                ➤
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.characterCount}>{newComment.length}/1000</Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerSpacer: {
    width: 40,
  },
  feedTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  feedTitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  commentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  commentMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#ffebee',
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  anonymousToggle: {
    marginBottom: 8,
  },
  anonymousButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  anonymousButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  anonymousButtonText: {
    fontSize: 12,
    color: '#666',
  },
  anonymousButtonTextActive: {
    color: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#f8f8f8',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
});
export default CommentsModal;
