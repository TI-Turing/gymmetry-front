import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { exerciseService } from '@/services';

interface ExerciseListProps {
  onSelect?: (exercise: any) => void;
  enableSearch?: boolean;
  debounceMs?: number;
  containerStyle?: any;
  dark?: boolean;
  limit?: number;
  staticRender?: boolean;
  remoteSearch?: boolean; // si true, no carga inicial, busca al escribir
  remoteMinChars?: number;
  findFunction?: (query: string) => Promise<any[]>; // alternativa personalizada
  suggestionStyle?: boolean; // si true muestra resultados estilo sugerencias bajo el input (como ExerciseDetailScreen)
}

const normalizeExercises = (list: any[]) => {
  return list.map((e: any) => {
    const category = e.category || e.Category || e.CategoryName || e.CategoryExercise?.Name;
    return {
      _original: e,
      id: e.id || e.Id || e.ID || e.exerciseId || undefined,
      name: e.name || e.Name || 'Ejercicio sin nombre',
      description: e.description || e.Description || '',
      difficulty: e.difficulty || e.Difficulty || 'Intermedio',
      category: category || 'General',
      targetMuscles: e.targetMuscles || e.TargetMuscles || e.Muscles || 'N/A',
      equipment: e.equipment || e.Equipment || 'Sin equipamiento',
      duration: e.duration || e.Duration || 'Variable',
      caloriesBurned: e.caloriesBurned || e.CaloriesBurned || 0,
      routineCount: e.routineCount || e.RoutineCount || 0,
    };
  });
};

