import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import FormInput from '../common/FormInput';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Colors from '@/constants/Colors';
import { dailyService } from '@/services';

export function DailyDetail() {
  const [id, setId] = useState('');
  const [item, setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  type SearchItem = {
    Id?: string | number;
    Name?: string;
  } & Record<string, unknown>;
  const [results, setResults] = useState<SearchItem[]>([]);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dailyService.getDailyById(id);
      setItem(res.Data);
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  // Búsqueda en tiempo real por Name (o cualquier campo)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dailyService.findDailiesByFields({
          Name: query.trim(),
        } as Record<string, unknown>);
        let arr: unknown[] = [];
        if (res?.Success && res.Data) {
          if (Array.isArray(res.Data)) arr = res.Data as unknown[];
          else if ((res.Data as unknown as { $values?: unknown[] }).$values)
            arr =
              (res.Data as unknown as { $values?: unknown[] }).$values || [];
        }
        setResults((arr as SearchItem[]) || []);
      } catch {
        setError('Error en la búsqueda');
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily - Detalle</Text>
      <FormInput label="Id" value={id} onChangeText={setId} />
      <Button title="Consultar" onPress={fetchOne} />

      {/* Búsqueda por nombre (contains) */}
      <Text style={{ marginTop: 8 }}>Buscar por nombre</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Nombre"
        placeholderTextColor={'#888'}
        style={{
          borderWidth: 1,
          borderColor: '#333',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 8,
          color: '#fff',
          backgroundColor: '#1E1E1E',
          marginTop: 6,
        }}
      />
      {results.length > 0 && (
        <View style={{ marginTop: 8 }}>
          {results.map((r) => (
            <Button
              key={r.Id}
              title={String(r.Name ?? r.Id ?? '')}
              variant="secondary"
              onPress={() => {
                setItem(r);
                setResults([]);
                setQuery('');
              }}
              style={{ marginBottom: 8 }}
            />
          ))}
        </View>
      )}
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
