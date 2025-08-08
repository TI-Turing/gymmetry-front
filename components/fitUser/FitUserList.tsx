import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { fitUserService } from '@/services';

const FitUserList = React.memo(() => {
  const loadFitUsers = useCallback(async () => {
    const response = await fitUserService.getAllFitUsers();
    return response.Data || [];
  }, []);

FitUserList.displayName = 'FitUserList';



  const renderFitUserItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.fullName || item.name || 'Usuario sin nombre'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.email}>
          {item.email || 'Sin email configurado'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{item.age || 'N/A'} años</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Peso:</Text>
          <Text style={styles.value}>{item.weight || 'N/A'} kg</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Altura:</Text>
          <Text style={styles.value}>{item.height || 'N/A'} cm</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Objetivo:</Text>
          <Text style={styles.value}>
            {item.goal || item.fitnessGoal || 'Sin objetivo'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Nivel:</Text>
          <Text style={styles.value}>
            {item.fitnessLevel || 'Principiante'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rutinas:</Text>
          <Text style={styles.value}>{item.routineCount || 0} asignadas</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Progreso:</Text>
          <Text style={styles.value}>
            {item.progressPercentage || 0}% completado
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Inscripción:</Text>
          <Text style={styles.value}>
            {item.joinDate
              ? new Date(item.joinDate).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: any) => item.id || item.userId || String(Math.random()),
    []
  );

  return (
    <EntityList
      title='Usuarios Fitness'
      loadFunction={loadFitUsers}
      renderItem={renderFitUserItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay usuarios fitness'
      emptyMessage='No se encontraron usuarios registrados'
      loadingMessage='Cargando usuarios...'
    />
  );
}

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

export default FitUserList;
