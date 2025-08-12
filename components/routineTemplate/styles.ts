import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/Theme';

export const styles = StyleSheet.create({
  // RoutineTemplatesScreen styles
  container: { 
    flex: 1, 
    backgroundColor: Colors.dark.background, 
    padding: SPACING.lg 
  },
  header: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: Colors.dark.text, 
    marginBottom: SPACING.md 
  },
  sectionTitle: { 
    fontSize: FONT_SIZES.xl, 
    fontWeight: '600', 
    color: Colors.dark.text, 
    marginTop: SPACING.xl, 
    marginBottom: SPACING.sm 
  },
  text: { 
    color: '#B0B0B0', 
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZES.md
  },
  error: { 
    color: '#ff6b6b', 
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.md
  },
  card: { 
    backgroundColor: '#1F1F1F', 
    padding: SPACING.lg, 
    borderRadius: BORDER_RADIUS.xl, 
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#333333'
  },
  cardTitle: { 
    fontSize: FONT_SIZES.lg, 
    fontWeight: '600', 
    color: Colors.dark.text, 
    marginBottom: SPACING.xs 
  },
  assignButton: {
    marginTop: SPACING.sm,
    backgroundColor: Colors.dark.tint,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  assignLabel: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: FONT_SIZES.md
  },

  // RoutineTemplateList styles
  listCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  listTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    flex: 1
  },
  statusText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: Colors.dark.tint,
    color: '#FFFFFF'
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: '#B0B0B0',
    marginBottom: SPACING.sm,
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
    minWidth: 80
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    flex: 1
  },

  // RoutineTemplateForm & RoutineTemplateDetail styles
  formContainer: { 
    flex: 1, 
    backgroundColor: Colors.dark.background,
    padding: SPACING.lg 
  },
  formTitle: { 
    fontSize: FONT_SIZES.xl, 
    fontWeight: '600', 
    color: Colors.dark.text,
    marginBottom: SPACING.md 
  },
  formError: { 
    color: '#ff6b6b', 
    marginVertical: SPACING.sm,
    fontSize: FONT_SIZES.md
  },
  info: { 
    color: Colors.dark.tint, 
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md
  },
  formCard: {
    backgroundColor: '#1A1A1A',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: '#333333'
  },
  cardText: { 
    fontSize: FONT_SIZES.sm,
    color: Colors.dark.text,
    fontFamily: 'monospace'
  },
  formLabel: { 
    marginBottom: SPACING.xs, 
    color: Colors.dark.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '500'
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
    marginBottom: SPACING.sm,
    fontSize: FONT_SIZES.md
  },
  formRow: { 
    flexDirection: 'row', 
    gap: SPACING.sm, 
    marginVertical: SPACING.sm 
  },
});
