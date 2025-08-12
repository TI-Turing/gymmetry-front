import { TextInput } from 'react-native';
import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { routineTemplateService } from '@/services';
import { styles } from './styles';

export function RoutineTemplateForm() {
  const [payload, setPayload] = useState<string>('{}');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onAdd = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const body = JSON.parse(payload);
      const res =
        await routineTemplateService.addRoutineTemplate(body);
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
      const res =
        await routineTemplateService.updateRoutineTemplate(body);
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
      const res =
        await routineTemplateService.deleteRoutineTemplate(id);
      setMsg(res.Message || 'Eliminado');
    } catch {
      setMsg('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>RoutineTemplate - Formulario</Text>
      <Text style={styles.formLabel}>Campos (JSON)</Text>
      <TextInput
        style={styles.textarea}
        value={payload}
        onChangeText={setPayload}
        multiline
        numberOfLines={8}
        placeholderTextColor="#666666"
      />
      <View style={styles.formRow}>
        <Button title='Crear' onPress={onAdd} />
        <Button title='Actualizar' onPress={onUpdate} />
      </View>
      <FormInput label='Id' value={id} onChangeText={setId} />
      <Button title='Eliminar' onPress={onDelete} />
      {loading ? (
        <LoadingSpinner />
      ) : msg ? (
        <Text style={styles.info}>{msg}</Text>
      ) : null}
    </View>
  );
}

export default RoutineTemplateForm;
