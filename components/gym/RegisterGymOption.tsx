import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '@/constants/Colors';

interface RegisterGymOptionProps {
  onPress: () => void;
}

export default function RegisterGymOption({ onPress }: RegisterGymOptionProps) {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIcon}>
        <MaterialCommunityIcons
          name='dumbbell'
          size={32}
          color={Colors.dark.tint}
        />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>¿Eres el dueño de un Gym?</Text>
        <Text style={styles.optionSubtitle}>
          Registra tu gimnasio aquí y conecta con más usuarios
        </Text>
      </View>
      <FontAwesome name='chevron-right' size={16} color='#B0B0B0' />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 8,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
  },
});
