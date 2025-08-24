import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  // RoutineAssignedCard styles
  container: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  text: {
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  status: {
    color: Colors.dark.tint,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.xs,
    backgroundColor: '#1A1A1A',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    overflow: 'hidden',
  },
  badgePremium: {
    backgroundColor: Colors.dark.tint,
    color: '#FFFFFF',
  },
  badgeFree: {
    backgroundColor: '#2E2E2E',
    color: '#B0B0B0',
  },

  // RoutineAssignedDetail styles
  error: {
    color: 'red',
    marginVertical: SPACING.sm,
  },
  info: {
    color: Colors.dark.tint,
    marginTop: SPACING.sm,
  },
  card: {
    backgroundColor: '#fff2',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginVertical: SPACING.xs,
  },
  cardText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
  },
  label: {
    marginBottom: SPACING.xs,
    color: Colors.dark.text,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SPACING.sm,
    color: Colors.dark.text,
    backgroundColor: '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.sm,
  },

  // RoutineAssignedForm styles
  form: {
    padding: SPACING.md,
    backgroundColor: Colors.dark.background,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    color: Colors.dark.text,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
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

  // RoutineAssignedList styles
  list: {
    padding: SPACING.md,
    backgroundColor: Colors.dark.background,
  },
  listItem: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  emptyState: {
    textAlign: 'center',
    color: Colors.dark.text,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xl,
  },

  // RoutineAssignedList additional styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.dark.tint,
    color: '#FFFFFF',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1,
  },
  goalsSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  goalsLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  goalsList: {
    gap: SPACING.xs,
  },
  goal: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    marginLeft: SPACING.sm,
  },
  moreGoals: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.tint,
    fontStyle: 'italic',
    marginLeft: SPACING.sm,
  },
});
