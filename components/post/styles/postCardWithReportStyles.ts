import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const postCardWithReportStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      backgroundColor: Colors[colorScheme].card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    titleContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[colorScheme].text,
      flex: 1,
    },
    inactiveBadge: {
      backgroundColor: Colors[colorScheme].warning,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginLeft: 8,
    },
    inactiveBadgeText: {
      fontSize: 10,
      fontWeight: '500',
      color: Colors[colorScheme].background,
    },
    content: {
      fontSize: 15,
      lineHeight: 22,
      color: Colors[colorScheme].text,
      marginBottom: 12,
    },
    metaRow: {
      marginBottom: 16,
    },
    metaText: {
      fontSize: 13,
      color: Colors[colorScheme].textMuted,
    },
    authorText: {
      fontWeight: '500',
      color: Colors[colorScheme].tint,
    },
    actionsBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme].border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
    },
    actionText: {
      fontSize: 14,
      color: Colors[colorScheme].text,
      marginLeft: 6,
      fontWeight: '500',
    },
    spacer: {
      flex: 1,
    },
  });
