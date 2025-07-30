import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import PlanView from '@/components/plan/PlanView';
import Colors from '@/constants/Colors';

export default function PlansModal() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planes Disponibles</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <FontAwesome name='times' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      <PlanView showCurrentPlan={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Para el notch/status bar
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 10,
  },
});
