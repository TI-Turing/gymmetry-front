import { StyleSheet } from 'react-native';

export default () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 0,
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
