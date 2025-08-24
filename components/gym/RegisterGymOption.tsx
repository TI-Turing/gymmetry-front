import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeGymOptionCardStyles } from './styles/optionCard';

interface RegisterGymOptionProps {
  onPress: () => void;
}

export default function RegisterGymOption({ onPress }: RegisterGymOptionProps) {
  const { styles, colors } = useThemedStyles(makeGymOptionCardStyles);
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIcon}>
        <MaterialCommunityIcons name="dumbbell" size={32} color={colors.tint} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>¿Eres el dueño de un Gym?</Text>
        <Text style={styles.optionSubtitle}>
          Registra tu gimnasio aquí y conecta con más usuarios
        </Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color={colors.chevron} />
    </TouchableOpacity>
  );
}
