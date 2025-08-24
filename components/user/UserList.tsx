import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { EntityList } from '@/components/common';
import { Colors } from '@/constants';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export function UserList() {
  const servicePlaceholder = () => Promise.resolve([]);
  const loadUsers = useCallback(async () => {
    try {
      // Placeholder for actual service call

      const result = await servicePlaceholder();

      return result || [];
    } catch (error) {
      return [];
    }
  }, []);

  const renderUserItem = useCallback(
    ({ item }: { item: any }) => (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.fullName || `${item.firstName} ${item.lastName}` || 'Usuario'}
          </Text>
          <Text style={styles.statusText}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>

        <Text style={styles.description}>
          {item.email || 'Sin email disponible'}
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{item.userType || 'Usuario'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.value}>{item.phone || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Género:</Text>
          <Text style={styles.value}>{item.gender || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>
            {item.age ||
              (item.birthDate
                ? Math.floor(
                    (Date.now() - new Date(item.birthDate).getTime()) /
                      31557600000
                  )
                : 'N/A')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha registro:</Text>
          <Text style={styles.value}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Último acceso:</Text>
          <Text style={styles.value}>
            {item.lastLogin
              ? new Date(item.lastLogin).toLocaleDateString()
              : 'Nunca'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Plan actual:</Text>
          <Text style={styles.value}>{item.currentPlan || 'Sin plan'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Gimnasio:</Text>
          <Text style={styles.value}>{item.gymName || 'N/A'}</Text>
        </View>

        {item.membership && (
          <View style={styles.membershipSection}>
            <Text style={styles.membershipLabel}>Membresía:</Text>
            <Text
              style={[
                styles.membershipStatus,
                {
                  color: item.membership.isActive ? '#ff6300' : '#FF6B35',
                },
              ]}
            >
              {item.membership.isActive ? '✓ Activa' : '✗ Inactiva'}
            </Text>
            {item.membership.expiresAt && (
              <Text style={styles.membershipExpiry}>
                Expira:{' '}
                {new Date(item.membership.expiresAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
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
      title="Usuarios"
      loadFunction={loadUsers}
      renderItem={renderUserItem}
      keyExtractor={keyExtractor}
      emptyTitle="No hay usuarios"
      emptyMessage="No se encontraron usuarios"
      loadingMessage="Cargando usuarios..."
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
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.light.tabIconDefault,
    marginBottom: SPACING.sm,
    lineHeight: 20,
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
  membershipSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.tabIconDefault + '20',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  membershipLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  membershipStatus: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  membershipExpiry: {
    fontSize: FONT_SIZES.xs,
    color: Colors.light.tabIconDefault,
    flex: 1,
  },
});

export default UserList;