const ExerciseList = React.memo((props: ExerciseListProps) => {
  const {
    onSelect,
    enableSearch = true,
    debounceMs = 250,
    containerStyle,
    dark,
    limit,
    staticRender,
    remoteSearch = false,
    remoteMinChars = 2,
    findFunction,
    suggestionStyle = false,
  } = props;

  const [query, setQuery] = useState('');
  const [internalQuery, setInternalQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!enableSearch) return;
    const h = setTimeout(() => setInternalQuery(query), debounceMs);
    return () => clearTimeout(h);
  }, [query, debounceMs, enableSearch]);

  // Modo sugerencias: gestionar búsqueda manual (sin EntityList)
  React.useEffect(() => {
    if (!remoteSearch || !suggestionStyle) return;
    const term = internalQuery.trim();
    setError(null);
    if (term.length < remoteMinChars) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const run = async () => {
      try {
        let rawList: any[] = [];
        if (findFunction) {
          rawList = await findFunction(term);
        } else if ((exerciseService as any).findExercisesByFields) {
          const res: any = await (exerciseService as any).findExercisesByFields({ Name: term });
          if (res?.Success && res.Data) {
            const data: any = res.Data as any;
            rawList = Array.isArray(data) ? data : (data?.$values || []);
          }
        }
        let normalized = normalizeExercises(rawList || []);
        if (limit && normalized.length > limit) normalized = normalized.slice(0, limit);
        if (!cancelled) setSuggestions(normalized);
      } catch (e) {
        if (!cancelled) setError('Error al buscar');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const t = setTimeout(run, 350); // debounce adicional específico UI
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [internalQuery, remoteSearch, suggestionStyle, remoteMinChars, findFunction, limit]);

  const loadExercises = useCallback(async () => {
    // Modo remoto: sólo buscar cuando hay suficientes caracteres
    if (remoteSearch) {
      const term = internalQuery.trim();
      if (term.length < remoteMinChars) return [];
      try {
        let rawList: any[] = [];
        if (findFunction) {
          rawList = await findFunction(term);
        } else if ((exerciseService as any).findExercisesByFields) {
          const res: any = await (exerciseService as any).findExercisesByFields({ Name: term });
          if (res?.Success && res.Data) {
            const data: any = res.Data as any;
            rawList = Array.isArray(data) ? data : (data?.$values || []);
          }
        } else {
          const res = await exerciseService.getAllExercises();
          if (res?.Success) {
            const raw = res.Data;
            const anyRaw: any = raw as any;
            rawList = Array.isArray(anyRaw) ? anyRaw : (anyRaw?.$values || []);
          }
          rawList = rawList.filter((e: any) => (e.Name || e.name || '').toLowerCase().includes(term.toLowerCase()));
        }
        let normalized = normalizeExercises(rawList || []);
        if (limit && normalized.length > limit) normalized = normalized.slice(0, limit);
        return normalized;
      } catch (e) {
        return [];
      }
    }

    // Modo local (eager): cargar todos y filtrar
    const response = await exerciseService.getAllExercises();
    const raw: any = response.Success ? response.Data : [];
    let list: any[] = Array.isArray(raw) ? raw : (raw?.$values || []);
    if (!Array.isArray(list)) list = [];
    let normalized = normalizeExercises(list);
    if (internalQuery.trim()) {
      const q = internalQuery.trim().toLowerCase();
      normalized = normalized.filter(n => n.name.toLowerCase().includes(q));
    }
    if (limit && normalized.length > limit) normalized = normalized.slice(0, limit);
    return normalized;
  }, [remoteSearch, internalQuery, remoteMinChars, findFunction, limit]);

  const renderExerciseItem = useCallback(
    ({ item }: { item: any }) => {
      const data = item._original ? item : { _original: item, ...item };
      const Wrapper: any = onSelect ? TouchableOpacity : View;
      return (
        <Wrapper
          style={[styles.card, dark && styles.cardDark]}
          onPress={onSelect ? () => onSelect(data._original) : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.statusText}>{data.difficulty}</Text>
          </View>
          <Text style={[styles.description, dark && styles.descriptionDark]}>
            {data.description || 'Sin descripción disponible'}
          </Text>
          <View style={styles.row}>
            <Text style={styles.label}>Categoría:</Text>
            <Text style={styles.value}>{data.category}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Músculos:</Text>
            <Text style={styles.value}>{data.targetMuscles}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Equipamiento:</Text>
            <Text style={styles.value}>{data.equipment}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Duración:</Text>
            <Text style={styles.value}>{data.duration}</Text>
          </View>
            <View style={styles.row}>
              <Text style={styles.label}>Calorías:</Text>
              <Text style={styles.value}>{data.caloriesBurned} kcal/min</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Usado en:</Text>
              <Text style={styles.value}>{data.routineCount} rutinas</Text>
            </View>
        </Wrapper>
      );
    },
    [onSelect, dark]
  );

  const keyExtractor = useCallback((item: any, index?: number) => {
    const id = item.id || item.Id || item.ID || (item._original && (item._original.Id || item._original.id));
    return id ? String(id) : `idx_${index}`;
  }, []);

  const minCharsNotMet = remoteSearch && internalQuery.trim().length < remoteMinChars;

  const searchBox = enableSearch ? (
    <RNView style={styles.searchContainer}>
      <TextInput
        placeholder={remoteSearch ? `Buscar ejercicio... (min ${remoteMinChars})` : 'Buscar ejercicio...'}
        placeholderTextColor={dark ? '#888' : '#666'}
        style={[styles.searchInput, dark && styles.searchInputDark]}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      {remoteSearch && (
        <Text style={styles.helperText}>
          {minCharsNotMet
            ? `Escribe al menos ${remoteMinChars} caracteres para buscar`
            : 'Mostrando resultados de la búsqueda'}
        </Text>
      )}
    </RNView>
  ) : null;

  // Render sugerencias estilo ExerciseDetailScreen
  if (remoteSearch && suggestionStyle) {
    return (
      <RNView style={containerStyle}>
        {searchBox}
        {error && <Text style={{ color: '#FF6B35', marginBottom: 8 }}>{error}</Text>}
        {minCharsNotMet ? (
          <Text style={styles.helperText}>{`Escribe al menos ${remoteMinChars} caracteres`}</Text>
        ) : loading ? (
          <Text style={styles.helperText}>Buscando...</Text>
        ) : suggestions.length > 0 ? (
          <RNView style={styles.suggestionsCard}>
            {suggestions.map((ex, idx) => {
              const id = ex.id || (ex._original && (ex._original.id || ex._original.Id)) || idx;
              const name = ex.name;
              const category = (ex._original?.CategoryExercise?.Name) || ex.category;
              return (
                <TouchableOpacity
                  key={id}
                  style={styles.suggestionRow}
                  onPress={() => {
                    onSelect?.(ex._original || ex);
                    setQuery('');
                    setSuggestions([]);
                  }}
                >
                  <Text style={styles.suggestionTitle}>{name}</Text>
                  {category ? <Text style={styles.suggestionSub}>{category}</Text> : null}
                </TouchableOpacity>
              );
            })}
          </RNView>
        ) : internalQuery.trim().length >= remoteMinChars ? (
          <Text style={styles.helperText}>Sin resultados.</Text>
        ) : null}
      </RNView>
    );
  }

  return (
    <RNView style={containerStyle}>
      {searchBox}
      <EntityList
        title='Ejercicios'
        loadFunction={loadExercises}
        renderItem={renderExerciseItem}
        keyExtractor={keyExtractor}
        emptyTitle={minCharsNotMet ? 'Ingresa texto' : 'Sin resultados'}
        loadingMessage='Buscando ejercicios...'
        dependencies={[internalQuery, limit, remoteSearch]}
        showRefreshButton={false}
        useFlatList={!staticRender}
      />
    </RNView>
  );
});
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardDark: {
    backgroundColor: '#262626'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20
  },
  descriptionDark: {
    color: '#B0B0B0'
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 100
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1

  },
  searchContainer: { marginBottom: SPACING.sm },
  searchInput: { backgroundColor: '#EFEFEF', borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 8, color: '#000' },
  searchInputDark: { backgroundColor: '#262626', color: '#FFF' },
  helperText: { marginTop: 4, fontSize: FONT_SIZES.xs, color: Colors.light.tabIconDefault },
  // estilos de sugerencias (similar a ExerciseDetailScreen dark variant)
  suggestionsCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 12,
    overflow: 'hidden'
  },
  suggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A'
  },
  suggestionTitle: { color: '#FFF', fontWeight: '600' },
  suggestionSub: { color: '#AAA', fontSize: 12, marginTop: 2 },
});

ExerciseList.displayName = 'ExerciseList';

export default ExerciseList;
