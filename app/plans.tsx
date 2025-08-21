import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { View, Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import PlanTypeView from '@/components/planType/PlanTypeView';
import PlanView from '@/components/plan/PlanView';
import GymPlanView from '@/components/gym/GymPlanView';
import { authService } from '@/services/authService';
import { gymService, gymPlanSelectedService } from '@/services';
import Colors from '@/constants/Colors';

export default function PlansModal() {
  const [isOwner, setIsOwner] = useState<boolean | null>(null);
  const [gymId, setGymId] = useState<string | null>(null);
  // Usado sólo para forzar refresh de vistas al crear/cambiar plan
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUserPlanTypeId, setActiveUserPlanTypeId] = useState<string | null>(null);
  const [usingFallbackFreePlan, setUsingFallbackFreePlan] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      // Determinar roles: owner o admin
      let userIsOwner = false;
      if (userGymId) {
        try {
          const gymData = await gymService.getCachedGymById(userGymId);
          if (gymData && (gymData.Owner_UserId === userId || gymData.OwnerUserId === userId)) {
            userIsOwner = true;
          }
        } catch {}
      }
      const userIsAdmin = authService.hasRole?.('admin') ?? false;
      const finalIsOwner = userIsOwner || userIsAdmin;
      setIsOwner(finalIsOwner);
      setGymId(userGymId);
    } catch {
      setError('Error al verificar el rol del usuario');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlanCreatedOrChanged = () => {
    setRefreshCounter(c => c + 1);
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
        <GymPlanView
          gymId={gymId}
          onPlanSelected={handlePlanCreatedOrChanged}
          refreshKey={refreshCounter}
        />
      ) : (
        <>
          <PlanView
            showCurrentPlan={true}
            refreshKey={refreshCounter}
            onActivePlanTypeResolved={(planTypeId, isFallback) => {
              setActiveUserPlanTypeId(planTypeId);
              setUsingFallbackFreePlan(isFallback);
            }}
          />
          <PlanTypeView
            onPlanSelected={handlePlanCreatedOrChanged}
            activePlanTypeId={usingFallbackFreePlan ? activeUserPlanTypeId || '4aa8380c-8479-4334-8236-3909be9c842b' : activeUserPlanTypeId || undefined}
            hideActive={true}
          />
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
