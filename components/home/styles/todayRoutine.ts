import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeTodayRoutineStyles = (theme: 'light' | 'dark') => {
  const palette = Colors[theme];

  return StyleSheet.create({
    container: {
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      // Sombra coherente con tema (evita hex literales)
      shadowColor: palette.neutral,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 8,
    },
    completedContainer: {
      // fondo suave usando success con alfa bajo (derivado del token)
      backgroundColor: `${palette.success}1A`,
      borderLeftWidth: 4,
      borderLeftColor: palette.success,
    },
    pendingContainer: {
      backgroundColor: `${palette.warning}1A`,
      borderLeftWidth: 4,
      borderLeftColor: palette.warning,
    },
    content: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    iconContainer: { marginRight: 16 },
    textContainer: { flex: 1 },
    title: { fontSize: 14, color: palette.textMuted, marginBottom: 4 },
    routineName: {
      fontSize: 16,
      fontWeight: '600',
      color: palette.text,
      marginBottom: 4,
    },
    status: { fontSize: 14, fontWeight: '500' },
    arrowContainer: { marginLeft: 12 },
  });
};
