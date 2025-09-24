import { StyleSheet } from 'react-native';

export default () =>
  StyleSheet.create({
    scrollContainer: {
      flex: 1,
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 8,
    },
  });
