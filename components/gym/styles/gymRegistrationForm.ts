import { StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeGymRegistrationFormStyles = (theme: ThemeMode) => {
  const isDark = theme === 'dark';
  const palette = Colors[theme];
  const colors = {
    background: palette.background,
    cardBg: isDark ? '#1E1E1E' : '#F7F7F7',
    text: palette.text,
    muted: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#333333' : '#DDDDDD',
    tint: palette.tint,
    onTint: '#FFFFFF',
  } as const;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: { marginRight: 15, padding: 5 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 30 },
    section: { padding: 20 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    infoCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 20,
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.muted,
      lineHeight: 20,
      marginLeft: 12,
    },
    buttonContainer: { padding: 20, gap: 15 },
    submitButton: { backgroundColor: colors.tint },
    cancelButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? '#666666' : '#BBBBBB',
      borderRadius: 8,
      paddingVertical: 15,
      alignItems: 'center',
    },
    cancelButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  });

  return { ...styles, colors };
};
