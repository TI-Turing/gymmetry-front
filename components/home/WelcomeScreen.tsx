import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import { useColorScheme } from '../useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface WelcomeScreenProps {
  userData?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  onContinue?: () => void;
}

export default function WelcomeScreen({ userData, onContinue }: WelcomeScreenProps) {
  const colorScheme = useColorScheme();
  
  const displayName = userData?.firstName || userData?.username || userData?.email?.split('@')[0] || 'Usuario';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header de bienvenida */}
        <View style={styles.welcomeHeader}>
          <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].tint }]}>
            <FontAwesome 
              name="check-circle" 
              size={60} 
              color="white" 
            />
          </View>
          
          <Text style={[styles.welcomeTitle, { color: Colors[colorScheme].text }]}>
            ¡Bienvenido a Gymmetry!
          </Text>
          
          <Text style={[styles.welcomeSubtitle, { color: Colors[colorScheme].text }]}>
            Hola {displayName}, tu cuenta ha sido creada exitosamente
          </Text>
        </View>

        {/* Información de la cuenta */}
        <View style={[styles.infoCard, { 
          backgroundColor: Colors[colorScheme].background,
          borderColor: Colors[colorScheme].text + '20'
        }]}>
          <Text style={[styles.infoTitle, { color: Colors[colorScheme].text }]}>
            Tu cuenta está lista
          </Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <FontAwesome 
                name="envelope" 
                size={16} 
                color={Colors[colorScheme].tint} 
              />
              <Text style={[styles.infoText, { color: Colors[colorScheme].text }]}>
                {userData?.email || 'Email registrado'}
              </Text>
            </View>
            
            {userData?.firstName && (
              <View style={styles.infoItem}>
                <FontAwesome 
                  name="user" 
                  size={16} 
                  color={Colors[colorScheme].tint} 
                />
                <Text style={[styles.infoText, { color: Colors[colorScheme].text }]}>
                  {userData.firstName} {userData.lastName || ''}
                </Text>
              </View>
            )}
            
            {userData?.username && (
              <View style={styles.infoItem}>
                <FontAwesome 
                  name="at" 
                  size={16} 
                  color={Colors[colorScheme].tint} 
                />
                <Text style={[styles.infoText, { color: Colors[colorScheme].text }]}>
                  @{userData.username}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Características principales */}
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresTitle, { color: Colors[colorScheme].text }]}>
            ¿Qué puedes hacer ahora?
          </Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FontAwesome 
                name="calendar" 
                size={20} 
                color={Colors[colorScheme].tint} 
              />
              <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
                Planifica tus entrenamientos
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <FontAwesome 
                name="line-chart" 
                size={20} 
                color={Colors[colorScheme].tint} 
              />
              <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
                Rastrea tu progreso
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <FontAwesome 
                name="users" 
                size={20} 
                color={Colors[colorScheme].tint} 
              />
              <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
                Conecta con otros usuarios
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón para continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={onContinue}
        >
          <Text style={styles.continueButtonText}>
            Comenzar mi experiencia
          </Text>
          <FontAwesome 
            name="arrow-right" 
            size={18} 
            color="white" 
            style={styles.buttonIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    flex: 1,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
