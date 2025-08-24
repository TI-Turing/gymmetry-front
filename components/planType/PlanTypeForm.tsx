import { TextInput } from 'react-native';
import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { planTypeService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makePlanTypeFormStyles } from './styles.form';

export function PlanTypeForm() {
  const { styles, colors } = useThemedStyles(makePlanTypeFormStyles);
  const [payload, setPayload] = useState<string>('{}');
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onAdd = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const body = JSON.parse(payload);
      const res = await planTypeService.addPlanType(body);
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
      const res = await planTypeService.updatePlanType(body);
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
      const res = await planTypeService.deletePlanType(id);
      setMsg(res.Message || 'Eliminado');
    } catch {
      setMsg('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlanType - Formulario</Text>
      <Text style={styles.label}>Campos (JSON)</Text>
      <TextInput
        style={styles.textarea}
        value={payload}
        onChangeText={setPayload}
        multiline
        numberOfLines={8}
      />
      <View style={styles.row}>
        <Button title="Crear" onPress={onAdd} />
        <Button title="Actualizar" onPress={onUpdate} />
      </View>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Eliminar" onPress={onDelete} />
      {loading ? (
        <LoadingSpinner />
      ) : msg ? (
        <Text style={styles.info}>{msg}</Text>
      ) : null}
    </View>
  );
}
export default {};
