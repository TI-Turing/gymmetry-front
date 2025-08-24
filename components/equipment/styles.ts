import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.md,
  },
  equipmentCard: {
    backgroundColor: Colors.dark.card,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  equipmentName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  equipmentStatus: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusAvailable: {
    backgroundColor: Colors.dark.tint,
    color: Colors.dark.onTint,
  },
  statusInUse: {
    backgroundColor: Colors.dark.danger,
    color: Colors.dark.onTint,
  },
  statusMaintenance: {
    backgroundColor: Colors.dark.neutral,
    color: Colors.dark.text,
  },
  statusOutOfService: {
    backgroundColor: Colors.dark.neutral,
    color: Colors.dark.onTint,
  },
  equipmentDescription: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  equipmentSpecs: {
    marginBottom: SPACING.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  specLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  specValue: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  categoryChip: {
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    color: Colors.dark.onTint,
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  equipmentActions: {
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
  disabledButton: {
    backgroundColor: Colors.dark.tabIconDefault,
  },
  buttonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: Colors.dark.onTint,
  },
  secondaryButtonText: {
    color: Colors.dark.tint,
  },
  disabledButtonText: {
    color: Colors.dark.textMuted,
  },
  reservationInfo: {
    backgroundColor: Colors.dark.neutral,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  reservationTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
  },
  reservationText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
  },
  usageHistory: {
    backgroundColor: Colors.dark.neutral,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  historyTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  historyUser: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
  },
  historyTime: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    backgroundColor: Colors.dark.card,
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
    color: Colors.dark.onTint,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: SPACING.lg,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  gridItem: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  gridItemName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
  },
  gridItemStatus: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: FONT_SIZES.md,
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
