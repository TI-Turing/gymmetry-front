import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';
import { userFunctionsService } from '@/services/functions';
import { User } from '@/models/User';

export function UserList() {
  const loadUsers = useCallback(async () => {
    const response = await userFunctionsService.getAllUsers();
    return response.Data || [];
  }, []);

  const renderUserItem = useCallback(
    ({ item }: { item: User }) => (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.Name || 'Sin nombre'}</Text>
        {item.LastName && (
          <Text style={styles.cardSubtitle}>{item.LastName}</Text>
        )}
        {item.Email && <Text style={styles.cardEmail}>{item.Email}</Text>}
        {item.Phone && <Text style={styles.cardPhone}>{item.Phone}</Text>}
        {item.UserName && (
          <Text style={styles.cardUsername}>@{item.UserName}</Text>
        )}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback(
    (item: User) => item.Id || String(Math.random()),
    []
  );

  return (
    <EntityList<User>
      title='Usuarios'
      loadFunction={loadUsers}
      renderItem={renderUserItem}
      keyExtractor={keyExtractor}
      emptyTitle='No hay usuarios'
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
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    color: Colors.light.text,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.text,
    marginBottom: SPACING.xs,
  },
  cardEmail: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.xs,
  },
  cardPhone: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.xs,
  },
  cardUsername: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconSelected,
    fontStyle: 'italic',
  },
});
export default styles;
