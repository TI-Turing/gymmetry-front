import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makePostComposerStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const text = palette.text;
  const muted = '#B0B0B0';
  const placeholder = theme === 'dark' ? '#999' : '#666';
  const cardBg = `${text}08`;
  const inputBg = `${text}12`;

  return {
    card: {
      backgroundColor: cardBg,
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    } as const,
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    } as const,
    avatar: { width: 40, height: 40, borderRadius: 20 } as const,
    inputFake: {
      flex: 1,
      marginLeft: 12,
      padding: 12,
      backgroundColor: inputBg,
      borderRadius: 20,
    } as const,
    placeholder: { color: muted, fontSize: 14 } as const,
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    } as const,
    actionBtn: { paddingVertical: 6, paddingHorizontal: 10 } as const,
    actionText: { color: muted } as const,
    modalContainer: { flex: 1, backgroundColor: palette.background } as const,
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    } as const,
    modalTitle: {
      color: text,
      fontSize: 16,
      fontWeight: '600' as const,
    } as const,
    cancel: { color: text } as const,
    modalBody: { flex: 1, padding: 16 } as const,
    textarea: {
      flex: 1,
      color: text,
      fontSize: 16,
      textAlignVertical: 'top' as const,
    } as const,
    modalFooter: { padding: 16 } as const,
    colors: { placeholder },
  };
};
