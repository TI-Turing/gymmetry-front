import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View as RNView,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';
import { Text } from '@/components/Themed';
import Button from '@/components/common/Button';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import type { Exercise } from '@/models/Exercise';
import { authService, userExerciseMaxService } from '@/services';
import type { AddUserExerciseMaxRequest } from '@/dto/UserExerciseMax/Request/AddUserExerciseMaxRequest';
import { useCustomAlert } from '@/components/common/CustomAlert';
import { useThemedStyles } from '@/hooks/useThemedStyles';

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
  if (firstDot !== -1)
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  if (s.startsWith('.')) s = '0' + s;
  return s;
};

const UserExerciseMaxModal: React.FC<Props> = ({
  visible,
  onClose,
  exercise,
  onSaved,
}) => {
  const colorScheme = useColorScheme();
  const styles = useThemedStyles((theme) => {
    const p = Colors[theme];
    return StyleSheet.create({
      overlay: {
        flex: 1,
        backgroundColor: p.overlay,
        justifyContent: 'center',
        padding: 24,
      },
      sheet: {
        borderRadius: 12,
        padding: 16,
        backgroundColor: p.card,
        borderWidth: 1,
        borderColor: p.border,
      },
      title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        color: p.text,
      },
      label: { fontSize: 12, color: p.textMuted },
      input: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 6,
        backgroundColor: p.card,
        color: p.text,
        borderColor: p.border,
      },
      subtle: { color: p.text + 'B3' },
    });
  });
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
      const exerciseId =
        (exercise &&
          'Id' in exercise &&
          (exercise as unknown as { Id?: string }).Id) ||
        (exercise &&
          'id' in exercise &&
          (exercise as unknown as { id?: string }).id) ||
        '';
      const req: AddUserExerciseMaxRequest = {
        UserId: String(u?.id || ''),
        ExerciseId: String(exerciseId || ''),
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <RNView style={styles.overlay}>
        <RNView style={styles.sheet}>
          <Text style={styles.title}>Registrar máximo</Text>
          <Text style={[styles.subtle, { marginBottom: 8 }]}>
            {exercise?.Name}
          </Text>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            value={weight}
            onChangeText={(t) => setWeight(sanitizeNumericInput(t))}
            placeholder="0"
            placeholderTextColor={Colors[colorScheme].text + '55'}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          {errorMsg ? (
            <Text
              style={{
                color: Colors[colorScheme].tint,
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {errorMsg}
            </Text>
          ) : null}

          <Text style={[styles.label, { marginTop: 12 }]}>
            Fecha (opcional)
          </Text>
          <TextInput
            value={dateStr}
            onChangeText={setDateStr}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors[colorScheme].text + '55'}
            keyboardType={
              Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'
            }
            style={styles.input}
          />

          {err ? (
            <Text style={{ color: Colors[colorScheme].tint, marginTop: 6 }}>
              {err}
            </Text>
          ) : null}

          <RNView style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button
              title="Guardar"
              onPress={handleSave}
              disabled={!!errorMsg || loading || !weight}
            />
            <Button title="Cancelar" onPress={onClose} variant="secondary" />
          </RNView>
          <AlertComponent />
        </RNView>
      </RNView>
    </Modal>
  );
};

// estilos locales no utilizados intencionalmente

export default UserExerciseMaxModal;
