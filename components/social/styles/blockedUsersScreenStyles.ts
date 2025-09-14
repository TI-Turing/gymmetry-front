import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const blockedUsersScreenStyles = (
  colorScheme: 'light' | 'dark' = 'light'
) => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
};
