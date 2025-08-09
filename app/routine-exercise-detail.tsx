import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { RoutineExerciseDetail } from '@/components/routineExercise/RoutineExerciseDetail';

export default function RoutineExerciseDetailScreen() {
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 12 },
});
