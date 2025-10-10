import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { makeNoDisciplineDataStyles } from './styles/noDisciplineData';

const NoDisciplineData: React.FC = () => {
  const { styles, colors } = useThemedStyles(makeNoDisciplineDataStyles);
  // Ejemplo de uso futuro:
  // const planInfo = usePlanState();
  // const isFreePlan = planInfo?.IsFallbackFreePlan ?? true;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome
          name="line-chart"
          size={48}
          color={colors.textMuted}
        />
      </View>

      <Text style={styles.title}>Aún no tienes datos de disciplina</Text>
      <Text style={styles.description}>
        Completa entrenamientos para comenzar a rastrear tu consistencia y
        disciplina
      </Text>
    </View>
  );
};

export default NoDisciplineData;
