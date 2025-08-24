import React, { useState } from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View as RNView,
} from 'react-native';
import { View, Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import SmartImage from '@/components/common/SmartImage';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePostComposerStyles } from './styles/postComposer';

export interface PostComposerProps {
  avatarUrl?: string | null;
  onSubmit: (content: string, mediaUrl?: string | null) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  avatarUrl,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const styles = useThemedStyles(makePostComposerStyles);

  const handlePublish = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), null);
    setText('');
    setOpen(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SmartImage
          uri={avatarUrl || 'https://via.placeholder.com/40'}
          style={styles.avatar}
          deferOnDataSaver={false}
        />
        <TouchableOpacity
          style={styles.inputFake}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.placeholder}>
            ¿Cómo fue tu entrenamiento hoy?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setOpen(true)}
        >
          <Text style={styles.actionText}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setOpen(true)}
        >
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
              placeholderTextColor={styles.colors.placeholder}
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

export default PostComposer;
