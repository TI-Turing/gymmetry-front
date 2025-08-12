import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    color: Colors.dark.text,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    color: Colors.dark.text,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.dark.tint,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  secondaryButtonText: {
    color: Colors.dark.tint,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  successText: {
    color: '#51CF66',
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  flex1: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.dark.tint,
    borderRadius: 4,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.dark.tint,
  },
  checkboxText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  picker: {
    color: Colors.dark.text,
    backgroundColor: 'transparent',
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  datePickerText: {
    color: Colors.dark.text,
    fontSize: FONT_SIZES.md,
  },
  validationText: {
    fontSize: FONT_SIZES.xs,
    color: '#FF6B6B',
    marginTop: SPACING.xs,
  },
});
