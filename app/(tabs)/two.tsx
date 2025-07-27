import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { AuthContainer } from '@/components/auth';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function TabTwoScreen() {
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const colorScheme = useColorScheme();

  const handleAuthSuccess = (userData: any) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleBackFromAuth = () => {
    setShowAuth(false);
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => setUser(null),
      },
    ]);
  };

  if (showAuth) {
    return (
      <AuthContainer
        onAuthSuccess={handleAuthSuccess}
        onBack={handleBackFromAuth}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[colorScheme].tint }]}>
        🏋️ Auth Demo
      </Text>

      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />

      {user ? (
        <View style={styles.userContainer}>
          <Text
            style={[styles.welcomeText, { color: Colors[colorScheme].text }]}
          >
            ¡Bienvenido!
          </Text>
          <Text style={[styles.userName, { color: Colors[colorScheme].tint }]}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={[styles.userEmail, { color: Colors[colorScheme].text }]}>
            {user.email}
          </Text>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              { borderColor: Colors[colorScheme].tint },
            ]}
            onPress={handleLogout}
          >
            <Text
              style={[
                styles.logoutButtonText,
                { color: Colors[colorScheme].tint },
              ]}
            >
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authPrompt}>
          <Text
            style={[styles.promptText, { color: Colors[colorScheme].text }]}
          >
            Demuestra los componentes de autenticación
          </Text>
          <Text
            style={[styles.promptSubtext, { color: Colors[colorScheme].text }]}
          >
            Login y registro con validaciones completas
          </Text>

          <TouchableOpacity
            style={[
              styles.authButton,
              { backgroundColor: Colors[colorScheme].tint },
            ]}
            onPress={() => setShowAuth(true)}
          >
            <Text style={styles.authButtonText}>Probar Autenticación</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  userContainer: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 30,
  },
  logoutButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  authPrompt: {
    alignItems: 'center',
    maxWidth: 300,
  },
  promptText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  promptSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  authButton: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
