import React from 'react';
import { View, Text } from '@/components/Themed';
import type { RoutineAssigned } from '@/models/RoutineAssigned';
import { styles } from './styles';

interface Props { assignment: RoutineAssigned; }

const RoutineAssignedCard: React.FC<Props> = ({ assignment }) => {
  const template = assignment.RoutineTemplates?.[0];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{template?.Name || 'Rutina asignada'}</Text>
      <Text style={styles.text}>Asignada el {new Date(assignment.CreatedAt).toLocaleDateString()}</Text>
      <Text style={styles.status}>Estado: {assignment.IsActive ? 'Activa' : 'Inactiva'}</Text>
    </View>
  );
};

export default RoutineAssignedCard;
