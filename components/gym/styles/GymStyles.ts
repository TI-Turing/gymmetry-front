import { StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

export const GymStyles = StyleSheet.create({
  // Contenedores principales
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },

  // Headers
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 22,
  },

  // Secciones y formularios
  section: {
    marginBottom: 30,
  },
  form: {
    gap: 20,
    marginBottom: 20,
  },

  // Cards informativos
  infoCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.tint,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.tint,
    marginBottom: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginLeft: 12,
  },

  // Contenedor de botones
  buttonContainer: {
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },

  // Step 3 específicos
  step3Container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  step3Header: {
    padding: 20,
    alignItems: 'center',
  },
  step3Title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  step3Subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 22,
  },
  step3Form: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  step3ButtonContainer: {
    padding: 20,
  },
  nextButton: {
    backgroundColor: Colors.dark.tint,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Estilos específicos para dropdowns y inputs
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dropdownInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  dropdownErrorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },

  // Modal para dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  noOptionsText: {
    textAlign: 'center',
    opacity: 0.7,
    padding: 20,
  },

  // Step 5 específicos
  step5Header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  step5Title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 15,
    textAlign: 'center',
  },
  step5Subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  step5Form: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  step5Section: {
    marginBottom: 20,
  },
  step5SectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadedItem: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: Colors.dark.tint,
    marginTop: 8,
    textAlign: 'center',
  },
  uploadedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
  },
  step5InfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.tint,
  },
  step5InfoText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  step5ButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 15,
  },
  finishButton: {
    flex: 2,
    backgroundColor: Colors.dark.tint,
  },
});
