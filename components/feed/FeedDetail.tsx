import React, { useState } from 'react';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { feedService } from '@/services';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import styles from './styles';

export function FeedDetail() {
  const themed = useThemedStyles(styles);
  const [id, setId] = useState('');
  const [item, setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await feedService.getFeedById(id);
      setItem(res.Data);
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={themed.detailContainer}>
      <Text style={themed.formTitle}>Feed - Detalle</Text>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Consultar" onPress={fetchOne} />
      {loading ? (
        <LoadingSpinner />
      ) : item ? (
        <View style={themed.detailCard}>
          <Text style={themed.detailText}>{JSON.stringify(item, null, 2)}</Text>
        </View>
      ) : error ? (
        <Text style={themed.error}>{error}</Text>
      ) : null}
    </View>
  );
}

export default FeedDetail;
