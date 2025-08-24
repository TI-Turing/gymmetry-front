import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { gymService } from '@/services';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymCrudStyles } from './styles/gymCrud';

export function GymDetail() {
  const { styles } = useThemedStyles(makeGymCrudStyles);
  const [id, setId] = useState('');
  const [item, setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gymService.getGymById(id);
      setItem(res.Data);
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym - Detalle</Text>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Consultar" onPress={fetchOne} />
      {loading ? (
        <LoadingSpinner />
      ) : item ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>{JSON.stringify(item, null, 2)}</Text>
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}
export default {};
