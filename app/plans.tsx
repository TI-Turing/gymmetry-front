import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import PlanTypeView from '@/components/planType/PlanTypeView';
import PlanView from '@/components/plan/PlanView';
import GymPlanView from '@/components/gym/GymPlanView';
import { authService } from '@/services/authService';
import Colors from '@/constants/Colors';

export default function PlansModal() {
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [gymId, setGymId] = useState<string | null>(null);
  const [plan, setPlan] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar y refrescar token si es necesario
      const tokenValid = await authService.checkAndRefreshToken();
      if (!tokenValid) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      const userId = authService.getUserId();
      const userGymId = authService.getGymId();

      if (!userId) {
        setError('Usuario no autenticado.');
        return;
      }

      // Obtener datos del gimnasio para verificar si el usuario es el owner
      let gymData = authService.getCachedGym();

      if (!gymData) {
        // Si no hay datos en caché, intentar refrescarlos
        gymData = await authService.refreshGymData();
      }

      if (gymData && gymData.Owner_UserId === userId) {
        setIsOwner(true);
        setGymId(userGymId);
        setPlan(gymData.GymPlanSelecteds || null);
      } else {
        setIsOwner(false);
        setGymId(userGymId);
      }
    } catch {
      setError('Error al verificar el rol del usuario');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planes</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <FontAwesome name='times' size={24} color='#FFFFFF' />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color={Colors.light.tint} />
          <Text style={styles.loadingText}>Verificando permisos...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Planes</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <FontAwesome name='times' size={24} color='#FFFFFF' />
          </TouchableOpacity>
        </View>

        <View style={styles.errorContainer}>
          <FontAwesome name='exclamation-triangle' size={48} color='#FF6B6B' />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={checkUserRole}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isOwner ? 'Planes del Gimnasio' : 'Planes Disponibles'}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <FontAwesome name='times' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
      {isOwner && gymId ? (
        // Vista para propietarios del gimnasio
        <GymPlanView gymId={gymId} onPlanSelected={plan} />
      ) : (
        // Vista para usuarios regulares
        <>
          {/* Mostrar el plan actual del usuario */}
          <PlanView showCurrentPlan={true} />

          {/* Mostrar los tipos de planes disponibles para usuarios */}
          <PlanTypeView />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Para el notch/status bar
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
