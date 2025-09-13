import React, { useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from '../useColorScheme';
import { PostEditModal } from './PostEditModal';
import type { FeedItem } from '@/types/feedTypes';

export interface EditPostButtonProps {
  post: FeedItem;
  onPostUpdated?: (updatedPost: FeedItem) => void;
  canEdit?: boolean;
}

export const EditPostButton: React.FC<EditPostButtonProps> = ({
  post,
  onPostUpdated,
  canEdit = true,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const handleSavePost = useCallback(
    async (updatedData: Partial<FeedItem>) => {
      try {
        // Aquí se haría la llamada a la API para actualizar el post
        // await postService.updatePost(post.id, updatedData);

        // Simular actualizacion exitosa
        const updatedPost: FeedItem = {
          ...post,
          ...updatedData,
          updatedAt: new Date().toISOString(),
        };

        // Notificar al padre que el post fue actualizado
        onPostUpdated?.(updatedPost);
      } catch (error) {
        throw error; // Re-throw para que el modal maneje el error
      }
    },
    [post, onPostUpdated]
  );

  if (!canEdit) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEdit}
        activeOpacity={0.7}
      >
        <Text style={styles.editButtonText}>✏️ Editar</Text>
      </TouchableOpacity>

      <PostEditModal
        visible={showEditModal}
        post={post}
        onClose={() => setShowEditModal(false)}
        onSave={handleSavePost}
      />
    </>
  );
};

const createStyles = (colorScheme: 'light' | 'dark') => {
  const isDark = colorScheme === 'dark';

  return StyleSheet.create({
    editButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: isDark ? '#333' : '#f0f0f0',
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#e0e0e0',
      alignSelf: 'flex-start',
    },
    editButtonText: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      fontWeight: '500',
    },
  });
};
