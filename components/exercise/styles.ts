import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  // Exercise List styles
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
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  difficulty: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    color: '#FFFFFF',
  },
  difficultyEasy: {
    backgroundColor: '#4CAF50',
  },
  difficultyMedium: {
    backgroundColor: Colors.dark.tint,
  },
  difficultyHard: {
    backgroundColor: '#f44336',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: '#B0B0B0',
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  categoryLabel: {
    fontSize: FONT_SIZES.sm,
    color: '#888888',
    fontWeight: '500',
    marginRight: SPACING.sm,
  },
  categoryTag: {
    backgroundColor: '#333333',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  categoryText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  equipmentContainer: {
    marginTop: SPACING.md,
  },
  equipmentTitle: {
    fontSize: FONT_SIZES.sm,
    color: '#888888',
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  equipmentItem: {
    backgroundColor: '#333333',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  equipmentText: {
    fontSize: FONT_SIZES.xs,
    color: Colors.dark.text,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#0F0F0F',
    marginTop: SPACING.md,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: FONT_SIZES.xs,
    color: '#888888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    fontWeight: '600',
  },

  // Exercise Form styles
  formContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.lg,
  },
  formTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.lg,
  },
  formLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: SPACING.xs,
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
    fontSize: FONT_SIZES.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  info: {
    color: Colors.dark.tint,
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  error: {
    color: '#ff6b6b',
    marginVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
  },

  // Exercise Detail styles
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: SPACING.lg,
  },
  detailCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: '#333333',
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontFamily: 'monospace',
    lineHeight: 18,
  },

  // Exercise execution styles
  executionContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333',
  },
  executionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  timerDisplay: {
    fontSize: FONT_SIZES.huge,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  setsContainer: {
    marginTop: SPACING.md,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  setText: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  setComplete: {
    backgroundColor: Colors.dark.tint,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: '#888888',
    fontWeight: '500',
    minWidth: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1,
  },
});
