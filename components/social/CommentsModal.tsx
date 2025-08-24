import React from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import type { Comment } from '@/models/Comment';
import Button from '@/components/common/Button';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeCommentsModalStyles } from './styles/commentsModal';

export interface CommentsModalProps {
  visible: boolean;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  comments,
  onClose,
  onAddComment,
}) => {
  const [text, setText] = React.useState('');
  const styles = useThemedStyles(makeCommentsModalStyles);
  if (!visible) return null;
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Comentarios</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Cerrar</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.Id}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <Text style={styles.commentAuthor}>
                {item.User?.UserName || 'Usuario'}
              </Text>
              <Text style={styles.commentText}>{item.Content}</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
        <RNView style={styles.inputRow}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe un comentario"
            placeholderTextColor={styles.colors.placeholder}
            style={styles.input}
          />
          <Button
            title="Enviar"
            onPress={() => {
              if (text.trim()) {
                onAddComment(text.trim());
                setText('');
              }
            }}
          />
        </RNView>
      </View>
    </View>
  );
};

export default CommentsModal;
