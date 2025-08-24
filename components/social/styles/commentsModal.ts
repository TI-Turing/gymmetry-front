import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeCommentsModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = '#B0B0B0';
  const overlay = theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)';
  const border = theme === 'dark' ? '#333' : '#DDD';
  const cardBg = theme === 'dark' ? '#1E1E1E' : '#FFFFFF';

  return {
    backdrop: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: overlay,
      justifyContent: 'flex-end' as const,
    } as const,
    card: {
      backgroundColor: cardBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '80%' as const,
      padding: 16,
    } as const,
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 12,
    } as const,
    title: { color: text, fontSize: 16, fontWeight: '600' as const } as const,
    close: { color: text } as const,
    commentRow: { marginBottom: 12 } as const,
    commentAuthor: { color: muted, marginBottom: 4 } as const,
    commentText: { color: text } as const,
    inputRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
      paddingTop: 8,
    } as const,
    input: {
      flex: 1,
      color: text,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    } as const,
    colors: { placeholder: theme === 'dark' ? '#999' : '#666' },
  };
};
