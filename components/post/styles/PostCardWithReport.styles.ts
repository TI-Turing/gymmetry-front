import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const makePostCardStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    titleContainer: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    inactiveBadge: {
      backgroundColor: colors.tabIconDefault + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    inactiveBadgeText: {
      fontSize: 12,
      color: colors.tabIconDefault,
      fontWeight: '500',
    },
    content: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    metaText: {
      fontSize: 14,
      color: colors.tabIconDefault,
    },
    authorText: {
      fontWeight: '600',
      color: colors.tint,
    },
    actionsBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.background,
    },
    actionText: {
      fontSize: 14,
      color: colors.tabIconDefault,
      marginLeft: 6,
      fontWeight: '500',
    },
    spacer: {
      flex: 1,
    },
  });
};
