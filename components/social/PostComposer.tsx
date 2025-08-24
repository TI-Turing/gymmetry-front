import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, TouchableOpacity, View as RNView } from 'react-native';
import { View, Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import SmartImage from '@/components/common/SmartImage';

export interface PostComposerProps {
  avatarUrl?: string | null;
  onSubmit: (content: string, mediaUrl?: string | null) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({ avatarUrl, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const handlePublish = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), null);
    setText('');
    setOpen(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
  <SmartImage uri={avatarUrl || 'https://via.placeholder.com/40'} style={styles.avatar} deferOnDataSaver={false} />
        <TouchableOpacity style={styles.inputFake} onPress={() => setOpen(true)}>
          <Text style={styles.placeholder}>¿Cómo fue tu entrenamiento hoy?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setOpen(true)}>
          <Text style={styles.actionText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setOpen(true)}>
          <Text style={styles.actionText}>Ubicación</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nuevo Post</Text>
            <RNView style={{ width: 60 }} />
          </View>
          <View style={styles.modalBody}>
            <TextInput
              style={styles.textarea}
              placeholder="Escribe algo..."
              placeholderTextColor="#999"
              multiline
              value={text}
              onChangeText={setText}
              autoFocus
            />
          </View>
          <View style={styles.modalFooter}>
            <Button title="Publicar" onPress={handlePublish} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E1E1E', marginHorizontal: 20, borderRadius: 16, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  inputFake: { flex: 1, marginLeft: 12, padding: 12, backgroundColor: '#333333', borderRadius: 20 },
  placeholder: { color: '#B0B0B0', fontSize: 14 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actionBtn: { paddingVertical: 6, paddingHorizontal: 10 },
  actionText: { color: '#B0B0B0' },
  modalContainer: { flex: 1, backgroundColor: '#121212' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  cancel: { color: '#FFF' },
  modalBody: { flex: 1, padding: 16 },
  textarea: { flex: 1, color: '#FFF', fontSize: 16, textAlignVertical: 'top' },
  modalFooter: { padding: 16 },
});

export default PostComposer;
