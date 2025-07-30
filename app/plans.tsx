import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import PlanView from '@/components/plan/PlanView';

export default function PlansScreen() {
  return (
    <View style={styles.container}>
      <PlanView showCurrentPlan={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
