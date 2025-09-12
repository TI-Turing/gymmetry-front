import { TextInput } from 'react-native';
import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { feedService } from '@/services';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';

export function FeedForm() {
  const themed = useThemedStyles(styles);
  const [payload, setPayload] = useState<string>('{}');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onAdd = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const body = JSON.parse(payload);
      const res = await feedService.createFeed(body);
      setMsg(res.Message || 'Creado');
    } catch {
      setMsg('Error al crear');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const body = JSON.parse(payload);
      const res = await feedService.updateFeed(id, body);
      setMsg(res.Message || 'Actualizado');
    } catch {
      setMsg('Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await feedService.deleteFeed(id);
      setMsg(res.Message || 'Eliminado');
    } catch {
      setMsg('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themed.formContainer}>
      <Text style={themed.formTitle}>Feed - Formulario</Text>
      <Text style={themed.formLabel}>Campos (JSON)</Text>
      <TextInput
        style={themed.textarea}
        value={payload}
        onChangeText={setPayload}
        multiline
        numberOfLines={8}
        placeholderTextColor="#666666"
      />
      <View style={themed.formRow}>
        <Button title="Crear" onPress={onAdd} />
        <Button title="Actualizar" onPress={onUpdate} />
      </View>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Eliminar" onPress={onDelete} />
      {loading ? (
        <LoadingSpinner />
      ) : msg ? (
        <Text style={themed.info}>{msg}</Text>
      ) : null}
    </View>
  );
}

export default FeedForm;
