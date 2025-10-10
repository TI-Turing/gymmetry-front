import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeNoRoutineAssignedStyles } from './styles/noRoutineAssigned';

interface NoRoutineAssignedProps {
  onSelectRoutine: () => void;
}

const NoRoutineAssigned: React.FC<NoRoutineAssignedProps> = ({
  onSelectRoutine,
}) => {
  const { styles, colors } = useThemedStyles(makeNoRoutineAssignedStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome name="calendar-plus-o" size={48} color={colors.tint} />
      </View>

      <Text style={styles.title}>No hay rutina asignada</Text>
      <Text style={styles.description}>
        Selecciona una rutina de entrenamiento para comenzar tu progreso en el
        gimnasio
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onSelectRoutine}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus-circle" size={20} color={colors.onTint} />
        <Text style={styles.buttonText}>Seleccionar una rutina</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoRoutineAssigned;
