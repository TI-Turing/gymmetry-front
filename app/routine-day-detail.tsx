import React from 'react';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { View, Text } from '@/components/Themed';
import { RoutineDayDetail } from '@/components/routineDay/RoutineDayDetail';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';

const makeRoutineDetailScreenStyles = (theme: 'light' | 'dark') => {
  const palette = Colors[theme];
  const border = theme === 'dark' ? '#00000033' : '#E5E7EB';
  return {
    container: { flex: 1, backgroundColor: 'transparent' } as const,
    header: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: border,
    } as const,
    closeButton: { padding: 8 } as const,
    headerTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: palette.text,
    } as const,
    placeholder: { width: 40 } as const,
    content: { flex: 1 } as const,
    colors: { text: palette.text },
  };
};

export default function RoutineDayDetailScreen() {
  const theme = useColorScheme();
  const styles = useThemedStyles(makeRoutineDetailScreenStyles);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de cerrar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="times" size={24} color={styles.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Rutina</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <RoutineDayDetail />
      </View>
    </SafeAreaView>
  );
}
