import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.md,
  },
  notificationItem: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.tint,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  notificationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  notificationTime: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
    opacity: 0.6,
  },
  notificationBody: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationType: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  typeInfo: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
  },
  typeWarning: {
    backgroundColor: '#F59E0B',
    color: '#FFFFFF',
  },
  typeError: {
    backgroundColor: '#FF6B35',
    color: '#FFFFFF',
  },
  typeSuccess: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
  },
  notificationActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#333333',
  },
  actionButtonText: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
  },
  markReadButton: {
    backgroundColor: Colors.dark.tint,
  },
  markReadButtonText: {
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FF6B35',
  },
  deleteButtonText: {
    color: '#FFFFFF',
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
  settingsCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  settingsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    flex: 1,
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.6,
    marginTop: SPACING.xs,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    marginTop: SPACING.md,
  },
});
