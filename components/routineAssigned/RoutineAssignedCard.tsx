import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { styles } from './styles';

interface Props { assignment: RoutineAssigned; onPress?: () => void; }

const RoutineAssignedCard: React.FC<Props> = ({ assignment, onPress }) => {
  const template = assignment.RoutineTemplates?.[0];
  const Wrapper: React.ComponentType<any> = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={styles.container}
      {...(onPress ? { onPress, activeOpacity: 0.8 } : {})}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? 'Ver rutina de hoy' : undefined}
    >
      <Text style={styles.title}>{template?.Name || 'Rutina asignada'}</Text>
      <Text style={styles.text}>Asignada el {new Date(assignment.CreatedAt).toLocaleDateString()}</Text>
      <Text style={styles.status}>Estado: {assignment.IsActive ? 'Activa' : 'Inactiva'}</Text>
      {onPress && (
        <Text style={[styles.status, { marginTop: 8, fontSize: 12, opacity: 0.8 }]}>Tocar para ver rutina de hoy</Text>
      )}
    </Wrapper>
  );
};

export default RoutineAssignedCard;
