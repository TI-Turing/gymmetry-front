import { Link, Stack } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import Colors from '@/constants/Colors';

const makeNotFoundStyles = (theme: 'light' | 'dark') => {
  const palette = Colors[theme];
  return {
    container: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: 20,
      backgroundColor: palette.background,
    } as const,
    title: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: palette.text,
    } as const,
    link: { marginTop: 15, paddingVertical: 15 } as const,
    linkText: { fontSize: 14, color: palette.tint } as const,
  };
};

export default function NotFoundScreen() {
  const styles = useThemedStyles(makeNotFoundStyles);
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
