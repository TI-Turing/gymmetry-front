import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeNoPlanActiveStyles } from './styles/noPlanActive';

const NoPlanActive: React.FC = () => {
  const { styles, colors } = useThemedStyles(makeNoPlanActiveStyles);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name="calendar-times-o"
          size={48}
          color={colors.textMuted}
        />
      </View>

      <Text style={styles.title}>No tienes un plan activo</Text>
      <Text style={styles.description}>
        Contacta con tu gimnasio para activar un plan de entrenamiento
        personalizado
      </Text>
    </View>
  );
};

export default NoPlanActive;
