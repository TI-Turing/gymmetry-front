import { StyleSheet } from 'react-native';
import Colors from '../../../../constants/Colors';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)',
      zIndex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? Colors.dark.background : Colors.light.background,
      marginHorizontal: 24,
      marginVertical: 32,
      borderRadius: 24,
      zIndex: 2,
      elevation: 4,
    },
  });
