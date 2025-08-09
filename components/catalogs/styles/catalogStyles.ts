import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const catalogStyles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  selector: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorEnabled: {
    opacity: 1,
  },
  selectorDisabled: {
    opacity: 0.5,
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    opacity: 1,
  },
  placeholderText: {
    opacity: 0.6,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderColor: '#666',
    fontSize: 16,
  // color definido por getColorSchemeStyles.searchInputText
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
  top: '50%',
  transform: [{ translateY: -9 }],
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  optionItem: {
  padding: 16,
  borderBottomWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
  },
  optionItemSelected: {
    // leve indicación de selección
    backgroundColor: 'transparent',
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkMark: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export const getColorSchemeStyles = (colorScheme: 'light' | 'dark') => ({
  label: {
    color: Colors[colorScheme].text,
  },
  selector: {
    backgroundColor: Colors[colorScheme].background,
    borderColor: '#666',
  },
  selectorText: {
    color: Colors[colorScheme].text,
  },
  placeholderText: {
    color: `${Colors[colorScheme].text}60`,
  },
  searchInputText: {
    color: Colors[colorScheme].text,
  },
  modalContent: {
    backgroundColor: Colors[colorScheme].background,
  },
  modalTitle: {
    color: Colors[colorScheme].text,
  },
  optionItem: {
  borderBottomColor: 'transparent',
  },
  optionText: {
    color: Colors[colorScheme].text,
  },
  emptyText: {
    color: Colors[colorScheme].text,
  },
});
