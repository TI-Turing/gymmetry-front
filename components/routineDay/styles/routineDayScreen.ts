import Colors from '@/constants/Colors';
import { ThemeMode } from '@/hooks/useThemedStyles';

export const makeRoutineDayScreenStyles = (theme: ThemeMode): any => {
  const palette = Colors[theme];
  const text = palette.text;
  const tint = palette.tint;
  const secondary = palette.textMuted;
  const muted = palette.textMuted;
  const border = palette.border;
  const cardBg = palette.card;
  const overlayBg = palette.overlay;
  const overlayBgSoft = palette.overlay;
  const success = palette.success as string;
  const successBorder = palette.success as string;
  const successSoft = palette.neutral;
  const successText = palette.text;
  const warning = palette.warning as string;

  return {
    colors: {
      text,
      tint,
      border,
      cardBg,
      muted,
      neutral: palette.neutral,
      dim: palette.textMuted,
      soft: palette.textMuted,
      destructive: palette.danger,
      success,
      successBorder,
      warning,
      successSoft,
      successText,
    },
    container: { flex: 1, backgroundColor: 'transparent' } as const,
    // Tarjetas de ejercicio
    card: {
      backgroundColor: cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: border,
      padding: 12,
      marginHorizontal: 16,
      marginVertical: 6,
    } as const,
    cardCompleted: { borderColor: success } as const,
    cardHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 6,
      backgroundColor: cardBg,
    } as const,
    cardTitle: {
      color: text,
      fontSize: 15,
      fontWeight: '700' as const,
    } as const,
    cardMeta: { color: muted, fontSize: 12 } as const,
    cardSub: { color: muted, fontSize: 12, marginTop: 6 } as const,
    // Progreso
    progressBar: {
      height: 6,
      backgroundColor: palette.neutral,
      borderRadius: 6,
      overflow: 'hidden' as const,
      marginTop: 8,
    } as const,
    progressFill: {
      height: '100%',
      backgroundColor: tint,
      borderRadius: 6,
    } as const,
    progressText: {
      color: muted,
      fontSize: 12,
      marginTop: 6,
      textAlign: 'right' as const,
    } as const,
    congratsTitle: {
      color: success,
      fontSize: 16,
      fontWeight: '700' as const,
      textAlign: 'center' as const,
      marginBottom: 4,
    } as const,
    congratsSubtitle: {
      color: successSoft,
      fontSize: 13,
      textAlign: 'center' as const,
      lineHeight: 18,
    } as const,
    finalPhrase: {
      color: successText,
      fontSize: 13,
      textAlign: 'center' as const,
      marginTop: 10,
      fontStyle: 'italic' as const,
      lineHeight: 18,
    } as const,
    cardCategoryTag: {
      color: warning,
      fontSize: 11,
      marginTop: 4,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    } as const,
    actionsRow: {
      flexDirection: 'row' as const,
      gap: 12,
      marginTop: 16,
      backgroundColor: cardBg,
    } as const,
    actionButton: { flex: 1 } as const,
    overall: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
    } as const,
    overallLabel: { color: muted, fontSize: 12, marginBottom: 6 } as const,
    finishOverlay: {
      flex: 1,
      backgroundColor: overlayBg,
      justifyContent: 'center' as const,
      padding: 24,
    } as const,
    finishCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: border,
    } as const,
    finishTitle: {
      color: text,
      fontSize: 16,
      fontWeight: '700' as const,
      textAlign: 'center' as const,
      marginBottom: 8,
    } as const,
    finishSubtitle: {
      color: secondary,
      fontSize: 13,
      textAlign: 'center' as const,
      lineHeight: 18,
    } as const,
    bottomBar: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: cardBg,
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: border,
    } as const,
    bottomBarContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    } as const,
    bottomBarButton: { flex: 1 } as const,
    bottomBarButtonSecondary: { width: 130 } as const,
    sectionHeader: {
      color: text,
      fontSize: 15,
      fontWeight: '600' as const,
      marginBottom: 6,
      marginTop: 4,
    } as const,
    templateHeaderWrapper: {
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 4,
    } as const,
    templateHeaderRow: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
    } as const,
    templateTitle: {
      flex: 1,
      color: text,
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 22,
    } as const,
    templateTitleFallback: {
      color: muted,
      fontSize: 16,
      fontStyle: 'italic' as const,
    } as const,
    infoOverlay: {
      flex: 1,
      backgroundColor: overlayBgSoft,
      justifyContent: 'center' as const,
      padding: 28,
    } as const,
    infoCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: border,
    } as const,
    infoTitle: {
      color: text,
      fontSize: 17,
      fontWeight: '700' as const,
      marginBottom: 10,
      textAlign: 'center' as const,
    } as const,
    infoDesc: { color: secondary, fontSize: 14, lineHeight: 20 } as const,
    infoButton: {
      backgroundColor: cardBg,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: border,
      padding: 8,
    } as const,
    weekdayLabel: {
      color: tint,
      fontSize: 13,
      marginTop: 4,
      fontWeight: '600' as const,
    } as const,
    dayChip: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: cardBg,
      borderWidth: 1,
      borderColor: border,
    } as const,
    dayChipActive: { backgroundColor: tint, borderColor: tint } as const,
    dayChipText: {
      color: muted,
      fontSize: 13,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    } as const,
    dayChipTextActive: { color: palette.onTint } as const,
    catSeparatorWrapper: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
      marginTop: 12,
    } as const,
    catSeparatorLine: { flex: 1, height: 1, backgroundColor: border } as const,
    catSeparatorText: {
      color: muted,
      fontSize: 12,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    } as const,
    content: { paddingTop: 8 } as const,
    error: { color: palette.danger, textAlign: 'center' as const },
  };
};
