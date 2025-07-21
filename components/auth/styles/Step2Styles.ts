import { StyleSheet } from 'react-native';

export const step2Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  prefixContainer: {
    width: '25%',
  },
  phoneContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButtonTop: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  skipButtonTopText: {
    fontSize: 16,
    opacity: 0.7,
  },
  skipButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  datePickerContainer: {
    borderRadius: 15,
    padding: 20,
    marginTop: 15,
    borderWidth: 3,
    borderColor: '#ff6300',
    backgroundColor: 'rgba(255, 99, 0, 0.15)',
    shadowColor: '#ff6300',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
});
