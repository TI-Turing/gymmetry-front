import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

export default (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        theme === 'dark' ? Colors.dark.background : Colors.light.background,
    },
    tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme === 'dark' ? Colors.dark.border : Colors.light.border,
      backgroundColor: theme === 'dark' ? Colors.dark.card : Colors.light.card,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    tabSelected: {
      borderBottomWidth: 3,
      borderColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
    },
    tabText: {
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      fontWeight: '500',
      fontSize: 16,
    },
    tabTextSelected: {
      color: theme === 'dark' ? Colors.dark.tint : Colors.light.tint,
      fontWeight: 'bold',
    },
    tabContent: {
      flex: 1,
      padding: 16,
    },
    loading: {
      marginTop: 32,
    },
    empty: {
      textAlign: 'center',
      color: theme === 'dark' ? Colors.dark.textMuted : Colors.light.textMuted,
      marginTop: 32,
    },
    loadingText: {
      textAlign: 'center',
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
      marginTop: 32,
      fontSize: 16,
    },
    errorText: {
      textAlign: 'center',
      color: theme === 'dark' ? '#ff6b6b' : '#e74c3c',
      marginTop: 32,
      fontSize: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
    value: {
      fontSize: 16,
      marginBottom: 8,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
    item: {
      paddingVertical: 10,
      borderBottomWidth: 1,

      borderColor:
        theme === 'dark' ? Colors.dark.textMuted : Colors.light.textMuted,
    },
    itemTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme === 'dark' ? Colors.dark.text : Colors.light.text,
    },
    itemValue: {
      fontSize: 14,
      color: theme === 'dark' ? Colors.dark.textMuted : Colors.light.textMuted,
    },
  });
