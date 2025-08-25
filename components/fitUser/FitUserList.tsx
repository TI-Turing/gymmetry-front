import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { fitUserService } from '@/services';
import { normalizeCollection } from '@/utils';

const FitUserList = React.memo(() => {
  const loadFitUsers = useCallback(async () => {
    const response = await fitUserService.getAllUsers();
    const items = normalizeCollection<unknown>(response?.Data);
    return items;
  }, []);

  const renderFitUserItem = useCallback(({ item }: { item: unknown }) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const fullName =
      (r['fullName'] as string) ||
      (r['name'] as string) ||
      'Usuario sin nombre';
    const isActive =
      (r['isActive'] as boolean) ?? (r['IsActive'] as boolean) ?? false;
    const email =
      (r['email'] as string) ??
      (r['Email'] as string) ??
      'Sin email configurado';
    const age = (r['age'] as number) ?? null;
    const weight = (r['weight'] as number) ?? null;
    const height = (r['height'] as number) ?? null;
    const goal =
      (r['goal'] as string) || (r['fitnessGoal'] as string) || 'Sin objetivo';
    const fitnessLevel = (r['fitnessLevel'] as string) ?? 'Principiante';
    const routineCount = (r['routineCount'] as number) ?? 0;
    const progressPercentage = (r['progressPercentage'] as number) ?? 0;
    const joinDate = (r['joinDate'] as string) ?? null;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{fullName}</Text>
          <Text style={styles.statusText}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.email}>{email}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{age ?? 'N/A'} años</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{weight ?? 'N/A'} kg</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{height ?? 'N/A'} cm</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Objetivo:</Text>
          <Text style={styles.value}>{goal}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel:</Text>
          <Text style={styles.value}>{fitnessLevel}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rutinas:</Text>
          <Text style={styles.value}>{routineCount} asignadas</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Progreso:</Text>
          <Text style={styles.value}>{progressPercentage}% completado</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Inscripción:</Text>
          <Text style={styles.value}>
            {joinDate ? new Date(joinDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: unknown) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const id =
      (r['Id'] as string) ||
      (r['id'] as string) ||
      (r['UserId'] as string) ||
      (r['userId'] as string) ||
      null;
    return id ?? String(Math.random());
  }, []);

  return (
    <EntityList
      title="Usuarios Fitness"
      loadFunction={loadFitUsers}
      renderItem={renderFitUserItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay usuarios fitness"
      emptyMessage="No se encontraron usuarios registrados"
      loadingMessage="Cargando usuarios..."
    />
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
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.light.tabIconSelected,
    color: Colors.light.background,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconSelected,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.text,
    flex: 1,
  },
});

FitUserList.displayName = 'FitUserList';

export default FitUserList;
