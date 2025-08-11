import React from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View as RNView } from 'react-native';
import { View, Text } from '@/components/Themed';
import type { Comment } from '@/models/Comment';
import Button from '@/components/common/Button';

export interface CommentsModalProps {
  visible: boolean;
  comments: Comment[];
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ visible, comments, onClose, onAddComment }) => {
  const [text, setText] = React.useState('');
  if (!visible) return null;
  return (
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Comentarios</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.close}>Cerrar</Text></TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(c) => c.Id}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <Text style={styles.commentAuthor}>{item.User?.UserName || 'Usuario'}</Text>
              <Text style={styles.commentText}>{item.Content}</Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
        <RNView style={styles.inputRow}>
          <TextInput value={text} onChangeText={setText} placeholder="Escribe un comentario" placeholderTextColor="#999" style={styles.input} />
          <Button title="Enviar" onPress={() => { if (text.trim()) { onAddComment(text.trim()); setText(''); } }} />
        </RNView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  card: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '80%', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  close: { color: '#FFF' },
  commentRow: { marginBottom: 12 },
  commentAuthor: { color: '#B0B0B0', marginBottom: 4 },
  commentText: { color: '#FFF' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 8 },
  input: { flex: 1, color: '#FFF', borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
});

export default CommentsModal;
