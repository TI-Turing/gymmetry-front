import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFeedComments, useFeedInteractions } from '@/hooks/useFeed';
import { CommentsModal } from '../social/CommentsModal';
import type { FeedComment } from '@/models/FeedComment';

interface EnhancedCommentsModalIntegrationProps {
  visible: boolean;
  feedId: string;
  onClose: () => void;
  currentUserId?: string;
  isAnonymousActive?: boolean;
}

/**
 * Ejemplo de integración completa del CommentsModal mejorado
 * con hooks reales de feed y manejo de estado
 */
export const EnhancedCommentsModalIntegration: React.FC<
  EnhancedCommentsModalIntegrationProps
> = ({
  visible,
  feedId,
  onClose,
  currentUserId,
  isAnonymousActive = false,
}) => {
  const [currentPage, _setCurrentPage] = useState(1);

  // Hook para cargar comentarios paginados
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFeedComments(feedId, currentPage, 20, { enabled: visible });

  // Hook para interacciones (add, remove comments)
  const { addComment, removeComment } = useFeedInteractions(feedId);

  // Procesar comentarios para el modal
  const processedComments = React.useMemo(() => {
    return (commentsData.items as FeedComment[]).filter(
      (item) => item && item.Id && item.Content && item.UserId
    );
  }, [commentsData.items]);

  // Handler para añadir comentario
  const handleAddComment = useCallback(
    async (text: string) => {
      try {
        const result = await addComment(text, isAnonymousActive);
        if (result?.Success) {
          // Recargar comentarios para mostrar el nuevo
          refetchComments();
        } else {
          Alert.alert(
            'Error',
            result?.Message || 'No se pudo añadir el comentario'
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Error de conexión al añadir comentario');
      }
    },
    [addComment, isAnonymousActive, refetchComments]
  );

  // Handler para eliminar comentario
  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        const result = await removeComment(commentId);
        if (result?.Success) {
          // Recargar comentarios para actualizar la lista
          refetchComments();
        } else {
          Alert.alert(
            'Error',
            result?.Message || 'No se pudo eliminar el comentario'
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Error de conexión al eliminar comentario');
      }
    },
    [removeComment, refetchComments]
  );

  return (
    <CommentsModal
      visible={visible}
      feedComments={processedComments}
      onClose={onClose}
      onAddComment={handleAddComment}
      onDeleteComment={handleDeleteComment}
      isAnonymousActive={isAnonymousActive}
      currentUserId={currentUserId}
      loading={commentsLoading}
      error={commentsError}
      title={`Comentarios (${commentsData.total || 0})`}
      maxHeight={600}
    />
  );
};

export default EnhancedCommentsModalIntegration;
