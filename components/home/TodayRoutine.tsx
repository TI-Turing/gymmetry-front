import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeTodayRoutineStyles } from './styles/todayRoutine';

interface TodayRoutineProps {
  routineName: string;
  hasAttended: boolean;
  onPress?: () => void;
  showTitle?: boolean; // Permite ocultar el título interno cuando el header global ya lo muestra
}

const TodayRoutine: React.FC<TodayRoutineProps> = ({
  routineName,
  hasAttended,
  onPress,
  showTitle = true,
}) => {
  const getStatusIcon = () => {
    return hasAttended ? 'check-circle' : 'clock-o';
  };

  const theme = useColorScheme();
  const palette = Colors[theme];
  const styles = useThemedStyles(makeTodayRoutineStyles);
  const getStatusColor = () => (hasAttended ? palette.tint : palette.warning);

  const getStatusText = () => {
    return hasAttended ? 'Completado' : 'Pendiente';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        hasAttended ? styles.completedContainer : styles.pendingContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name={getStatusIcon()}
            size={24}
            color={getStatusColor()}
          />
        </View>

        <View style={styles.textContainer}>
          {showTitle && <Text style={styles.title}>Rutina de Hoy</Text>}
          <Text style={styles.routineName}>{routineName}</Text>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <FontAwesome
            name="chevron-right"
            size={16}
            color={palette.textMuted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// estilos ahora provienen de styles/todayRoutine.ts

export default TodayRoutine;
