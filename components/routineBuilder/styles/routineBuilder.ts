import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import type { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRoutineBuilderStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const subtitle = palette.textMuted;
  const cardBg = palette.card;
  const border = palette.border;
  const pillBg = theme === 'dark' ? '#262626' : '#F3F4F6';
  const pillAlt = theme === 'dark' ? '#333333' : '#E5E7EB';
  const danger = palette.danger;

  return StyleSheet.create({
    container: { padding: 16 },
    card: {
      backgroundColor: cardBg,
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: border,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
      color: palette.text,
    },
    subtitle: { color: subtitle, marginBottom: 4 },
    input: {
      backgroundColor: theme === 'dark' ? '#262626' : '#F7F7F7',
      color: palette.text,
      padding: 12,
      borderRadius: 8,
    },
    inputSmall: {
      backgroundColor: theme === 'dark' ? '#1F1F1F' : '#F2F2F2',
      color: palette.text,
      padding: 8,
      borderRadius: 8,
    },
    premiumNote: {
      marginTop: 12,
      color: theme === 'dark' ? '#FFB347' : palette.tint,
      fontSize: 12,
    },

    daysWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: cardBg,
    },
    pill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: pillBg,
      margin: 4,
    },
    pillActive: { backgroundColor: palette.tint },
    pillText: { color: palette.onTint, fontWeight: '600', fontSize: 12 },

    item: {
      backgroundColor: theme === 'dark' ? '#262626' : '#F2F2F2',
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
    },
    itemTitle: { color: palette.text, fontWeight: '600', marginBottom: 4 },
    row: { flexDirection: 'row', gap: 8 },
    col1: { flex: 1 },
    col2: { flex: 2 },
    notes: {
      backgroundColor: theme === 'dark' ? '#1F1F1F' : '#F2F2F2',
      color: palette.text,
      padding: 8,
      borderRadius: 8,
      minHeight: 60,
    },
    removeExercise: { marginTop: 8 },
    removeExerciseText: {
      color: palette.tint,
      fontSize: 12,
      fontWeight: '600',
    },

    addBtn: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: pillAlt,
    },
    addBtnText: { color: palette.text, fontSize: 12, fontWeight: '600' },
    emptyText: { color: subtitle, fontSize: 12, marginTop: 4 },

    saveBtn: {
      backgroundColor: palette.tint,
      padding: 16,
      borderRadius: 30,
      alignItems: 'center',
      marginBottom: 48,
    },
    saveBtnDisabled: {
      backgroundColor: theme === 'dark' ? '#444444' : '#BBBBBB',
    },
    saveBtnText: { color: palette.onTint, fontWeight: '600', fontSize: 16 },
    spinner: { marginRight: 8, position: 'absolute', left: 24 },
    error: { color: danger, marginBottom: 12 },
    success: { color: '#4CAF50', marginBottom: 12 },
  });
};
