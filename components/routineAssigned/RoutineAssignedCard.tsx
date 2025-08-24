import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { styles } from './styles';

interface Props {
  assignment: RoutineAssigned;
  onPress?: () => void;
}

const RoutineAssignedCard: React.FC<Props> = ({ assignment, onPress }) => {
  // Backend a veces devuelve la plantilla como "RoutineTemplate" (objeto) o como
  // colección "RoutineTemplates" (array). Fallback al primer elemento si existe.
  type ShortTpl = { Name: string; Premium?: boolean };
  const templateObj = (assignment as unknown as {
    RoutineTemplate?: ShortTpl;
    RoutineTemplates?: ShortTpl[];
  }) || { RoutineTemplate: undefined, RoutineTemplates: undefined };
  const template: Partial<ShortTpl> | null =
    templateObj.RoutineTemplate || templateObj.RoutineTemplates?.[0] || null;
  const createdAtDate = assignment?.CreatedAt
    ? new Date(assignment.CreatedAt)
    : null;
  const content = (
    <View
      style={styles.container}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? 'Ver rutina de hoy' : undefined}
    >
      <View style={styles.badgeRow}>
        <Text style={styles.title}>{template?.Name || 'Rutina asignada'}</Text>
        {template && (
          <Text
            style={[
              styles.badge,
              template.Premium ? styles.badgePremium : styles.badgeFree,
            ]}
          >
            {template.Premium ? 'Premium' : 'Gratis'}
          </Text>
        )}
      </View>
      {createdAtDate && (
        <Text style={styles.text}>
          Asignada el {createdAtDate.toLocaleDateString()}
        </Text>
      )}
      <Text style={styles.status}>
        Estado: {assignment.IsActive ? 'Activa' : 'Inactiva'}
      </Text>
      {onPress && (
        <Text
          style={[styles.status, { marginTop: 8, fontSize: 12, opacity: 0.8 }]}
        >
          Tocar para ver rutina de hoy
        </Text>
      )}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

export default RoutineAssignedCard;
