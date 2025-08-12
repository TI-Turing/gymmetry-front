import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  // User List styles
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  card: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: SPACING.sm
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: Colors.dark.tint,
    color: '#FFFFFF'
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: '#B0B0B0',
    marginBottom: SPACING.md,
    lineHeight: 20
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: '#888888',
    fontWeight: '500',
    minWidth: 90
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1
  },

  // User Form styles
  formContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.lg
  },
  formTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.lg
  },
  formLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: SPACING.xs
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#444444',
    backgroundColor: '#1A1A1A',
    color: Colors.dark.text,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.md
  },
  info: {
    color: Colors.dark.tint,
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md
  },
  error: {
    color: '#ff6b6b',
    marginVertical: SPACING.sm,
    fontSize: FONT_SIZES.md
  },

  // User Detail styles
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.lg
  },
  detailCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#333333'
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontFamily: 'monospace',
    lineHeight: 18
  },

  // User profile specific styles
  profileContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: Colors.dark.tint
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: Colors.dark.tint
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: Colors.dark.text
  },
  userSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333'
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#333333'
  }
});
