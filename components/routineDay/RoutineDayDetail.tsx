import React, { useState } from 'react';
import { View } from 'react-native';
import FormInput from '../common/FormInput';
import { Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import BodyMusclesDiagram from '@/components/body/BodyMusclesDiagram';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeRoutineDayDetailStyles } from './styles/routineDayDetail';

export function RoutineDayDetail() {
  const styles = useThemedStyles(makeRoutineDayDetailStyles);
  const [id, setId] = useState('');
  const [item, _setItem] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = async () => {
    setLoading(true);
    setError(null);
    try {
      setError('Consulta por Id no disponible');
    } catch (_e) {
      setError('Error al consultar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Overlay de cuerpo humano encima del detalle */}
      <View style={styles.bodyOverlay}>
        <BodyMusclesDiagram
          width="100%"
          height={undefined}
          palette="mono"
          backgroundColor="transparent"
          activeMuscles={[
            { id: 'pectorales_superiores_izquierdo', role: 'primary' },
            { id: 'pectorales_superiores_derecho', role: 'secondary' },
            { id: 'biceps_derecho', role: 'primary' },
            { id: 'biceps_izquierdo', role: 'secondary' },
            'abdominales_superiores_izquierdo',
            'abdominales_superiores_derecho',
          ]}
        />
      </View>

      <Text style={styles.title}>RoutineDay - Detalle</Text>
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
// styles are provided by makeRoutineDayDetailStyles via useThemedStyles
