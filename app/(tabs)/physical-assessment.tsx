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
import Svg, { Polyline, Circle } from 'react-native-svg';

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

function computeBmiNumber(weightKgStr: string, heightCmStr: string): number | null {
  const w = parseFloat(String(weightKgStr).replace(',', '.'));
  const hcm = parseFloat(String(heightCmStr).replace(',', '.'));
  if (!isFinite(w) || !isFinite(hcm) || hcm <= 0 || w <= 0) return null;
  const hm = hcm / 100;
  return w / (hm * hm);
}

type TrendPoint = { x: Date; y: number };

function TrendChart({
  data,
  title,
  color,
}: {
  data: TrendPoint[];
  title: string;
  color: string;
}) {
  if (!data || data.length < 2) {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '600' }}>{title}</Text>
        <Text style={{ opacity: 0.7 }}>Sin datos suficientes</Text>
      </View>
    );
  }

  const width = 100;
  const height = 40;
  const values = data.map(p => p.y).filter(v => isFinite(v));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = data.length > 1 ? width / (data.length - 1) : width;
  const points = data.map((p, i) => {
    const x = i * stepX;
    const norm = (p.y - min) / span; // 0..1
    const y = height - norm * height; // invertir eje Y
    return `${x},${y}`;
  });

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: '600', marginBottom: 6 }}>{title}</Text>
      <Svg width='100%' height={height} viewBox={`0 0 ${width} ${height}`}>
        <Polyline points={points.join(' ')} fill='none' stroke={color} strokeWidth={1.5} />
        {data.length <= 24 &&
          data.map((p, i) => {
            const x = i * stepX;
            const norm = (p.y - min) / span;
            const y = height - norm * height;
            return <Circle key={i} cx={x} cy={y} r={1.2} fill={color} />;
          })}
      </Svg>
    </View>
  );
}

