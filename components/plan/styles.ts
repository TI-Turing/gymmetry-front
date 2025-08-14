import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  // Plan List styles
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
  popularCard: {
    borderColor: Colors.dark.tint,
    borderWidth: 2,
    shadowColor: Colors.dark.tint,
    shadowOpacity: 0.5
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
  priceContainer: {
    alignItems: 'flex-end'
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: Colors.dark.tint
  },
  priceOld: {
    fontSize: FONT_SIZES.sm,
    color: '#888888',
    textDecorationLine: 'line-through'
  },
  pricePeriod: {
    fontSize: FONT_SIZES.sm,
    color: '#B0B0B0'
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: SPACING.lg,
    backgroundColor: Colors.dark.tint,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md
  },
  popularText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: '#B0B0B0',
    marginBottom: SPACING.md,
    lineHeight: 22
  },
  featuresContainer: {
    marginBottom: SPACING.md
  },
  featuresTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.sm
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs
  },
  featureIcon: {
    color: Colors.dark.tint,
    marginRight: SPACING.sm,
    fontSize: FONT_SIZES.md
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1
  },
  limitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#0F0F0F',
    marginTop: SPACING.md
  },
  limitItem: {
    alignItems: 'center'
  },
  limitLabel: {
    fontSize: FONT_SIZES.xs,
    color: '#888888',
    marginBottom: 4
  },
  limitValue: {
    fontSize: FONT_SIZES.md,
    color: Colors.dark.text,
    fontWeight: '600'
  },
  selectButton: {
    backgroundColor: Colors.dark.tint,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md
  },
  selectButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  selectedButton: {
    backgroundColor: '#ff6300'
  },

  // Plan Form styles
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
    color: '#FF6B35',
    marginVertical: SPACING.sm,
    fontSize: FONT_SIZES.md
  },

  // Plan Detail styles
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

  // Plan comparison styles
  comparisonContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333'
  },
  comparisonTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: SPACING.md,
    textAlign: 'center'
  },
  comparisonTable: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: BORDER_RADIUS.md
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333333'
  },
  comparisonCell: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center'
  },
  comparisonHeader: {
    backgroundColor: '#333333'
  },
  comparisonHeaderText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: Colors.dark.text
  },
  comparisonCellText: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text
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
    minWidth: 80
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1
  }
});
