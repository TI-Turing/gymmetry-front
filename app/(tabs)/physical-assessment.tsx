import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View as RNView, TextInput, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import ScreenWrapper from '@/components/layout/ScreenWrapper';
import { withWebLayout } from '@/components/layout/withWebLayout';
import Button from '@/components/common/Button';
import { physicalAssessmentService, authService } from '@/services';
import type { PhysicalAssessment } from '@/models/PhysicalAssessment';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / 86400000);
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString();
}

function computeBmi(weightKgStr: string, heightCmStr: string) {
  const w = parseFloat(String(weightKgStr).replace(',', '.'));
  const hcm = parseFloat(String(heightCmStr).replace(',', '.'));
  if (!isFinite(w) || !isFinite(hcm) || hcm <= 0) return '';
  const hm = hcm / 100;
  return (w / (hm * hm)).toFixed(1);
}

function PhysicalAssessmentScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PhysicalAssessment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'thisYear' | 'last3Years'>('all');

  // Simple form state (subset de campos clave)
  const [height, setHeight] = useState(''); // cm
  const [weight, setWeight] = useState(''); // kg
  const [bodyFat, setBodyFat] = useState(''); // %
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hips, setHips] = useState('');
  // Campos adicionales del modelo
  const [leftArm, setLeftArm] = useState('');
  const [righArm, setRighArm] = useState('');
  const [leftForearm, setLeftForearm] = useState('');
  const [rightForearm, setRightForearm] = useState('');
  const [leftThigh, setLeftThigh] = useState('');
  const [rightThigh, setRightThigh] = useState('');
  const [leftCalf, setLeftCalf] = useState('');
  const [rightCalf, setRightCalf] = useState('');
  const [abdomen, setAbdomen] = useState('');
  const [upperBack, setUpperBack] = useState('');
  const [lowerBack, setLowerBack] = useState('');
  const [neck, setNeck] = useState('');
  const [shoulders, setShoulders] = useState('');
  const [wrist, setWrist] = useState('');
  const [muscleMass, setMuscleMass] = useState('');

  const latest = useMemo(() => {
    if (!items || items.length === 0) return null as PhysicalAssessment | null;
    // Tomar el más reciente por CreatedAt
    const sorted = [...items].sort((a, b) => (new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()));
    return sorted[0];
  }, [items]);

  const canUpdate = useMemo(() => {
    if (!latest) return true; // Si no hay, permitir crear
    const last = new Date(latest.UpdatedAt || latest.CreatedAt);
    const diffDays = daysBetween(last, new Date());
    return diffDays >= 30; // al menos un mes (aprox 30 días)
  }, [latest]);

  const filteredItems = useMemo(() => items, [items]);
  const sortedItems = useMemo(() => {
    const arr = Array.isArray(filteredItems) ? [...filteredItems] : [];
    arr.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
    return arr;
  }, [filteredItems]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUserData();
      // Armar body para filtrar desde backend
      const body: Record<string, any> = { UserId: user?.id || '' };
      const now = new Date();
      if (filter === 'thisYear') {
        const start = new Date(now.getFullYear(), 0, 1);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        body.CreatedAtFrom = start.toISOString();
        body.CreatedAtTo = end.toISOString();
      } else if (filter === 'last3Years') {
        const start = new Date(now.getFullYear() - 2, 0, 1);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        body.CreatedAtFrom = start.toISOString();
        body.CreatedAtTo = end.toISOString();
      }
      const resp = await physicalAssessmentService.findPhysicalAssessmentsByFields(body as any);
      let arr: any[] = [];
      if (resp?.Success && resp.Data) {
        const raw: any = resp.Data as any;
        arr = Array.isArray(raw) ? raw : (raw?.$values || []);
      }
      setItems(arr as PhysicalAssessment[]);
    } catch {
      setError('No se pudieron cargar tus evaluaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const openForm = () => {
    // Prefill con último valor si existe
    if (latest) {
      setHeight(latest.Height || '');
      setWeight(latest.Weight || '');
      setBodyFat(latest.BodyFatPercentage || '');
      setWaist(latest.Waist || '');
      setChest(latest.Chest || '');
      setHips(latest.Hips || '');
  setLeftArm(latest.LeftArm || '');
  setRighArm(latest.RighArm || '');
  setLeftForearm(latest.LeftForearm || '');
  setRightForearm(latest.RightForearm || '');
  setLeftThigh(latest.LeftThigh || '');
  setRightThigh(latest.RightThigh || '');
  setLeftCalf(latest.LeftCalf || '');
  setRightCalf(latest.RightCalf || '');
  setAbdomen(latest.Abdomen || '');
  setUpperBack(latest.UpperBack || '');
  setLowerBack(latest.LowerBack || '');
  setNeck(latest.Neck || '');
  setShoulders(latest.Shoulders || '');
  setWrist(latest.Wrist || '');
  setMuscleMass(latest.MuscleMass || '');
    } else {
  setHeight(''); setWeight(''); setBodyFat(''); setWaist(''); setChest(''); setHips('');
  setLeftArm(''); setRighArm(''); setLeftForearm(''); setRightForearm('');
  setLeftThigh(''); setRightThigh(''); setLeftCalf(''); setRightCalf('');
  setAbdomen(''); setUpperBack(''); setLowerBack(''); setNeck('');
  setShoulders(''); setWrist(''); setMuscleMass('');
    }
    setFormOpen(true);
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const user = await authService.getUserData();
      const bmi = computeBmi(weight, height);
      const req: any = {
        Height: height,
        Weight: weight,
        BodyFatPercentage: bodyFat,
        Waist: waist,
        Chest: chest,
        Hips: hips,
        Bmi: bmi,
        LeftArm: leftArm,
        RighArm: righArm,
        LeftForearm: leftForearm,
        RightForearm: rightForearm,
        LeftThigh: leftThigh,
        RightThigh: rightThigh,
        LeftCalf: leftCalf,
        RightCalf: rightCalf,
        Abdomen: abdomen,
        UpperBack: upperBack,
        LowerBack: lowerBack,
        Neck: neck,
        Shoulders: shoulders,
        Wrist: wrist,
        MuscleMass: muscleMass,
        UserId: user?.id || '',
      };
      const res = await physicalAssessmentService.addPhysicalAssessment(req);
      if (res?.Success) {
        setFormOpen(false);
        await loadData();
      } else {
        setError(res?.Message || 'No se pudo guardar');
      }
    } catch {
      setError('No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = () => {
    if (loading && items.length === 0) {
      return <Text style={{ color: Colors[colorScheme].text + 'B3' }}>Cargando...</Text>;
    }
    if (!latest) {
      return (
        <View style={[styles.card, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }] }>
          <Text style={[styles.emptyTitle, { color: Colors[colorScheme].text }]}>Aún no tienes datos</Text>
          <Text style={{ color: Colors[colorScheme].text + 'B3', marginBottom: 8 }}>Registra tu evaluación física por primera vez.</Text>
          <Button title='Registrar evaluación' onPress={openForm} />
        </View>
      );
    }

    return (
      <View style={[styles.card, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Resumen</Text>
        <RNView style={styles.grid}>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Peso</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Weight || '—'} kg</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Altura</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Height || '—'} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Grasa</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.BodyFatPercentage || '—'} %</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>IMC</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Bmi || computeBmi(latest.Weight, latest.Height) || '—'}</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Cintura</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Waist || '—'} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Pecho</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Chest || '—'} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Cadera</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{latest.Hips || '—'} cm</Text></View>
        </RNView>
        <Text style={[styles.updatedAt, { color: Colors[colorScheme].text + 'B3' }]}>Última actualización: {formatDate(latest.UpdatedAt || latest.CreatedAt)}</Text>
        <Button title='Actualizar evaluación' onPress={openForm} disabled={!canUpdate} />
        {!canUpdate && (
          <Text style={{ color: Colors[colorScheme].text + 'B3', marginTop: 8 }}>Podrás actualizar nuevamente dentro de {Math.max(0, 30 - daysBetween(new Date(latest.UpdatedAt || latest.CreatedAt), new Date()))} días.</Text>
        )}
      </View>
    );
  };

  const renderForm = () => {
    if (!formOpen) return null;
    return (
      <View style={[styles.formCard, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Evaluación física</Text>
        {/* Línea 1 */}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Peso (kg)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='70' placeholderTextColor={Colors[colorScheme].text + '66'} value={weight} onChangeText={setWeight} keyboardType='decimal-pad' />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Altura (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='175' placeholderTextColor={Colors[colorScheme].text + '66'} value={height} onChangeText={setHeight} keyboardType='numeric' />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Grasa corporal (%)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='18' placeholderTextColor={Colors[colorScheme].text + '66'} value={bodyFat} onChangeText={setBodyFat} keyboardType='decimal-pad' />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Masa muscular</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} value={muscleMass} onChangeText={setMuscleMass} keyboardType='decimal-pad' />
        {/* Línea 2 */}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cintura (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='80' placeholderTextColor={Colors[colorScheme].text + '66'} value={waist} onChangeText={setWaist} keyboardType='numeric' />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='95' placeholderTextColor={Colors[colorScheme].text + '66'} value={chest} onChangeText={setChest} keyboardType='numeric' />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cadera (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} placeholder='95' placeholderTextColor={Colors[colorScheme].text + '66'} value={hips} onChangeText={setHips} keyboardType='numeric' />
        {/* Brazos */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Brazos</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Brazo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftArm} onChangeText={setLeftArm} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Brazo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={righArm} onChangeText={setRighArm} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Antebrazo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftForearm} onChangeText={setLeftForearm} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Antebrazo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightForearm} onChangeText={setRightForearm} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        {/* Piernas */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Piernas</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muslo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftThigh} onChangeText={setLeftThigh} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muslo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightThigh} onChangeText={setRightThigh} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pantorrilla izquierda (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftCalf} onChangeText={setLeftCalf} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pantorrilla derecha (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightCalf} onChangeText={setRightCalf} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        {/* Espalda y otros */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Espalda y otros</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Abdomen (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={abdomen} onChangeText={setAbdomen} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Espalda alta (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={upperBack} onChangeText={setUpperBack} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Espalda baja (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={lowerBack} onChangeText={setLowerBack} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cuello (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={neck} onChangeText={setNeck} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Hombros (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={shoulders} onChangeText={setShoulders} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muñeca (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={wrist} onChangeText={setWrist} keyboardType='numeric' placeholder='—' placeholderTextColor={Colors[colorScheme].text + '66'} />
        <RNView style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Button title='Guardar' onPress={submitForm} />
          <Button title='Cancelar' onPress={() => setFormOpen(false)} variant='secondary' />
        </RNView>
      </View>
    );
  };

  const renderHistory = () => {
    if (!items.length) return null;
    return (
      <View style={[styles.card, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
        <RNView style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <Button title='Todos' variant={filter === 'all' ? 'primary' : 'outline'} onPress={() => setFilter('all')} size='small' />
          <Button title='Este año' variant={filter === 'thisYear' ? 'primary' : 'outline'} onPress={() => setFilter('thisYear')} size='small' />
          <Button title='Últimos 3 años' variant={filter === 'last3Years' ? 'primary' : 'outline'} onPress={() => setFilter('last3Years')} size='small' />
        </RNView>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Historial</Text>
  {sortedItems.map((it, idx) => (
          <View key={it.Id || idx} style={[styles.historyRow, { borderColor: Colors[colorScheme].text + '22' }]}>
            <Text style={{ color: Colors[colorScheme].text, fontWeight: '600' }}>{formatDate(it.CreatedAt)}</Text>
            <Text style={{ color: Colors[colorScheme].text + 'B3' }}>
              Peso {it.Weight || '—'} kg · Grasa {it.BodyFatPercentage || '—'}% · Cintura {it.Waist || '—'} cm · IMC {it.Bmi || computeBmi(it.Weight, it.Height) || '—'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScreenWrapper headerTitle='Estado físico' showBackButton={false}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ paddingTop: Platform.OS === 'web' ? 24 : 0, paddingBottom: 16 }}>
          <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Estado físico</Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme].text + 'B3' }]}>Consulta y actualiza tus medidas corporales</Text>
        </View>
        {error && <Text style={{ color: Colors[colorScheme].tint, marginBottom: 12 }}>{error}</Text>}
        {renderSummary()}
        {renderForm()}
        {renderHistory()}
        <View style={{ height: 80 }} />
      </ScrollView>
    </ScreenWrapper>
  );
}

export default withWebLayout(PhysicalAssessmentScreen, { defaultTab: 'physical-assessment' });

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  subtitle: { fontSize: 14 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginBottom: 16 },
  emptyTitle: { fontWeight: '600', fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  sectionTitleSm: { fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { width: '50%', marginBottom: 10 },
  label: { fontSize: 12 },
  value: { fontSize: 16, fontWeight: '600' },
  updatedAt: { fontSize: 12, marginTop: 8, marginBottom: 12 },
  formCard: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16, marginTop: 8 },
  inputLabel: { fontSize: 12, marginTop: 8 },
  input: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginTop: 6 },
  historyRow: { paddingVertical: 10, borderTopWidth: 1 },
});
