import React, { useEffect, useMemo, useState } from 'react';
import { Modal, View as RNView, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Exercise } from '@/models/Exercise';
import { authService, userExerciseMaxService } from '@/services';
import type { AddUserExerciseMaxRequest } from '@/dto/UserExerciseMax/Request/AddUserExerciseMaxRequest';
import { useCustomAlert } from '@/components/common/CustomAlert';

interface Props {
  visible: boolean;
  onClose: () => void;
  exercise: Exercise;
  // opcionalmente, callback al guardar
  onSaved?: () => void;
}

const sanitizeNumericInput = (input: string) => {
  if (!input) return '';
  let s = String(input).replace(/,/g, '.');
  s = s.replace(/[^0-9.]/g, '');
  const firstDot = s.indexOf('.');
  if (firstDot !== -1) s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  if (s.startsWith('.')) s = '0' + s;
  return s;
};

const UserExerciseMaxModal: React.FC<Props> = ({ visible, onClose, exercise, onSaved }) => {
  const colorScheme = useColorScheme();
  const [weight, setWeight] = useState('');
  const [dateStr, setDateStr] = useState(''); // ISO local input opcional (YYYY-MM-DD)
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { showError, showSuccess, AlertComponent } = useCustomAlert();

  useEffect(() => {
    if (!visible) {
      setWeight('');
      setDateStr('');
      setErr(null);
    }
  }, [visible]);

  const errorMsg = useMemo(() => {
    const w = parseFloat(weight || '');
    if (!isFinite(w)) return null;
    if (w < 0 || w > 1000) return 'Peso inválido (0–1000 kg)';
    return null;
  }, [weight]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setErr(null);
      const u = await authService.getUserData();
      const w = parseFloat(weight);
      if (!isFinite(w)) {
        setErr('Ingresa un peso válido');
        setLoading(false);
        return;
      }
      const req: AddUserExerciseMaxRequest = {
        UserId: String(u?.id || ''),
        ExerciseId: String(exercise?.Id || (exercise as any)?.id),
        WeightKg: w,
        AchievedAt: dateStr ? new Date(dateStr).toISOString() : undefined,
      };
      const res = await userExerciseMaxService.addUserExerciseMax(req);
      if (res?.Success) {
        onClose();
        onSaved?.();
        showSuccess('Máximo registrado');
      } else {
        showError(res?.Message || 'No se pudo registrar');
      }
    } catch (e) {
      showError('No se pudo registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <RNView style={styles.overlay}>
        <RNView style={[styles.sheet, { backgroundColor: Colors[colorScheme].background }]}>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Registrar máximo</Text>
          <Text style={{ color: Colors[colorScheme].text + 'B3', marginBottom: 8 }}>{exercise?.Name}</Text>
          <Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Peso (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={t => setWeight(sanitizeNumericInput(t))}
            placeholder='0'
            placeholderTextColor={Colors[colorScheme].text + '55'}
            keyboardType='decimal-pad'
            style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text + '22' }]}
          />
          {errorMsg ? <Text style={{ color: Colors[colorScheme].tint, fontSize: 12, marginTop: 4 }}>{errorMsg}</Text> : null}

          <Text style={[styles.label, { color: Colors[colorScheme].text + 'B3', marginTop: 12 }]}>Fecha (opcional)</Text>
          <TextInput
            value={dateStr}
            onChangeText={setDateStr}
            placeholder='YYYY-MM-DD'
            placeholderTextColor={Colors[colorScheme].text + '55'}
            keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
            style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text, borderColor: Colors[colorScheme].text + '22' }]}
          />

          {err ? <Text style={{ color: Colors[colorScheme].tint, marginTop: 6 }}>{err}</Text> : null}

          <RNView style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button title='Guardar' onPress={handleSave} disabled={!!errorMsg || loading || !weight} />
            <Button title='Cancelar' onPress={onClose} variant='secondary' />
          </RNView>
          <AlertComponent />
        </RNView>
      </RNView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  sheet: { borderRadius: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  label: { fontSize: 12 },
  input: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginTop: 6 },
});

export default UserExerciseMaxModal;
