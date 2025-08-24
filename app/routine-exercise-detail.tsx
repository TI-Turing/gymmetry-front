import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { RoutineExerciseDetail } from '@/components/routineExercise/RoutineExerciseDetail';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import Colors from '@/constants/Colors';

const makeRoutineExerciseDetailScreenStyles = (theme: 'light' | 'dark') => {
  const palette = Colors[theme];
  return {
    container: { flex: 1, backgroundColor: palette.background } as const,
    header: { padding: 12 } as const,
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: palette.text,
    } as const,
    content: { flex: 1, paddingHorizontal: 12 } as const,
  };
};

export default function RoutineExerciseDetailScreen() {
  const styles = useThemedStyles(makeRoutineExerciseDetailScreenStyles);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RoutineExercise - Detalle</Text>
      </View>
      <View style={styles.content}>
        <RoutineExerciseDetail />
      </View>
    </SafeAreaView>
  );
}
