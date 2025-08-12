import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.md,
  },
  dietCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  dietHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  dietName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  dietType: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.dark.tint,
    color: '#FFFFFF',
  },
  dietDescription: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  nutritionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333333',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: Colors.dark.tint,
    marginBottom: SPACING.xs,
  },
  nutritionLabel: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
  },
  mealPlanContainer: {
    marginBottom: SPACING.md,
  },
  mealPlanTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  mealCard: {
    backgroundColor: '#333333',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealTime: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: Colors.dark.tint,
  },
  mealCalories: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  mealName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
  },
  mealDescription: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    lineHeight: 18,
  },
  ingredientsList: {
    marginTop: SPACING.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#444444',
  },
  ingredientName: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1,
  },
  ingredientAmount: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  dietGoals: {
    backgroundColor: '#333333',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  goalsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  goalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.tint,
    marginRight: SPACING.sm,
  },
  goalText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1,
  },
  progressTracking: {
    backgroundColor: '#333333',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  progressItem: {
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#222222',
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.tint,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
    opacity: 0.8,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  dietActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.dark.tint,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.tint,
  },
  buttonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: Colors.dark.tint,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  filterButton: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: Colors.dark.tint,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.lg,
    color: Colors.dark.text,
    textAlign: 'center',
    opacity: 0.6,
    marginBottom: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    textAlign: 'center',
    opacity: 0.4,
  },
});
