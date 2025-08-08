import React, { useState } from 'react';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Colors from '@/constants/Colors';
import { accessMethodTypeFunctionsService } from '@/services/functions';

export function AccessMethodTypeForm() {
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
        await accessMethodTypeFunctionsService.addAccessMethodType(body);
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
        await accessMethodTypeFunctionsService.updateAccessMethodType(body);
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
        await accessMethodTypeFunctionsService.deleteAccessMethodType(id);
      setMsg(res.Message || 'Eliminado');
    } catch {
      setMsg('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AccessMethodType - Formulario</Text>
      <Text style={styles.label}>Campos (JSON)</Text>
      <TextInput
        style={styles.textarea}
        value={payload}
        onChangeText={setPayload}
        multiline
        numberOfLines={8}
      />
      <View style={styles.row}>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  error: { color: 'red', marginVertical: 8 },
  info: { color: Colors.tint, marginTop: 8 },
  card: {
    backgroundColor: '#fff2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  cardText: { fontSize: 12 },
  label: { marginBottom: 6, color: Colors.text },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 8, marginVertical: 8 },
});
export default styles;
