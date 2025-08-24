import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makeGymStepsStyles = (mode: 'light' | 'dark') => {
  const c = Colors[mode];
  const colors = {
    background: c.background,
    text: c.text,
    muted: mode === 'dark' ? '#B0B0B0' : '#555555',
    border: mode === 'dark' ? '#333333' : '#E5E5E5',
    borderStrong: mode === 'dark' ? '#666666' : '#CCCCCC',
    cardBg: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    cardAlt: mode === 'dark' ? '#1A1A1A' : '#F9FAFB',
    tint: c.tint,
    success: '#4CAF50',
    overlay: 'rgba(0,0,0,0.5)',
  } as const;

  const styles = StyleSheet.create({
    // comunes
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20 },
    header: {
      marginBottom: 30,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.muted,
      lineHeight: 22,
      textAlign: 'center',
    },
    section: { marginBottom: 30 },
    form: {
      gap: 20,
      marginBottom: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    infoCard: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
    },
    infoContent: { flex: 1, marginLeft: 12 },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.tint,
      marginBottom: 4,
    },
    infoText: {
      flex: 1,
      fontSize: 14,
      color: colors.muted,
      lineHeight: 20,
      marginLeft: 12,
    },
    buttonContainer: {
      padding: 20,
      gap: 15,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    stepsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    // step indicator (for AddBranchForm re-use)
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    stepIndicatorContainer: { flexDirection: 'row', alignItems: 'center' },
    stepCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: mode === 'dark' ? '#333333' : '#EEEEEE',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.borderStrong,
    },
    stepCircleActive: {
      backgroundColor: colors.tint,
      borderColor: colors.tint,
    },
    stepNumber: { fontSize: 16, fontWeight: 'bold', color: colors.muted },
    stepNumberActive: { color: mode === 'dark' ? '#FFFFFF' : '#FFFFFF' },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: mode === 'dark' ? '#333333' : '#DDDDDD',
      marginHorizontal: 8,
    },
    stepLineActive: { backgroundColor: colors.tint },
    // footer actions
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    backButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.borderStrong,
    },
    backButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
    nextButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.tint,
    },
    nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    disabledWrapper: { opacity: 0.6 },

    // step3
    step3Container: { flex: 1, backgroundColor: colors.background },
    step3Header: { padding: 20, alignItems: 'center' },
    step3Title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    step3Subtitle: {
      fontSize: 16,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 22,
    },
    step3Form: { paddingHorizontal: 20, paddingBottom: 20, gap: 20 },
    step3ButtonContainer: { padding: 20 },

    // step4
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 15,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.muted,
      marginTop: 10,
      textAlign: 'center',
      lineHeight: 22,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      padding: 15,
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
    },

    // step5
    step5Header: {
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
    },
    step5Title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 15,
      textAlign: 'center',
    },
    step5Subtitle: {
      fontSize: 16,
      color: colors.muted,
      marginTop: 10,
      textAlign: 'center',
      lineHeight: 22,
    },
    step5Form: { paddingHorizontal: 20, paddingBottom: 20 },
    step5Section: { marginBottom: 20 },
    step5SectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
    uploadBox: {
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 30,
      alignItems: 'center',
      backgroundColor: colors.cardAlt,
    },
    uploadPlaceholder: { alignItems: 'center' },
    uploadedItem: { alignItems: 'center' },
    uploadText: {
      fontSize: 14,
      color: colors.tint,
      marginTop: 8,
      textAlign: 'center',
    },
    uploadedText: {
      fontSize: 14,
      color: colors.success,
      marginTop: 8,
      textAlign: 'center',
    },
    step5InfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      padding: 15,
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: colors.tint,
    },
    step5InfoText: {
      fontSize: 14,
      color: colors.muted,
      marginLeft: 10,
      flex: 1,
      lineHeight: 20,
    },
    step5ButtonContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 30,
      gap: 15,
    },
    finishButton: { flex: 2 },
  });

  return { styles, colors };
};
