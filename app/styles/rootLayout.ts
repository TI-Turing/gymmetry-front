import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRootLayoutStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const overlay = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)';
  const cardBg = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';
  const inputBg = theme === 'dark' ? '#2A2A2A' : '#F2F2F2';
  const muted = theme === 'dark' ? '#bbb' : '#666';
  const placeholder = theme === 'dark' ? '#888' : '#666';
  const primary = '#0EA5E9';
  const danger = '#EF4444';
  const secondary = theme === 'dark' ? '#444' : '#E5E7EB';

  return {
    overlay: {
      flex: 1,
      backgroundColor: overlay,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: 24,
    } as const,
    dialog: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: cardBg,
      borderRadius: 12,
      padding: 20,
    } as const,
    title: {
      color: text,
      fontSize: 18,
      fontWeight: '600' as const,
      marginBottom: 12,
    } as const,
    errorText: { color: '#ff7675', marginBottom: 8 } as const,
    primaryBtn: {
      backgroundColor: primary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      alignItems: 'center' as const,
    } as const,
    primaryBtnText: {
      color: '#fff',
      textAlign: 'center' as const,
      fontWeight: '600' as const,
    } as const,
    secondaryBtn: {
      backgroundColor: secondary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      alignItems: 'center' as const,
    } as const,
    secondaryBtnText: {
      color: text,
      textAlign: 'center' as const,
      fontWeight: '600' as const,
    } as const,
    dangerBtn: {
      backgroundColor: danger,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center' as const,
    } as const,
    dangerBtnText: {
      color: '#fff',
      textAlign: 'center' as const,
      fontWeight: '600' as const,
    } as const,
    infoText: { color: muted, marginBottom: 8 } as const,
    input: {
      backgroundColor: inputBg,
      color: text,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
    } as const,
    backText: { color: muted, textAlign: 'center' as const } as const,
    workingText: { color: muted } as const,
    colors: { placeholder, text },
  };
};
