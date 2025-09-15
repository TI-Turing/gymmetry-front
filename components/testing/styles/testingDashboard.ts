import { StyleSheet } from 'react-native';

export const testingDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Fondo oscuro principal
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#ffffff', // Texto blanco para título
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    color: '#cccccc', // Texto gris claro para subtítulo
  },
  controlsSection: {
    marginBottom: 24,
  },
  runAllButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  runAllButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  networkControls: {
    backgroundColor: '#2d2d2d', // Fondo oscuro para controles de red
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  networkToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // Texto blanco para etiquetas
  },
  networkPresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: '#ffffff', // Texto blanco para botones preset
  },
  resultsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ffffff', // Texto blanco para títulos de sección
  },
  testResult: {
    backgroundColor: '#2d2d2d', // Fondo oscuro para resultados de test
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#404040', // Border gris oscuro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  testIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    color: '#ffffff', // Texto blanco para nombres de test
  },
  testDuration: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#cccccc', // Texto gris claro para duración
  },
  testResultText: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 32,
    color: '#00ff88', // Verde claro para resultados exitosos
  },
  testError: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 32,
    fontStyle: 'italic',
    color: '#ff6b6b', // Rojo claro para errores
  },
  runSingleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginLeft: 32,
  },
  runSingleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff', // Texto blanco para botones individuales
  },
  quickActions: {
    marginBottom: 24,
  },
  quickActionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
