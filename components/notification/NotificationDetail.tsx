import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Colors from '@/constants/Colors';
import { notificationService } from '@/services';

export function NotificationDetail() {
  const [id, setId] = useState('');
  const [item, setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getNotificationById(id);
      setItem(res.Data);
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification - Detalle</Text>
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
