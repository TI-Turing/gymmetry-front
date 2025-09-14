import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const reportModalStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme].background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme].border,
    },
    closeButton: {
      padding: 8,
      marginLeft: -8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors[colorScheme].text,
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 16,
    },
    submitButton: {
      backgroundColor: Colors[colorScheme].tint,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      minWidth: 80,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      backgroundColor: Colors[colorScheme].textMuted,
      opacity: 0.6,
    },
    submitButtonText: {
      color: Colors[colorScheme].background,
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors[colorScheme].text,
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      marginBottom: 16,
      lineHeight: 20,
    },
    required: {
      color: '#EF4444', // red-500
    },
    previewSection: {
      marginTop: 16,
    },
    previewContainer: {
      backgroundColor: Colors[colorScheme].card,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
    },
    previewText: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      lineHeight: 20,
    },
    reasonList: {
      gap: 8,
    },
    reasonOption: {
      backgroundColor: Colors[colorScheme].card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
      padding: 16,
    },
    reasonOptionSelected: {
      borderColor: Colors[colorScheme].tint,
      backgroundColor: `${Colors[colorScheme].tint}15`, // 15% opacity
    },
    reasonOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reasonOptionText: {
      fontSize: 15,
      color: Colors[colorScheme].text,
      flex: 1,
    },
    reasonOptionTextSelected: {
      color: Colors[colorScheme].tint,
      fontWeight: '500',
    },
    textInput: {
      backgroundColor: Colors[colorScheme].card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
      padding: 12,
      fontSize: 15,
      color: Colors[colorScheme].text,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    characterCount: {
      fontSize: 12,
      color: Colors[colorScheme].textMuted,
      textAlign: 'right',
      marginTop: 4,
    },
    priorityList: {
      flexDirection: 'row',
      gap: 8,
    },
    priorityOption: {
      flex: 1,
      backgroundColor: Colors[colorScheme].card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme].border,
      padding: 12,
      alignItems: 'center',
    },
    priorityOptionSelected: {
      borderColor: Colors[colorScheme].tint,
      backgroundColor: `${Colors[colorScheme].tint}15`,
    },
    priorityOptionText: {
      fontSize: 14,
      color: Colors[colorScheme].text,
      fontWeight: '500',
    },
    priorityOptionTextSelected: {
      color: Colors[colorScheme].tint,
      fontWeight: '600',
    },
    guidelinesText: {
      fontSize: 14,
      color: Colors[colorScheme].textMuted,
      lineHeight: 20,
    },
    rateLimitContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${Colors[colorScheme].warning}15`,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderLeftWidth: 4,
      borderLeftColor: Colors[colorScheme].warning,
      gap: 8,
    },
    rateLimitText: {
      flex: 1,
      fontSize: 14,
      color: Colors[colorScheme].warning,
      fontWeight: '500',
    },
  });
