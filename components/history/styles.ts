import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    opacity: 0.8,
    marginBottom: SPACING.sm,
  },
  historyItem: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#333333',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  historyDate: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.tint,
    fontWeight: '600',
  },
  historyStatus: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusCompleted: {
    backgroundColor: '#51CF66',
    color: '#FFFFFF',
  },
  statusPending: {
    backgroundColor: '#FFD43B',
    color: '#000000',
  },
  statusSkipped: {
    backgroundColor: '#FF6B6B',
    color: '#FFFFFF',
  },
  exerciseList: {
    marginTop: SPACING.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  exerciseName: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1,
  },
  exerciseDetails: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: Colors.dark.tint,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  progressTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.tint,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
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
    textAlign: 'center',
    color: Colors.dark.text,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xl,
    opacity: 0.6,
  },
});
