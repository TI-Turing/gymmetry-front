import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import Colors from '@/constants/Colors';

const makeModalStyles = (theme: 'light' | 'dark') => {
  const palette = Colors[theme];
  const border = theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#eee';
  return {
    container: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: palette.background,
    } as const,
    title: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: palette.text,
    } as const,
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
      backgroundColor: border,
    } as const,
  };
};

export default function ModalScreen() {
  const styles = useThemedStyles(makeModalStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}
