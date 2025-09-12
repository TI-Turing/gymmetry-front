import { StyleSheet } from 'react-native';

import { ThemeMode } from '../../../hooks/useThemedStyles';
import Colors from '../../../constants/Colors';
export default (theme: ThemeMode) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: Colors[theme]?.tint ?? '#FF6B35',
      margin: 4,
      minWidth: 80,
      minHeight: 40,
      elevation: 2,
    },
    badgeLabel: {
      fontSize: 12,
      color: Colors[theme]?.text ?? '#fff',
      fontWeight: 'bold',
    },
    badgeValue: {
      fontSize: 18,
      color: Colors[theme]?.text ?? '#fff',
      fontWeight: 'bold',
    },
  });
