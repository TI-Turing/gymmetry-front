import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeExerciseModalStyles = (theme: ThemeMode) => {
  const palette = Colors[theme];
  const cardBg = palette.card;
  const border = palette.border;
  const subtle = palette.textMuted;
  const strong = palette.text;
  const neutral = palette.neutral;
  const onTint = palette.onTint;

  return StyleSheet.create({
    modalBackdrop: {
      flex: 1,
      backgroundColor: palette.overlay,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    backdropOverlay: { width: '100%', flex: 1 },
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
      backgroundColor: cardBg,
    },
    modalTitle: { color: strong, fontSize: 18, fontWeight: '600' },
    modalSub: { color: subtle, marginBottom: 12, fontSize: 14 },
    linkText: { color: palette.tint, textDecorationLine: 'underline' },
    progressText: {
      color: palette.tint,
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 20,
      textAlign: 'center',
    },
    animationContainer: {
      alignItems: 'center',
      marginVertical: 16,
      height: 180,
      justifyContent: 'center',
      backgroundColor: cardBg,
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
    pulseIcon: { color: onTint },
    pulseCircleAbsolute: { position: 'absolute', top: 0, zIndex: 1 },
    phraseContainer: { paddingHorizontal: 20, alignItems: 'center' },
    motivationalText: {
      color: strong,
      fontSize: 16,
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 22,
    },
    buttonContainer: { gap: 12, backgroundColor: cardBg },
    startButton: { backgroundColor: palette.tint },
    finishButton: { backgroundColor: palette.tint },
    buttonRow: { flexDirection: 'row', gap: 12, backgroundColor: cardBg },
    halfButton: { flex: 1 },
    completedText: {
      color: palette.tint,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: 8,
    },
    closeIcon: { color: strong },
    closeIconDisabled: { color: subtle },

    promptOverlay: {
      flex: 1,
      backgroundColor: palette.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    promptCard: {
      backgroundColor: cardBg,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: border,
      width: '100%',
      maxWidth: 360,
    },
    promptTitle: {
      color: strong,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
    promptSubtitle: {
      color: subtle,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 4,
      marginBottom: 12,
    },
    promptInput: {
      backgroundColor: neutral,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      color: strong,
      fontSize: 16,
      borderWidth: 1,
      borderColor: border,
    },
    promptButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
    promptButton: { flex: 1 },
    placeholder: { color: subtle },
    controlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 4,
      backgroundColor: cardBg,
    },
    controlLabel: { color: subtle },
    thumbOff: { color: subtle },
    switchIosBg: { backgroundColor: neutral },
    timerPanel: { backgroundColor: cardBg },
    timerLabel: { color: subtle },
    timerSubLabel: { color: subtle },
    timerTime: {
      color: onTint,
      fontSize: 42,
      fontWeight: '700',
      letterSpacing: 1,
    },
    buttonOnTintText: { color: onTint },
    
    // Rep counter styles
    repCounterContainer: {
      alignItems: 'center',
      gap: 16,
      backgroundColor: cardBg,
    },
    repCounterLabel: {
      color: subtle,
      fontSize: 14,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    repControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      backgroundColor: cardBg,
    },
    repButton: {
      padding: 8,
    },
    repCounterText: {
      color: palette.tint,
      fontSize: 56,
      fontWeight: '700',
      minWidth: 80,
      textAlign: 'center',
    },
  });
};
