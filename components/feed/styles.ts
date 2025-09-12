import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    card: {
      backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFF',
      padding: SPACING.lg,
      marginVertical: SPACING.sm,
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333333' : '#E5E7EB',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    title: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      flex: 1,
      marginRight: SPACING.sm,
    },
    statusText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.md,
      backgroundColor: Colors.dark.tint,
      color: '#FFFFFF',
    },
    content: {
      fontSize: FONT_SIZES.md,
      color: '#B0B0B0',
      marginBottom: SPACING.md,
      lineHeight: 22,
    },
    authorSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.md,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: '#333333',
    },
    author: {
      fontSize: FONT_SIZES.sm,
      color: Colors.dark.tint,
      fontWeight: '600',
    },
    date: {
      fontSize: FONT_SIZES.sm,
      color: '#888888',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: SPACING.md,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: '#333333',
      backgroundColor: '#0F0F0F',
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      fontSize: FONT_SIZES.xs,
      color: '#888888',
      marginBottom: 4,
    },
    statValue: {
      fontSize: FONT_SIZES.md,
      color: Colors.dark.text,
      fontWeight: '600',
    },
    tagsContainer: {
      marginTop: SPACING.md,
    },
    tags: {
      fontSize: FONT_SIZES.sm,
      color: Colors.dark.tint,
      fontStyle: 'italic',
    },
    // Detalle
    detailContainer: {
      flex: 1,
      padding: SPACING.lg,
      backgroundColor:
        theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    detailCard: {
      backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFF',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#333333' : '#E5E7EB',
    },
    detailText: {
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      fontSize: FONT_SIZES.sm,
    },
    error: {
      color: Colors.dark.tint,
      marginTop: SPACING.md,
    },
    formContainer: {
      flex: 1,
      backgroundColor: Colors.dark.background,
      padding: SPACING.lg,
    },
    formTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: '600',
      color: Colors.dark.text,
      marginBottom: SPACING.lg,
    },
    formLabel: {
      fontSize: FONT_SIZES.md,
      fontWeight: '500',
      color: Colors.dark.text,
      marginBottom: SPACING.xs,
    },
    textarea: {
      width: '100%',
      minHeight: 120,
      borderWidth: 1,
      borderColor: '#333333',
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      color: Colors.dark.text,
      backgroundColor: theme === 'dark' ? '#0F0F0F' : '#FFFFFF',
      marginBottom: SPACING.md,
    },
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    info: {
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      marginTop: SPACING.md,
    },
    // Estados de carga, error y vacío
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    loadingText: {
      fontSize: FONT_SIZES.md,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    errorText: {
      color: Colors.dark.tint,
      fontSize: FONT_SIZES.md,
      marginBottom: SPACING.md,
      textAlign: 'center',
    },
    retryText: {
      color: Colors.dark.tint,
      fontWeight: 'bold',
      fontSize: FONT_SIZES.md,
      textAlign: 'center',
      textDecorationLine: 'underline',
      marginTop: SPACING.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xl,
    },
    emptyTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      marginBottom: SPACING.md,
    },
    emptyMessage: {
      fontSize: FONT_SIZES.md,
      color: '#888888',
      textAlign: 'center',
    },
  });
