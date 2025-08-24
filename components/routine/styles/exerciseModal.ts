import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRoutineExerciseModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const cardBg = palette.card;
  const subtle = palette.textMuted;
  const neutral = palette.neutral;

  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    modalCard: {
      width: '100%',
      backgroundColor: cardBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      minHeight: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    modalTitle: { color: palette.text, fontSize: 18, fontWeight: '600' },
    closeIcon: { color: palette.text },
    closeIconDisabled: { color: palette.tabIconDefault },
    modalSub: { color: subtle, marginBottom: 12, fontSize: 14 },
    progressText: {
      color: palette.tint,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 20,
      textAlign: 'center',
    },
    animationContainer: {
      alignItems: 'center',
      marginVertical: 30,
      height: 180,
      justifyContent: 'center',
    },
    pulseCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    pulseBgExecuting: { backgroundColor: palette.tint },
    pulseBgIdle: { backgroundColor: neutral },
    pulseIcon: { color: palette.onTint },
    phraseContainer: { paddingHorizontal: 20, alignItems: 'center' },
    motivationalText: {
      color: palette.text,
      fontSize: 16,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    buttonContainer: { gap: 12 },
    startButton: { backgroundColor: palette.tint },
    finishButton: { backgroundColor: palette.tint },
    buttonRow: { flexDirection: 'row', gap: 12 },
    halfButton: { flex: 1 },
  });
};