function PhysicalAssessmentScreen() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PhysicalAssessment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'last6Months' | 'lastYear' | 'last2Years'>('all');

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const getTimeSafe = (iso?: string | null): number => {
    if (!iso) return 0;
    const t = new Date(iso as string).getTime();
    return Number.isFinite(t) ? t : 0;
  };
  const isZeroOrEmpty = (s?: string | null) => {
    if (s == null) return true;
    const n = parseFloat(String(s).replace(',', '.'));
    return !isFinite(n) || n === 0;
  };
  const displayNum = (s?: string | null) => (isZeroOrEmpty(s) ? '—' : s);
  const getYearLabel = (iso?: string | null): string => {
    const t = getTimeSafe(iso);
    if (!t) return 'Sin fecha';
    return String(new Date(t).getFullYear());
  };

  // Sanitizador de entrada numérica: reemplaza coma por punto, solo dígitos y un punto
  const sanitizeNumericInput = (input: string) => {
    if (!input) return '';
    let s = String(input).replace(/,/g, '.');
    s = s.replace(/[^0-9.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
    }
    if (s.startsWith('.')) s = '0' + s;
    return s;
  };
  const onChangeNumeric = (setter: (v: string) => void) => (text: string) => setter(sanitizeNumericInput(text));
  const fromZeroToEmpty = (s?: string | null) => {
    if (s == null) return '';
    const n = parseFloat(String(s).replace(',', '.'));
    if (!Number.isFinite(n)) return '';
    return n === 0 ? '' : String(s);
  };

  const toNum = (s: string): number | null => {
    if (!s) return null;
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : null;
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    const h = toNum(height);
    const w = toNum(weight);
    const bf = toNum(bodyFat);
    const mm = toNum(muscleMass);
    const bounds = {
      perMin: 10,
      perMax: 200,
    };
  // Opcionales con rangos si vienen
  if (h != null && h !== 0 && (h < 80 || h > 250)) errs.Height = 'Entre 80 y 250 cm';
  if (w != null && w !== 0 && (w < 20 || w > 400)) errs.Weight = 'Entre 20 y 400 kg';
    // % grasa opcional
    if (bf != null && (bf < 3 || bf > 70)) errs.BodyFatPercentage = 'Entre 3% y 70%';
    // masa muscular opcional (solo no-negativa y razonable <= 100 si es %)
    if (mm != null && (mm < 0 || mm > 100)) errs.MuscleMass = '0 a 100';
    // Perímetros opcionales
    const perimeters: Array<[string, string]> = [
      ['Waist', waist],
      ['Chest', chest],
      ['Hips', hips],
      ['Neck', neck],
      ['Shoulders', shoulders],
      ['Wrist', wrist],
      ['LeftArm', leftArm],
      ['RighArm', righArm],
      ['LeftForearm', leftForearm],
      ['RightForearm', rightForearm],
      ['LeftThigh', leftThigh],
      ['RightThigh', rightThigh],
      ['LeftCalf', leftCalf],
      ['RightCalf', rightCalf],
      ['Abdomen', abdomen],
      ['UpperBack', upperBack],
      ['LowerBack', lowerBack],
    ];
    perimeters.forEach(([key, val]) => {
      const n = toNum(val);
  if (n != null && n !== 0 && (n < bounds.perMin || n > bounds.perMax)) {
        errs[key] = `${bounds.perMin} a ${bounds.perMax} cm`;
      }
    });
    setFieldErrors(errs);
    return errs;
  };

  const latest = useMemo(() => {
    if (!items || items.length === 0) return null as PhysicalAssessment | null;
    // Tomar el más reciente por CreatedAt
  const sorted = [...items].sort((a, b) => (getTimeSafe(b.CreatedAt) - getTimeSafe(a.CreatedAt)));
    return sorted[0];
  }, [items]);

  // Regla de 30 días eliminada: siempre se puede actualizar

  const filteredItems = useMemo(() => items, [items]);
  const sortedItems = useMemo(() => {
    const arr = Array.isArray(filteredItems) ? [...filteredItems] : [];
  arr.sort((a, b) => getTimeSafe(b.CreatedAt) - getTimeSafe(a.CreatedAt));
    return arr;
  }, [filteredItems]);

  const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Inicializar colapsado por año: año más reciente abierto, otros cerrados
  const years = Array.from(new Set(sortedItems.map(it => getYearLabel(it.CreatedAt))));
    if (years.length === 0) return;
    const mostRecent = years[0]; // sortedItems ya viene descendente, el primero es el más reciente
    setCollapsedYears(prev => {
      const next: Record<string, boolean> = {};
      years.forEach(y => {
        next[y] = y !== mostRecent; // abrir más reciente, colapsar otros
      });
      return next;
    });
  }, [sortedItems]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.getUserData();
      // Armar body para filtrar desde backend
      const body: Record<string, any> = { UserId: user?.id || '' };
      const now = new Date();
      if (filter === 'last6Months') {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 6);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        body.CreatedAtFrom = start.toISOString();
        body.CreatedAtTo = end.toISOString();
      } else if (filter === 'lastYear') {
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        body.CreatedAtFrom = start.toISOString();
        body.CreatedAtTo = end.toISOString();
      } else if (filter === 'last2Years') {
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 2);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
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
      setHeight(fromZeroToEmpty(latest.Height));
      setWeight(fromZeroToEmpty(latest.Weight));
      setBodyFat(fromZeroToEmpty(latest.BodyFatPercentage));
      setWaist(fromZeroToEmpty(latest.Waist));
      setChest(fromZeroToEmpty(latest.Chest));
      setHips(fromZeroToEmpty(latest.Hips));
      setLeftArm(fromZeroToEmpty(latest.LeftArm));
      setRighArm(fromZeroToEmpty(latest.RighArm));
      setLeftForearm(fromZeroToEmpty(latest.LeftForearm));
      setRightForearm(fromZeroToEmpty(latest.RightForearm));
      setLeftThigh(fromZeroToEmpty(latest.LeftThigh));
      setRightThigh(fromZeroToEmpty(latest.RightThigh));
      setLeftCalf(fromZeroToEmpty(latest.LeftCalf));
      setRightCalf(fromZeroToEmpty(latest.RightCalf));
      setAbdomen(fromZeroToEmpty(latest.Abdomen));
      setUpperBack(fromZeroToEmpty(latest.UpperBack));
      setLowerBack(fromZeroToEmpty(latest.LowerBack));
      setNeck(fromZeroToEmpty(latest.Neck));
      setShoulders(fromZeroToEmpty(latest.Shoulders));
      setWrist(fromZeroToEmpty(latest.Wrist));
      setMuscleMass(fromZeroToEmpty(latest.MuscleMass));
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
      const errs = validateForm();
      if (Object.keys(errs).length > 0) {
        setLoading(false);
        return;
      }
      const user = await authService.getUserData();
      const bmiRaw = computeBmi(weight, height);
      const bmi = isZeroOrEmpty(bmiRaw) ? '0' : bmiRaw;
      const orZero = (v: string) => (v?.trim().length ? v : '0');
      const req: any = {
        Height: orZero(height),
        Weight: orZero(weight),
        BodyFatPercentage: orZero(bodyFat),
        Waist: orZero(waist),
        Chest: orZero(chest),
        Hips: orZero(hips),
        Bmi: bmi,
        LeftArm: orZero(leftArm),
        RighArm: orZero(righArm),
        LeftForearm: orZero(leftForearm),
        RightForearm: orZero(rightForearm),
        LeftThigh: orZero(leftThigh),
        RightThigh: orZero(rightThigh),
        LeftCalf: orZero(leftCalf),
        RightCalf: orZero(rightCalf),
        Abdomen: orZero(abdomen),
        UpperBack: orZero(upperBack),
        LowerBack: orZero(lowerBack),
        Neck: orZero(neck),
        Shoulders: orZero(shoulders),
        Wrist: orZero(wrist),
        MuscleMass: orZero(muscleMass),
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
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Peso</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.Weight)} kg</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Altura</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.Height)} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Grasa</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.BodyFatPercentage)} %</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>IMC</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{(() => { const raw = latest.Bmi || computeBmi(latest.Weight || '', latest.Height || ''); return isZeroOrEmpty(raw) ? '—' : raw; })()}</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Cintura</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.Waist)} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Pecho</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.Chest)} cm</Text></View>
          <View style={styles.item}><Text style={[styles.label, { color: Colors[colorScheme].text + 'B3' }]}>Cadera</Text><Text style={[styles.value, { color: Colors[colorScheme].text }]}>{displayNum(latest.Hips)} cm</Text></View>
        </RNView>
  <Text style={[styles.updatedAt, { color: Colors[colorScheme].text + 'B3' }]}>Última actualización: {formatDate(latest.UpdatedAt ?? latest.CreatedAt)}</Text>
  <Button title='Actualizar evaluación' onPress={openForm} />
      </View>
    );
  };

  const renderForm = () => {
    if (!formOpen) return null;
    const errs = fieldErrors;
    const hasErrors = Object.keys(errs).length > 0;
  const requiredMissing = false;
    return (
      <View style={[styles.formCard, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Evaluación física</Text>
        {/* Línea 1 */}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Peso (kg)</Text>
  <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={weight} onChangeText={onChangeNumeric(setWeight)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Weight ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Weight}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Altura (cm)</Text>
  <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={height} onChangeText={onChangeNumeric(setHeight)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Height ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Height}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Grasa corporal (%)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={bodyFat} onChangeText={onChangeNumeric(setBodyFat)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.BodyFatPercentage ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.BodyFatPercentage}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Masa muscular</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={muscleMass} onChangeText={onChangeNumeric(setMuscleMass)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.MuscleMass ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.MuscleMass}</Text> : null}
        {/* Línea 2 */}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cintura (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={waist} onChangeText={onChangeNumeric(setWaist)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Waist ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Waist}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={chest} onChangeText={onChangeNumeric(setChest)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Chest ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Chest}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cadera (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={hips} onChangeText={onChangeNumeric(setHips)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Hips ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Hips}</Text> : null}
        {/* Brazos */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Brazos</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Brazo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftArm} onChangeText={onChangeNumeric(setLeftArm)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.LeftArm ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.LeftArm}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Brazo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={righArm} onChangeText={onChangeNumeric(setRighArm)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.RighArm ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.RighArm}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Antebrazo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftForearm} onChangeText={onChangeNumeric(setLeftForearm)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.LeftForearm ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.LeftForearm}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Antebrazo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightForearm} onChangeText={onChangeNumeric(setRightForearm)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.RightForearm ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.RightForearm}</Text> : null}
        {/* Piernas */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Piernas</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muslo izquierdo (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftThigh} onChangeText={onChangeNumeric(setLeftThigh)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.LeftThigh ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.LeftThigh}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muslo derecho (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightThigh} onChangeText={onChangeNumeric(setRightThigh)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.RightThigh ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.RightThigh}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pantorrilla izquierda (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={leftCalf} onChangeText={onChangeNumeric(setLeftCalf)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.LeftCalf ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.LeftCalf}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Pantorrilla derecha (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={rightCalf} onChangeText={onChangeNumeric(setRightCalf)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.RightCalf ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.RightCalf}</Text> : null}
        {/* Espalda y otros */}
        <Text style={[styles.sectionTitleSm, { color: Colors[colorScheme].text, marginTop: 12 }]}>Espalda y otros</Text>
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Abdomen (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={abdomen} onChangeText={onChangeNumeric(setAbdomen)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Abdomen ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Abdomen}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Espalda alta (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={upperBack} onChangeText={onChangeNumeric(setUpperBack)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.UpperBack ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.UpperBack}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Espalda baja (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={lowerBack} onChangeText={onChangeNumeric(setLowerBack)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.LowerBack ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.LowerBack}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Cuello (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={neck} onChangeText={onChangeNumeric(setNeck)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Neck ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Neck}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Hombros (cm)</Text>
     <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={shoulders} onChangeText={onChangeNumeric(setShoulders)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Shoulders ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Shoulders}</Text> : null}
        <Text style={[styles.inputLabel, { color: Colors[colorScheme].text + 'B3' }]}>Muñeca (cm)</Text>
        <TextInput style={[styles.input, { backgroundColor: Colors[colorScheme].background, color: Colors[colorScheme].text }]} value={wrist} onChangeText={onChangeNumeric(setWrist)} onBlur={validateForm} keyboardType='decimal-pad' />
        {errs.Wrist ? <Text style={[styles.errorText, { color: Colors[colorScheme].tint }]}>{errs.Wrist}</Text> : null}
        <RNView style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Button title='Guardar' onPress={submitForm} disabled={loading || hasErrors || requiredMissing} />
          <Button title='Cancelar' onPress={() => setFormOpen(false)} variant='secondary' />
        </RNView>
      </View>
    );
  };

  const renderHistory = () => {
    if (!items.length) return null;
    // Construir series de tendencia usando sortedItems (aplica filtros actuales)
    const weightSeries: TrendPoint[] = sortedItems
      .map(it => { const t = getTimeSafe(it.CreatedAt); const y = parseFloat(String(it.Weight || '').replace(',', '.')); return t && isFinite(y) && y > 0 ? { x: new Date(t), y } : null; })
      .filter((p): p is TrendPoint => !!p);
    const bmiSeries: TrendPoint[] = sortedItems
      .map(it => {
  const n = computeBmiNumber(it.Weight || '', it.Height || '');
    const t = getTimeSafe(it.CreatedAt);
    return n && t ? { x: new Date(t), y: n } : null;
      })
      .filter((p): p is TrendPoint => !!p);
    // Agrupar por año
  const groups = sortedItems.reduce((acc: Record<string, PhysicalAssessment[]>, it) => {
  const y = getYearLabel(it.CreatedAt);
      (acc[y] ||= []).push(it);
      return acc;
    }, {});

    const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

    return (
      <View style={[styles.card, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
        <RNView style={{ flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <Button title='Todos' variant={filter === 'all' ? 'primary' : 'outline'} onPress={() => setFilter('all')} size='small' />
          <Button title='Últimos 6 meses' variant={filter === 'last6Months' ? 'primary' : 'outline'} onPress={() => setFilter('last6Months')} size='small' />
          <Button title='Último año' variant={filter === 'lastYear' ? 'primary' : 'outline'} onPress={() => setFilter('lastYear')} size='small' />
          <Button title='Últimos 2 años' variant={filter === 'last2Years' ? 'primary' : 'outline'} onPress={() => setFilter('last2Years')} size='small' />
        </RNView>
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Historial</Text>
        <View style={[styles.trendCard, { borderColor: Colors[colorScheme].text + '22', borderWidth: 1 }]}>
          <TrendChart title='Tendencia de peso (kg)' data={weightSeries} color={Colors[colorScheme].tint} />
          <TrendChart title='Tendencia de IMC' data={bmiSeries} color={Colors[colorScheme].text} />
        </View>
        {years.map(year => {
          const isCollapsed = !!collapsedYears[year];
          const list = groups[year] || [];
          return (
            <View key={year} style={{ marginBottom: 8 }}>
              <RNView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: Colors[colorScheme].text, fontWeight: '700', fontSize: 16 }}>{year} <Text style={{ color: Colors[colorScheme].text + '80', fontWeight: '400' }}>({list.length})</Text></Text>
                <Button
                  title={isCollapsed ? 'Mostrar' : 'Ocultar'}
                  variant='outline'
                  size='small'
                  onPress={() => setCollapsedYears(prev => ({ ...prev, [year]: !isCollapsed }))}
                />
              </RNView>
              {!isCollapsed && (
                <View>
                  {list.map((it, idx) => (
                    <View key={it.Id || idx} style={[styles.historyRow, { borderColor: Colors[colorScheme].text + '22' }]}>
                      <Text style={{ color: Colors[colorScheme].text, fontWeight: '600' }}>{formatDate(it.CreatedAt)}</Text>
                      <Text style={{ color: Colors[colorScheme].text + 'B3' }}>
                        Peso {displayNum(it.Weight)} kg · Grasa {displayNum(it.BodyFatPercentage)}% · Cintura {displayNum(it.Waist)} cm · IMC {(() => { const raw = it.Bmi || computeBmi(it.Weight || '', it.Height || ''); return isZeroOrEmpty(raw) ? '—' : raw; })()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
  errorText: { fontSize: 12, marginTop: 4 },
  historyRow: { paddingVertical: 10, borderTopWidth: 1 },
  trendCard: { backgroundColor: '#1E1E1E', borderRadius: 12, padding: 12, marginBottom: 12 },
});
